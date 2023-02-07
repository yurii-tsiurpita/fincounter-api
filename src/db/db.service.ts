import configService from '../config/config.service';
import { DataSource, Repository } from 'typeorm';
import { Bank } from '../banks/bank.entity';
import { Category } from '../categories/category.entity';
import { Transaction } from '../transactions/transaction.entity';
import { TransactionsSubscriber } from '../transactions/transactions.subscriber';

export class DbService {
    dataSource = new DataSource({
        type: 'postgres',
        host: configService.dbHost,
        port: configService.dbPort,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Bank, Category, Transaction],
        subscribers: [TransactionsSubscriber],
        synchronize: true
    });

    banksRepo: Repository<Bank>;
    categoriesRepo: Repository<Category>;
    transactionsRepo: Repository<Transaction>;

    async connect() {
        await this.dataSource.initialize();
        this.getRepositories();
        console.log('[DbService] Database is successfully connected.');
    }

    async getRepositories() {
        this.banksRepo = this.dataSource.getRepository(Bank);
        this.categoriesRepo = this.dataSource.getRepository(Category);
        this.transactionsRepo = this.dataSource.getRepository(Transaction);
    }

    async clearDb() {
        await this.transactionsRepo.createQueryBuilder().delete().from(Transaction).execute();
        await this.banksRepo.createQueryBuilder().delete().from(Bank).execute();
        await this.categoriesRepo.createQueryBuilder().delete().from(Category).execute();
    }

    async disconnect() {
        await this.dataSource.destroy();
    }
}

export default new DbService();