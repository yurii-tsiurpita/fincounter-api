import { IsString } from 'class-validator';

export class GetCategoriesQueryDto {
    @IsString()
    name?: string;
}