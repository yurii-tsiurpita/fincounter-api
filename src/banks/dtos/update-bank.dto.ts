import { IsDefined, IsString } from 'class-validator';

export class UpdateBankDto {
    @IsString()
    @IsDefined()
    name: string;
}