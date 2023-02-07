import { ArrayNotEmpty, IsArray, IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';
import { TransactionType } from '../types/transaction-type.enum';

export class CreateTransactionDto {
    @IsDefined()
    @IsNumber()
    amount: number;

    @IsDefined()
    @IsString()
    @IsEnum(TransactionType)
    type: TransactionType;

    @IsDefined()
    @IsString()
    bank: string;

    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    categories: string[];
}