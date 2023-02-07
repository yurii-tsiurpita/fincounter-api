import { In } from 'typeorm';
import { Bank } from '../banks/bank.entity';
import { Category } from '../categories/category.entity';
import { AppError } from '../errors/app-error.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { GetTransactionsQueryDto } from './dtos/get-transactions-query.dto';
import { Transaction } from './transaction.entity';
import dbService, { DbService } from '../db/db.service';

export class TransactionsService {
    constructor(private dbService: DbService) { }

    async create(createCategoryDto: CreateTransactionDto) {
        return await this.dbService.dataSource.manager.transaction(async (transactionalEntityManager) => {
            const bank = await transactionalEntityManager.findOneBy(Bank, { name: createCategoryDto.bank });
            if (!bank) throw new AppError('Could not find a bank with given name.', 404);

            let categories: Category[] = [];

            for (const categoryName of createCategoryDto.categories) {
                const category = await transactionalEntityManager.findOneBy(Category, { name: categoryName });
                if (category) categories.push(category);
            }

            if (!categories.length) throw new AppError('Could not find any categories with given names.', 404);

            const createdTransaction = transactionalEntityManager.create(
                Transaction,
                {
                    ...createCategoryDto,
                    bank,
                    categories
                }
            );

            return await transactionalEntityManager.save(createdTransaction);
        });
    }

    async findOneById(id: number) {
        const transaction = await this.dbService.transactionsRepo.findOneBy({ id });
        if (!transaction) throw new AppError('Could not find a transaction with given id.', 404);
        return transaction;
    }

    async find({ skip, take, type, banks, categories }: GetTransactionsQueryDto) {
        return await this.dbService.transactionsRepo.find({
            skip,
            take,
            where: {
                type,
                bank: banks ? { name: In(banks) } : undefined,
                categories: categories ? { name: In(categories) } : undefined
            }
        });
    }

    async removeOne(id: number) {
        return await this.dbService.dataSource.manager.transaction(async (transactionalEntityManager) => {
            const transactionToRemove = await transactionalEntityManager.findOneBy(Transaction, { id });
            if (!transactionToRemove) throw new AppError('Could not find a transaction with given id.', 404);
            return await transactionalEntityManager.remove(transactionToRemove);
        });
    }
}

export default new TransactionsService(dbService);