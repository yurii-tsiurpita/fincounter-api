import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @ManyToMany(() => Transaction, transaction => transaction.categories, {
        onDelete: 'RESTRICT'
    })
    @JoinTable()
    transactions: Transaction[]

    @BeforeInsert()
    @BeforeUpdate()
    titleCaseName() {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    };
}