const createCategory = {
    tags: ['categories'],
    summary: 'Creates a category',
    requestBody: {
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/CreateCategoryBody' }
            }
        },
        required: true
    },
    responses: {
        201: {
            description: 'Returns created category',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/Category' }
                }
            }
        }
    }
};

const getCategory = {
    tags: ['categories'],
    summary: 'Gets a category by id',
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
            description: 'Returns category',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/Category' }
                }
            }
        }
    }
};

const getCategories = {
    tags: ['categories'],
    summary: 'Gets categories list',
    parameters: [
        {
            name: 'name',
            in: 'query',
            schema: { type: 'string' }
        }
    ],
    responses: {
        200: {
            description: 'Returns categories list',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Category' }
                    }
                }
            }
        }
    }
};

const getStatistics = {
    tags: ['categories'],
    summary: 'Gets categories statistics',
    parameters: [
        {
            name: 'categoryIds',
            in: 'query',
            description: 'Array of category ids to generate statistics for.'
                + ' If you want to get statistics for multiple categories you must provide this param for each category id',
            schema: {
                type: 'array',
                items: { type: 'string' }
            },
        },
        {
            name: 'fromPeriod',
            in: 'query',
            description: 'Must be a date string',
            schema: { type: 'string' },
        },
        {
            name: 'toPeriod',
            in: 'query',
            description: 'Must be a date string',
            schema: { type: 'string' },
        }
    ],
    responses: {
        200: {
            description: 'Returns categories statistics',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/CategoriesStatistics' }
                }
            }
        }
    }
};

const updateCategory = {
    tags: ['categories'],
    summary: 'Updates a category by id',
    parameters: [
        {
            name: 'id',
            in: 'path',
            description: 'Must be a numeric string',
            required: true,
            schema: { type: 'string' }
        }
    ],
    requestBody: {
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/UpdateCategoryBody' }
            }
        },
        required: true
    },
    responses: {
        200: {
            description: 'Returns updated category',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/Category' }
                }
            }
        }
    }
};

const deleteCategory = {
    tags: ['categories'],
    summary: 'Deletes category by id if there are not relative transactions',
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
            description: 'Returns deleted category without id',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/DeletedCategory' }
                }
            }
        }
    }
};

export default {
    '/categories': {
        post: createCategory,
        get: getCategories
    },
    '/categories/statistics': {
        get: getStatistics
    },
    '/categories/{ id }': {
        get: getCategory,
        patch: updateCategory,
        delete: deleteCategory
    }
};