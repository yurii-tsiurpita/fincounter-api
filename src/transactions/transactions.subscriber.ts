import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent } from 'typeorm';
import { Transaction } from './transaction.entity';
import banksService from '../banks/banks.service';

@EventSubscriber()
export class TransactionsSubscriber implements EntitySubscriberInterface<Transaction> {
    listenTo() {
        return Transaction;
    }

    async afterInsert(event: InsertEvent<Transaction>) {
        await banksService.recalculateBalance(event);
    }

    async afterRemove(event: RemoveEvent<Transaction>) {
        await banksService.recalculateBalance(event);
    }
}