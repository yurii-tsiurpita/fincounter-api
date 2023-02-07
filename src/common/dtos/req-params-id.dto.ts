import { IsNumberString } from 'class-validator';

export class ReqParamsIdDto {
    @IsNumberString({ no_symbols: true })
    id: number;
}