import { TransactionType } from '../../transactions/types/transaction-type.enum';

const createTransaction = {
    tags: ['transactions'],
    summary: 'A webhook that creates a transaction',
    requestBody: {
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/CreateTransactionBody' }
            }
        },
        required: true
    },
    parameters: [
        {
            name: 'fincounter-api-key',
            in: 'header',
            required: true,
            schema: { type: 'string' },
            examples: {
                'fincounter-api-key': {
                    value: 'bbae4ace7119da508eb640ed327bfb226c0006665699c7453893357fc5b76e4e15ae1fd7f456d8a912615e7232cc278876b1a2ccf7fa53fa37a83833ce55486f'
                }
            }
        }
    ],
    responses: {
        201: {
            description: 'Returns created transaction',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/Transaction' }
                }
            }
        }
    }
};

const getTransactions = {
    tags: ['transactions'],
    summary: 'Gets transactions list',
    parameters: [
        {
            name: 'type',
            in: 'query',
            schema: {
                type: 'string',
                enum: [TransactionType.Consumable, TransactionType.Profitable]
            }
        },
        {
            name: 'banks',
            in: 'query',
            description: 'Names of banks',
            schema: {
                type: 'array',
                items: { type: 'string' }
            }
        },
        {
            name: 'categories',
            in: 'query',
            description: 'Names of categories',
            schema: {
                type: 'array',
                items: { type: 'string' }
            }
        },
        {
            name: 'skip',
            in: 'query',
            description: 'Numeric string, for pagination',
            schema: { type: 'string' }
        },
        {
            name: 'take',
            in: 'query',
            description: 'Numeric string, for pagination',
            schema: { type: 'string' }
        }
    ],
    responses: {
        200: {
            description: 'Returns transactions list',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Transaction' }
                    }
                }
            }
        }
    }
};

const deleteTransaction = {
    tags: ['transactions'],
    summary: 'Deletes transaction by id',
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'Must be a numeric string',
            required: true,
            schema: { type: 'string' }
        }
    ],
    responses: {
        200: {
            description: 'Returns deleted transaction without id',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/DeletedTransaction' }
                }
            }
        }
    }
};

export default {
    '/transactions': {
        get: getTransactions
    },
    '/transactions/createWebhook': {
        post: createTransaction
    },
    '/transactions/{ id }': {
        delete: deleteTransaction
    }
};