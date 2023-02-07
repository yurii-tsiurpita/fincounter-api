import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer';
import validationService from '../validation.service';

export const validateParams = (classToValidate: ClassConstructor<object>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await validationService.validateClass(req.params, classToValidate);

            if (result.errorsMessages?.length) {
                return res
                    .status(422)
                    .send({ errors: result.errorsMessages });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};