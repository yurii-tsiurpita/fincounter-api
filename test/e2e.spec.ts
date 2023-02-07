import { App } from '../src/app';
import dbService from '../src/db/db.service';
import request from 'supertest';
import {
    createBankDto,
    createBankDtos,
    createCategoryDto,
    createCategoryDtos,
    createTransactionDto,
    createTransactionDtos,
    updateBankDto,
    updateCategoryDto
} from './test-data';
import { Bank } from '../src/banks/bank.entity';
import { TransactionType } from '../src/transactions/types/transaction-type.enum';

let app: App = new App();

beforeAll(async () => {
    await app.init();
});

afterAll(async () => {
    await dbService.dataSource.dropDatabase();
    await app.close();
});

describe('Banks API', () => {
    describe('Create bank', () => {
        describe('Valid body', () => {
            let createBankRes: request.Response;

            beforeAll(async () => {
                createBankRes = await request(app.server)
                    .post('/banks')
                    .send(createBankDto);
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 201 status code', () => {
                expect(createBankRes.statusCode).toBe(201);
            });
        });

        describe('Invalid body', () => {
            let createBankRes: request.Response;

            beforeAll(async () => {
                createBankRes = await request(app.server)
                    .post('/banks')
                    .send({ balance: 100 });
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 422 status code', () => {
                expect(createBankRes.statusCode).toBe(422);
            });
        });
    });

    describe('Get bank', () => {
        describe('Valid id', () => {
            let createBankRes: request.Response;
            let getBankRes: request.Response;

            beforeAll(async () => {
                createBankRes = await request(app.server)
                    .post('/banks')
                    .send(createBankDto);

                getBankRes = await request(app.server).get(`/banks/${ createBankRes.body.id }`);
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(getBankRes.statusCode).toBe(200);
            });

            it('returns bank with correct id', () => {
                expect(getBankRes.body.id).toBe(createBankRes.body.id);
            });
        });

        describe('Invalid id', () => {
            let createBankRes: request.Response;
            let getBankRes: request.Response;

            beforeAll(async () => {
                createBankRes = await request(app.server)
                    .post('/banks')
                    .send(createBankDto);

                getBankRes = await request(app.server).get(`/banks/invalid-id`);
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 422 status code', () => {
                expect(getBankRes.statusCode).toBe(422);
            });
        });
    });

    describe('Get banks', () => {
        describe('Valid name query param', () => {
            let getBanksRes: request.Response;

            beforeAll(async () => {
                for (let i = 0; i < 2; i++) {
                    await request(app.server)
                        .post('/banks')
                        .send(createBankDtos[i]);
                }

                getBanksRes = await request(app.server).get(
                    `/banks?name=${ createBankDtos[0].name }`
                );
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(getBanksRes.statusCode).toBe(200);
            });

            it('returns one bank', () => {
                expect(getBanksRes.body.length).toBe(1);
            });

            it('returns expected bank', () => {
                expect(getBanksRes.body[0].name).toBe(createBankDtos[0].name);
            });
        });

        describe('No match', () => {
            let getBanksRes: request.Response;

            beforeAll(async () => {
                getBanksRes = await request(app.server).get(
                    `/banks?name=some-bank-name`
                );
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(getBanksRes.statusCode).toBe(200);
            });

            it('returns empty array', () => {
                expect(getBanksRes.body.length).toBe(0);
            });
        });
    });

    describe('Update bank', () => {
        describe('Valid body', () => {
            let createBankRes: request.Response;
            let updateBankRes: request.Response;

            beforeAll(async () => {
                createBankRes = await request(app.server)
                    .post('/banks')
                    .send(createBankDto);

                updateBankRes = await request(app.server)
                    .patch(`/banks/${ createBankRes.body.id }`)
                    .send(updateBankDto);
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(updateBankRes.statusCode).toBe(200);
            });

            it('returns bank with updated data', () => {
                expect(updateBankRes.body.name).toBe(updateBankDto.name);
            });
        });

        describe('Bank with given name already exists', () => {
            let createBankRes: request.Response;
            let updateBankRes: request.Response;

            beforeAll(async () => {
                for (let i = 0; i < 2; i++) {
                    createBankRes = await request(app.server)
                        .post('/banks')
                        .send(createBankDtos);
                }

                updateBankRes = await request(app.server)
                    .patch(`/banks/${ createBankRes.body.id }`)
                    .send({ name: createBankDtos[1].name });
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 422 status code', () => {
                expect(updateBankRes.statusCode).toBe(422);
            });
        });
    });

    describe('Remove bank', () => {
        describe('Success', () => {
            let createBankRes: request.Response;
            let removeBankRes: request.Response;

            beforeAll(async () => {
                createBankRes = await request(app.server)
                    .post('/banks')
                    .send(createBankDto);

                removeBankRes = await request(app.server).delete(`/banks/${ createBankRes.body.id }`);
            });

            afterAll(async () => {
                await dbService.banksRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(removeBankRes.statusCode).toBe(200);
            });
        });

        describe('Fail if has transactions', () => {
            let createBankRes: request.Response;
            let removeBankRes: request.Response;

            beforeAll(async () => {
                createBankRes = await request(app.server)
                    .post('/banks')
                    .send(createBankDto);

                await request(app.server)
                    .post('/categories')
                    .send(createCategoryDto);

                await request(app.server)
                    .post('/transactions/createWebhook')
                    .set('fincounter-api-key', process.env.API_KEY!)
                    .send(createTransactionDto);

                removeBankRes = await request(app.server).delete(`/banks/${ createBankRes.body.id }`);
            });

            afterAll(async () => {
                await dbService.transactionsRepo.delete({ });
                await dbService.banksRepo.delete({ });
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 422 status code', () => {
                expect(removeBankRes.statusCode).toBe(422);
            });
        });
    });
});

describe('Categories API', () => {
    describe('Create category', () => {
        describe('Valid body', () => {
            let createCategoryRes: request.Response;

            beforeAll(async () => {
                createCategoryRes = await request(app.server)
                    .post('/categories')
                    .send(createCategoryDto);
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 201 status code', () => {
                expect(createCategoryRes.statusCode).toBe(201);
            });
        });

        describe('Invalid body', () => {
            let createCategoryRes: request.Response;

            beforeAll(async () => {
                createCategoryRes = await request(app.server)
                    .post('/categories')
                    .send({ name: ['invalid-category-name'] });
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 422 status code', () => {
                expect(createCategoryRes.statusCode).toBe(422);
            });
        });
    });

    describe('Get category', () => {
        describe('Valid id', () => {
            let createCategoryRes: request.Response;
            let getCategoryRes: request.Response;

            beforeAll(async () => {
                createCategoryRes = await request(app.server)
                    .post('/categories')
                    .send(createCategoryDto);

                getCategoryRes = await request(app.server).get(`/categories/${ createCategoryRes.body.id }`);
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(getCategoryRes.statusCode).toBe(200);
            });

            it(`returns category with correct id`, () => {
                expect(getCategoryRes.body.id).toBe(createCategoryRes.body.id);
            });
        });

        describe('Invalid id', () => {
            let createCategoryRes: request.Response;
            let getCategoryRes: request.Response;

            beforeAll(async () => {
                createCategoryRes = await request(app.server)
                    .post('/categories')
                    .send(createCategoryDto);

                    getCategoryRes = await request(app.server).get(`/categories/invalid-id`);
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 422 status code', () => {
                expect(getCategoryRes.statusCode).toBe(422);
            });
        });
    });

    describe('Get categories', () => {
        describe('Valid name query param', () => {
            let getCategoriesRes: request.Response;

            beforeAll(async () => {
                for (let i = 0; i < 2; i++) {
                    await request(app.server)
                        .post('/categories')
                        .send(createCategoryDtos[i]);
                }

                getCategoriesRes = await request(app.server).get(
                    `/categories?name=${ createCategoryDtos[0].name }`
                );
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(getCategoriesRes.statusCode).toBe(200);
            });

            it('returns one category', () => {
                expect(getCategoriesRes.body.length).toBe(1);
            });

            it('returns expected category', () => {
                expect(getCategoriesRes.body[0].name).toBe(createCategoryDtos[0].name);
            });
        });

        describe('No match', () => {
            let getCategoriesRes: request.Response;

            beforeAll(async () => {
                getCategoriesRes = await request(app.server).get(
                    `/categories?name=some-category-name`
                );
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(getCategoriesRes.statusCode).toBe(200);
            });

            it('returns empty array', () => {
                expect(getCategoriesRes.body.length).toBe(0);
            });
        });
    });

    describe('Get statistics', () => {
        let categoryIds: number[] = [];
        let fromPeriod: string;

        beforeAll(async () => {
            for (let i = 0; i < 3; i++) {
                await request(app.server)
                    .post('/banks')
                    .send(createBankDtos[i]);
            }

            for (let i = 0; i < 4; i++) {
                const createCategoryRes = await request(app.server)
                    .post('/categories')
                    .send(createCategoryDtos[i]);

                categoryIds.push(createCategoryRes.body.id);
            }

            for (let i = 0; i < 4; i++) {
                const createTransactionRes = await request(app.server)
                    .post('/transactions/createWebhook')
                    .set('fincounter-api-key', process.env.API_KEY!)
                    .send(createTransactionDtos[i]);

                if (i === 0) fromPeriod = createTransactionRes.body.createdAt;
            }
        });

        afterAll(async () => {
            await dbService.transactionsRepo.delete({ });
            await dbService.banksRepo.delete({ });
            await dbService.categoriesRepo.delete({ });
        });

        describe('Success', () => {
            let getStatisticsRes: request.Response;

            beforeAll(async () => {
                getStatisticsRes = await request(app.server).get(
                    '/categories/statistics?'
                    + `categoryIds=${ categoryIds[0] }`
                    + `&categoryIds=${ categoryIds[2] }`
                    + `&fromPeriod=${ fromPeriod }`
                );
            });

            it('returns 200 status code', () => {
                expect(getStatisticsRes.statusCode).toBe(200);
            });

            it('returns expected object', () => {
                expect(getStatisticsRes.body).toEqual({
                    Salary: '+578,12',
                    Sport: '-678,53'
                });
            });
        });

        describe('Not date string', () => {
            let getStatisticsRes: request.Response;

            beforeAll(async () => {
                getStatisticsRes = await request(app.server).get(
                    '/categories/statistics?fromPeriod=invalid-value'
                );
            });

            it('returns 422 status code', () => {
                expect(getStatisticsRes.statusCode).toBe(422);
            });
        });
    });

    describe('Update category', () => {
        describe('Valid body', () => {
            let createCategoryRes: request.Response;
            let updateCategoryRes: request.Response;

            beforeAll(async () => {
                createCategoryRes = await request(app.server)
                    .post('/categories')
                    .send(createCategoryDto);

                updateCategoryRes = await request(app.server)
                    .patch(`/categories/${ createCategoryRes.body.id }`)
                    .send(updateCategoryDto);
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(updateCategoryRes.statusCode).toBe(200);
            });

            it('returns category with updated data', () => {
                expect(updateCategoryRes.body.name).toBe(updateCategoryDto.name);
            });
        });

        describe('Category with given name already exists', () => {
            let createCategoryRes: request.Response;
            let updateCategoryRes: request.Response;

            beforeAll(async () => {
                for (let i = 0; i < 2; i++) {
                    createCategoryRes = await request(app.server)
                        .post('/categories')
                        .send(createCategoryDtos);
                }

                updateCategoryRes = await request(app.server)
                    .patch(`/categories/${ createCategoryRes.body.id }`)
                    .send({ name: createCategoryDtos[1].name });
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 422 status code', () => {
                expect(updateCategoryRes.statusCode).toBe(422);
            });
        });
    });

    describe('Remove category', () => {
        describe('Success', () => {
            let createCategoryRes: request.Response;
            let removeCategoryRes: request.Response;

            beforeAll(async () => {
                createCategoryRes = await request(app.server)
                    .post('/categories')
                    .send(createCategoryDto);

                    removeCategoryRes = await request(app.server).delete(`/categories/${ createCategoryRes.body.id }`);
            });

            afterAll(async () => {
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(removeCategoryRes.statusCode).toBe(200);
            });
        });

        describe('Fail if has transactions', () => {
            let createCategoryRes: request.Response;
            let removeCategoryRes: request.Response;

            beforeAll(async () => {
                await request(app.server)
                    .post('/banks')
                    .send(createBankDto);

                createCategoryRes = await request(app.server)
                    .post('/categories')
                    .send(createCategoryDto);

                await request(app.server)
                    .post('/transactions/createWebhook')
                    .set('fincounter-api-key', process.env.API_KEY!)
                    .send(createTransactionDto);

                removeCategoryRes = await request(app.server).delete(`/categories/${ createCategoryRes.body.id }`);
            });

            afterAll(async () => {
                await dbService.transactionsRepo.delete({ });
                await dbService.banksRepo.delete({ });
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 422 status code', () => {
                expect(removeCategoryRes.statusCode).toBe(422);
            });
        });
    });
});

describe('Transactions API', () => {
    describe('Create transaction webhook', () => {
        let createBankRes: request.Response;

        beforeAll(async () => {
            createBankRes = await request(app.server)
                .post('/banks')
                .send(createBankDto);

            await request(app.server)
                .post('/categories')
                .send(createCategoryDto);
        });

        afterAll(async () => {
            await dbService.transactionsRepo.delete({ });
            await dbService.banksRepo.delete({ });
            await dbService.categoriesRepo.delete({ });
        });

        describe('Valid body', () => {
            let createTransactionRes: request.Response;
            let relatedBank: Bank | null;

            beforeAll(async () => {
                createTransactionRes = await request(app.server)
                    .post('/transactions/createWebhook')
                    .set('fincounter-api-key', process.env.API_KEY!)
                    .send({
                        ...createTransactionDto,
                        name: createBankDto.name
                    });

                relatedBank = await dbService.banksRepo.findOneBy({ id: createBankRes.body.id });
            });

            afterAll(async () => {
                await dbService.transactionsRepo.delete({ });
            });

            it('returns 201 status code', () => {
                expect(createTransactionRes.statusCode).toBe(201);
            });

            it('related bank balance was recalculated', () => {
                expect(relatedBank?.balance).toBe(100.77);
            });
        });

        describe('Invalid fincounter-api-key header', () => {
            let createTransactionRes: request.Response;

            beforeAll(async () => {
                createTransactionRes = await request(app.server)
                    .post('/transactions/createWebhook')
                    .set('fincounter-api-key', 'invalid-fincounter-api-key')
                    .send(createTransactionDto);
            });

            afterAll(async () => {
                await dbService.transactionsRepo.delete({ });
            });

            it('returns 401 status code', () => {
                expect(createTransactionRes.statusCode).toBe(401);
            });
        });

        describe('Provided category does not exist', () => {
            let createTransactionRes: request.Response;

            beforeAll(async () => {
                createTransactionRes = await request(app.server)
                    .post('/transactions/createWebhook')
                    .set('fincounter-api-key', process.env.API_KEY!)
                    .send({
                        ...createTransactionDto,
                        categories: ['invalid-category']
                    });
            });

            afterAll(async () => {
                await dbService.transactionsRepo.delete({ });
            });

            it('returns 404 status code', () => {
                expect(createTransactionRes.statusCode).toBe(404);
            });
        });
    });

    describe('Get transactions', () => {
        beforeAll(async () => {
            for (let i = 0; i < 3; i++) {
                await request(app.server)
                    .post('/banks')
                    .send(createBankDtos[i]);
            }

            for (let i = 0; i < 4; i++) {
                await request(app.server)
                    .post('/categories')
                    .send(createCategoryDtos[i]);
            }

            for (let i = 0; i < 4; i++) {
                await request(app.server)
                    .post('/transactions/createWebhook')
                    .set('fincounter-api-key', process.env.API_KEY!)
                    .send(createTransactionDtos[i]);
            }
        });

        afterAll(async () => {
            await dbService.transactionsRepo.delete({ });
            await dbService.banksRepo.delete({ });
            await dbService.categoriesRepo.delete({ });
        });

        describe('Valid query params', () => {
            let getTransactionsRes: request.Response;

            beforeAll(async () => {
                getTransactionsRes = await request(app.server).get(
                    '/transactions?'
                    + `type=${ TransactionType.Consumable }`
                    + '&categories=Sport'
                    + '&categories=Education'
                );
            });

            it('returns 200 status code', () => {
                expect(getTransactionsRes.statusCode).toBe(200);
            });

            it('returns array with 2 items', () => {
                expect(getTransactionsRes.body.length).toBe(2);
            });
        });

        describe('Skip 1', () => {
            let getTransactionsRes: request.Response;

            beforeAll(async () => {
                getTransactionsRes = await request(app.server).get(
                    '/transactions?skip=1'
                );
            });

            it('returns 200 status code', () => {
                expect(getTransactionsRes.statusCode).toBe(200);
            });

            it('returns array with 3 items', () => {
                expect(getTransactionsRes.body.length).toBe(3);
            });
        });

        describe('Take param is not numeric string', () => {
            let getTransactionsRes: request.Response;

            beforeAll(async () => {
                getTransactionsRes = await request(app.server).get(
                    '/transactions?take=invalid-type'
                );
            });

            it('returns 422 status code', () => {
                expect(getTransactionsRes.statusCode).toBe(422);
            });
        });
    });

    describe('Remove transaction', () => {
        let removeTransactionRes: request.Response;
        let createTransactionRes: request.Response;
        let relatedBank: Bank | null;

        describe('Success', () => {
            beforeAll(async () => {
                for (let i = 0; i < 3; i++) {
                    await request(app.server)
                        .post('/banks')
                        .send(createBankDtos[i]);
                }

                for (let i = 0; i < 4; i++) {
                    await request(app.server)
                        .post('/categories')
                        .send(createCategoryDtos[i]);
                }

                for (let i = 0; i < 4; i++) {
                    createTransactionRes = await request(app.server)
                        .post('/transactions/createWebhook')
                        .set('fincounter-api-key', process.env.API_KEY!)
                        .send(createTransactionDtos[i]);
                }

                removeTransactionRes = await request(app.server).delete(
                    `/transactions/${ createTransactionRes.body.id }`
                );

                relatedBank = await dbService.banksRepo.findOneBy({ id: removeTransactionRes.body.bank.id });
            });

            afterAll(async () => {
                await dbService.transactionsRepo.delete({ });
                await dbService.banksRepo.delete({ });
                await dbService.categoriesRepo.delete({ });
            });

            it('returns 200 status code', () => {
                expect(removeTransactionRes.statusCode).toBe(200);
            });

            it('forces to recalculate related bank balance', () => {
                expect(relatedBank?.balance).toBe(100.77);
            });
        });
    });
});