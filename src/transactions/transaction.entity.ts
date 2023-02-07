import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn
} from 'typeorm';
import { Bank } from '../banks/bank.entity';
import { Category } from '../categories/category.entity';
import { StringToDecimalTransformer } from '../common/transformers/string-to-decimal.transformer';
import { TransactionType } from './types/transaction-type.enum';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'decimal', scale: 2, transformer: new StringToDecimalTransformer() })
    amount: number

    @Column()
    type: TransactionType

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Bank, bank => bank.transactions, {
        eager: true
    })
    bank: Bank

    @ManyToMany(() => Category, category => category.transactions, {
        eager: true
    })
    @JoinTable()
    categories: Category[]
}