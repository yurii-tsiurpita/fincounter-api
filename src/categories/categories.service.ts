import { In } from 'typeorm';
import dbService, { DbService } from '../db/db.service';
import { AppError } from '../errors/app-error.entity';
import { TransactionType } from '../transactions/types/transaction-type.enum';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { GetCategoriesQueryDto } from './dtos/get-categories-query.dto';
import { GetStatisticsQueryDto } from './dtos/get-statistics-query.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

export class CategoriesService {
    constructor(private dbService: DbService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const createdCategory = this.dbService.categoriesRepo.create(createCategoryDto);
        return await this.dbService.categoriesRepo.save(createdCategory);
    }

    async findOneById(id: number) {
        const category = await this.dbService.categoriesRepo.findOneBy({ id });
        if (!category) throw new AppError('Could not find a category with given id.', 404);
        return category;
    }

    async findOneByName(name: string) {
        return await this.dbService.categoriesRepo.findOneBy({ name });
    }

    async find({ name }: GetCategoriesQueryDto) {
        return await this.dbService.categoriesRepo.findBy({ name });
    }

    async updateOne({ name }: UpdateCategoryDto, id: number) {
        const categoryToUpdate = await this.findOneById(id);
        categoryToUpdate.name = name;
        return await this.dbService.categoriesRepo.save(categoryToUpdate);
    }

    async removeOne(id: number) {
        const categoryToRemove = await this.findOneById(id);
        return await this.dbService.categoriesRepo.remove(categoryToRemove);
    }

    async getStatistics({ categoryIds, fromPeriod, toPeriod }: GetStatisticsQueryDto) {
        const categories = await this.dbService.categoriesRepo.find({
            relations: {
                transactions: true
            },
            where: categoryIds ? { id: In(categoryIds) } : undefined
        });

        const filteredCategories = categories.map(category => {
            const filteredTransactions = category.transactions.filter(transaction => {
                if (!toPeriod && !fromPeriod) return true;

                let isFromPeriod;
                let isToPeriod;

                if (fromPeriod) isFromPeriod = transaction.createdAt.getTime() >= new Date(fromPeriod).getTime();
                if (toPeriod) isToPeriod = transaction.createdAt.getTime() <= new Date(toPeriod).getTime();

                if (
                    (!toPeriod && fromPeriod && isFromPeriod)
                    || (toPeriod && !fromPeriod && isToPeriod)
                    || (toPeriod && fromPeriod && isFromPeriod && isToPeriod)
                ) return transaction;
            })

            return {
                ...category,
                transactions: filteredTransactions
            };
        });

        const statistics: Record<string, any> = { };
        const numberFormat = new Intl.NumberFormat(undefined, { signDisplay: 'exceptZero' });

        filteredCategories.forEach(category => {
            statistics[category.name] = 0;
            category.transactions.forEach(transaction => {
                transaction.categories.forEach(innerCategory => {
                    if (innerCategory.name === category.name) {
                        if (transaction.type === TransactionType.Profitable) {
                            statistics[category.name] += transaction.amount;
                        }

                        if (transaction.type === TransactionType.Consumable) {
                            statistics[category.name] -= transaction.amount;
                        }
                    }
                });
            });

            statistics[category.name] = numberFormat.format(statistics[category.name]);
        });

        return statistics;
    }
}

export default new CategoriesService(dbService);