import banksPaths from './paths/banks.paths.swagger';
import banksSchemas from './schemas/banks.schemas.swagger';
import categoriesPaths from './paths/categories.paths.swagger';
import categoriesSchemas from './schemas/categories.schemas.swagger';
import transactionsPaths from './paths/transactions.paths.swagger';
import transactionsSchemas from './schemas/transactions.schemas.swagger';

export default {
    openapi: '3.0.3',
    info: {
        title: 'Fincounter API',
        version: '1.0.0'
    },
    servers: [
        {
            url: `http://localhost:${ process.env.PORT }`,
            description: 'Local development server'
        }
    ],
    tags: [
        { name: 'banks' },
        { name: 'categories' },
        { name: 'transactions' }
    ],
    paths: {
        ...banksPaths,
        ...categoriesPaths,
        ...transactionsPaths
    },
    components: {
        schemas: {
            ...banksSchemas,
            ...categoriesSchemas,
            ...transactionsSchemas
        }
    }
};