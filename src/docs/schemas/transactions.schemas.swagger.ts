import { TransactionType } from '../../transactions/types/transaction-type.enum';

export default {
    Transaction: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            amount: { type: 'number' },
            type: {
                type: 'string',
                enum: TransactionType
            },
            createdAt: { type: 'string' },
            bank: { $ref: '#/components/schemas/Bank' },
            categories: {
                type: 'array',
                items: { $ref: '#/components/schemas/Category' }
            }
        },
        required: ['id', 'amount', 'type', 'createdAt', 'bank', 'categories']
    },
    CreateTransactionBody: {
        type: 'object',
        properties: {
            amount: { type: 'number' },
            type: {
                type: 'string',
                enum: TransactionType
            },
            bank: { type: 'string' },
            categories: {
                type: 'array',
                items: { type: 'string' }
            }
        },
        required: ['amount', 'type', 'bank', 'categories']
    },
    DeletedTransaction: {
        type: 'object',
        properties: {
            amount: { type: 'number' },
            type: {
                type: 'string',
                enum: TransactionType
            },
            createdAt: { type: 'string' },
            bank: { $ref: '#/components/schemas/Bank' },
            categories: {
                type: 'array',
                items: { $ref: '#/components/schemas/Category' }
            }
        },
        required: ['amount', 'type', 'createdAt', 'bank', 'categories']
    }
};