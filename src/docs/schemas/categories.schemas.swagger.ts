export default {
    Category: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' }
        },
        required: ['id', 'name']
    },
    CreateCategoryBody: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        required: ['name']
    },
    CategoriesStatistics: {
        type: 'object',
        additionalProperties: { type: 'string' }
    },
    UpdateCategoryBody: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        required: ['name']
    },
    DeletedCategory: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        required: ['name']
    }
};