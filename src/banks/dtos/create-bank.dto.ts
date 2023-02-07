import { IsDefined, IsString } from 'class-validator';

export class CreateBankDto {
    @IsDefined()
    @IsString()
    name: string;
}