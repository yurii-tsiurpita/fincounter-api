import express from 'express';
import { ReqParamsIdDto } from '../common/dtos/req-params-id.dto';
import { validateBody } from '../validation/middlewares/validate-body.middleware';
import { validateHeaders } from '../validation/middlewares/validate-headers.middleware';
import { validateParams } from '../validation/middlewares/validate-params.middleware';
import { validateQuery } from '../validation/middlewares/validate-query.middleware';
import { GetTransactionsHeadersDto } from './dtos/create-transaction-headers.dto';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { GetTransactionsQueryDto } from './dtos/get-transactions-query.dto';
import * as transactionsController from './transactions.controller';

const transactionsRouter = express.Router();

transactionsRouter
    .route('/')
    .get(validateQuery(GetTransactionsQueryDto), transactionsController.getTransactions);

transactionsRouter.post(
    '/createWebhook',
    validateHeaders(GetTransactionsHeadersDto),
    validateBody(CreateTransactionDto),
    transactionsController.createTransaction
);

transactionsRouter.use('/:id', validateParams(ReqParamsIdDto));

transactionsRouter
    .route('/:id')
    .delete(transactionsController.removeTransaction);

export default transactionsRouter;