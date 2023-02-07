const createBank = {
    tags: ['banks'],
    summary: 'Creates a bank',
    requestBody: {
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/CreateBankBody' }
            }
        },
        required: true
    },
    responses: {
        201: {
            description: 'Returns created bank',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/Bank' }
                }
            }
        }
    }
};

const getBank = {
    tags: ['banks'],
    summary: 'Gets a bank by id',
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
            description: 'Returns bank',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/Bank' }
                }
            }
        }
    }
};

const getBanks = {
    tags: ['banks'],
    summary: 'Gets banks list',
    parameters: [
        {
            name: 'name',
            in: 'query',
            schema: { type: 'string' },
        }
    ],
    responses: {
        200: {
            description: 'Returns banks list',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Bank'
                        }
                    }
                }
            }
        }
    }
};

const updateBank = {
    tags: ['banks'],
    summary: 'Updates a bank by id',
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
                schema: { $ref: '#/components/schemas/UpdateBankBody' }
            }
        },
        required: true
    },
    responses: {
        200: {
            description: 'Returns updated bank',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/Bank' }
                }
            }
        }
    }
};

const deleteBank = {
    tags: ['banks'],
    summary: 'Deletes bank by id if there are not relative transactions',
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
            description: 'Returns deleted bank without id',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/DeletedBank' }
                }
            }
        }
    }
};

export default {
    '/banks': {
        post: createBank,
        get: getBanks
    },
    '/banks/{ id }': {
        get: getBank,
        patch: updateBank,
        delete: deleteBank
    }
};