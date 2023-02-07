export default {
    Bank: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            balance: { type: 'number' }
        },
        required: ['id', 'name', 'balance']
    },
    CreateBankBody: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        required: ['name']
    },
    UpdateBankBody: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        required: ['name']
    },
    DeletedBank: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            balance: { type: 'number' }
        },
        required: ['name', 'balance']
    }
};