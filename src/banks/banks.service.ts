import { InsertEvent, RemoveEvent } from 'typeorm';
import dbService, { DbService } from '../db/db.service';
import { AppError } from '../errors/app-error.entity';
import { Transaction } from '../transactions/transaction.entity';
import { TransactionType } from '../transactions/types/transaction-type.enum';
import { Bank } from './bank.entity';
import { CreateBankDto } from './dtos/create-bank.dto';
import { GetBanksQueryDto } from './dtos/get-banks-query.dto';
import { UpdateBankDto } from './dtos/update-bank.dto';

export class BanksService {
    constructor(private dbService: DbService) { }

    async create(createBankDto: CreateBankDto) {
        const createdBank = this.dbService.banksRepo.create(createBankDto);
        return await this.dbService.banksRepo.save(createdBank);
    }

    async findOneById(id: number) {
        const bank = await this.dbService.banksRepo.findOneBy({ id });
        if (!bank) throw new AppError('Could not find a bank with given id.', 404);
        return bank;
    }

    async findOneByName(name: string) {
        return await this.dbService.banksRepo.findOneBy({ name });
    }

    async find(getBanksQueryDto: GetBanksQueryDto) {
        return await this.dbService.banksRepo.findBy(getBanksQueryDto);
    }

    async updateOne({ name }: UpdateBankDto, id: number) {
        const bankToUpdate = await this.findOneById(id);
        bankToUpdate.name = name;
        return await this.dbService.banksRepo.save(bankToUpdate);
    }

    async removeOne(id: number) {
        const bankToRemove = await this.findOneById(id);
        return await this.dbService.banksRepo.remove(bankToRemove);
    }

    async recalculateBalance(event: InsertEvent<Transaction> | RemoveEvent<Transaction>) {
        if (!event.entity) return;

        const transactions = await event.manager.findBy(
            Transaction,
            { bank: { name: event.entity.bank.name } }
        );

        let newBalance: number = 0;

        transactions.forEach(transaction => {
            if (transaction.type === TransactionType.Profitable) {
                newBalance += transaction.amount;
            }

            if (transaction.type === TransactionType.Consumable) {
                newBalance -= transaction.amount;
            }
        });

        const bank = await event.manager.findOneBy(
            Bank,
            { name: event.entity.bank.name }
        );

        if (!bank) throw new AppError('Could not find a bank to update balance.', 404);

        bank.balance = newBalance;
        await event.manager.save(bank);
    }
}

export default new BanksService(dbService);