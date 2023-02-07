import { IsString } from 'class-validator';

export class GetBanksQueryDto {
    @IsString()
    name?: string;
}