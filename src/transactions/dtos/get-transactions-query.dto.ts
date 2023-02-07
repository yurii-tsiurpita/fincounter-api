import { Transform } from 'class-transformer';
import { IsString, IsEnum, IsNumber, ArrayNotEmpty, IsArray } from 'class-validator';
import { TransactionType } from '../types/transaction-type.enum';

export class GetTransactionsQueryDto {
    @IsString()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @Transform(({ value }) => {
        if (!Array.isArray(value)) return [value];
        return value;
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    banks?: string[];

    @Transform(({ value }) => {
        if (!Array.isArray(value)) return [value];
        return value;
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    categories?: string[];

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    skip?: number;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    take?: number;
}