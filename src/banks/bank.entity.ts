import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { StringToDecimalTransformer } from '../common/transformers/string-to-decimal.transformer';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Bank {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column({ type: 'decimal', scale: 2, default: 0, transformer: new StringToDecimalTransformer() })
    balance: number

    @OneToMany(() => Transaction, transaction => transaction.bank, {
        onDelete: 'RESTRICT'
    })
    transactions: Transaction[]

    @BeforeInsert()
    @BeforeUpdate()
    titleCaseName() {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    };
}