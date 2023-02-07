import { IsDefined, IsString } from 'class-validator';

export class UpdateCategoryDto {
    @IsString()
    @IsDefined()
    name: string;
}