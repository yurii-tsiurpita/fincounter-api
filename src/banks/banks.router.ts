import express from 'express';
import { ReqParamsIdDto } from '../common/dtos/req-params-id.dto';
import { validateBody } from '../validation/middlewares/validate-body.middleware';
import { validateParams } from '../validation/middlewares/validate-params.middleware';
import { validateQuery } from '../validation/middlewares/validate-query.middleware';
import * as banksController from './banks.controller';
import { CreateBankDto } from './dtos/create-bank.dto';
import { GetBanksQueryDto } from './dtos/get-banks-query.dto';
import { UpdateBankDto } from './dtos/update-bank.dto';

const banksRouter = express.Router();

banksRouter
    .route('/')
    .post(validateBody(CreateBankDto), banksController.createBank)
    .get(validateQuery(GetBanksQueryDto), banksController.getBanks);

banksRouter.use('/:id', validateParams(ReqParamsIdDto));

banksRouter
    .route('/:id')
    .get(banksController.getBank)
    .patch(validateBody(UpdateBankDto), banksController.updateBank)
    .delete(banksController.removeBank);

export default banksRouter;