import { IsString, IsDefined, Equals } from 'class-validator';

export class GetTransactionsHeadersDto {
    @IsDefined({ message: 'fincounter-api-key header is required' })
    @IsString()
    @Equals(
        process.env.API_KEY,
        { message: 'invalid fincounter-api-key header' }
    )
    'fincounter-api-key': string;
}