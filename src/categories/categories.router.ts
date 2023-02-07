import express from 'express';
import { validateBody } from '../validation/middlewares/validate-body.middleware';
import { CreateCategoryDto } from './dtos/create-category.dto';
import * as categoriesController from './categories.controller';
import { validateParams } from '../validation/middlewares/validate-params.middleware';
import { ReqParamsIdDto } from '../common/dtos/req-params-id.dto';
import { validateQuery } from '../validation/middlewares/validate-query.middleware';
import { GetCategoriesQueryDto } from './dtos/get-categories-query.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { GetStatisticsQueryDto } from './dtos/get-statistics-query.dto';

const categoriesRouter = express.Router();

categoriesRouter
    .route('/')
    .post(validateBody(CreateCategoryDto), categoriesController.createCategory)
    .get(validateQuery(GetCategoriesQueryDto), categoriesController.getCategories);

categoriesRouter.get(
    '/statistics',
    validateQuery(GetStatisticsQueryDto),
    categoriesController.getStatistics
);

categoriesRouter.use('/:id', validateParams(ReqParamsIdDto));

categoriesRouter
    .route('/:id')
    .get(categoriesController.getCategory)
    .patch(validateBody(UpdateCategoryDto), categoriesController.updateCategory)
    .delete(categoriesController.removeCategory);

export default categoriesRouter;