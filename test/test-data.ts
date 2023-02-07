import { CreateBankDto } from '../src/banks/dtos/create-bank.dto';
import { UpdateBankDto } from '../src/banks/dtos/update-bank.dto';
import { CreateCategoryDto } from '../src/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from '../src/categories/dtos/update-category.dto';
import { CreateTransactionDto } from '../src/transactions/dtos/create-transaction.dto';
import { TransactionType } from '../src/transactions/types/transaction-type.enum';

export const createBankDto: CreateBankDto = {
    name: 'Monobank'
};

export const createBankDto2: CreateBankDto = {
    name: 'Privat'
};

export const createBankDto3: CreateBankDto = {
    name: 'Novo'
};

export const updateBankDto: UpdateBankDto = {
    name: 'Oschadbank'
};

export const createBankDtos: CreateBankDto[] = [
    createBankDto,
    createBankDto2,
    createBankDto3
];

export const createCategoryDto: CreateCategoryDto = {
    name: 'Salary'
};

export const createCategoryDto2: CreateCategoryDto = {
    name: 'Education'
};

export const createCategoryDto3: CreateCategoryDto = {
    name: 'Sport'
};

export const createCategoryDto4: CreateCategoryDto = {
    name: 'Trade'
};

export const createCategoryDtos: CreateCategoryDto[] = [
    createCategoryDto,
    createCategoryDto2,
    createCategoryDto3,
    createCategoryDto4
];

export const updateCategoryDto: UpdateCategoryDto = {
    name: 'Health'
};

export const createTransactionDto: CreateTransactionDto = {
    amount: 100.77,
    type: TransactionType.Profitable,
    bank: 'Monobank',
    categories: ['Salary']
};

export const createTransactionDto2: CreateTransactionDto = {
    amount: 200.9,
    type: TransactionType.Consumable,
    bank: 'Privat',
    categories: ['Education']
};

export const createTransactionDto3: CreateTransactionDto = {
    amount: 477.345,
    type: TransactionType.Profitable,
    bank: 'Novo',
    categories: ['Trade', 'Salary']
};

export const createTransactionDto4: CreateTransactionDto = {
    amount: 678.5345,
    type: TransactionType.Consumable,
    bank: 'Monobank',
    categories: ['Sport', 'Education']
};

export const createTransactionDtos: CreateTransactionDto[] = [
    createTransactionDto,
    createTransactionDto2,
    createTransactionDto3,
    createTransactionDto4
];