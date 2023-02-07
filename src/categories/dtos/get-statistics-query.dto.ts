import { Transform } from 'class-transformer';
import { IsDateString, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class GetStatisticsQueryDto {
    @Transform(({ value }) => {
        if (!Array.isArray(value)) return [parseInt(value)];
        return value.map((id: string) => parseInt(id))
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber(undefined, { each: true })
    categoryIds?: number[];

    @IsDateString()
    fromPeriod?: string;

    @IsDateString()
    toPeriod?: string;
}