import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer';
import validationService from '../validation.service';

export const validateQuery = (classToValidate: ClassConstructor<Record<string, any>>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await validationService.validateClass(req.query, classToValidate);

            if (result.errorsMessages?.length) {
                return res
                    .status(422)
                    .send({ errors: result.errorsMessages });
            }

            req.query = result.instance;
            next();
        } catch (error) {
            next(error);
        }
    };
};