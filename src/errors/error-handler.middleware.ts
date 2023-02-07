import { Request, Response, NextFunction } from 'express';
import { AppError } from './app-error.entity';

const handle23503Code = () => {
    const message = 'You cannot delete this entity while the relative entities exist.';
    return new AppError(message, 422);
};

const handle23505Code = (error: unknown) => {
    if (
        error instanceof Object
        && error !== null
        && 'detail' in error &&
        typeof error.detail === 'string'
    ) {
        return new AppError(error.detail, 422);
    }

    return error;
};

export const errorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {
    let customError = Object.assign(error);
    customError.statusCode = error.statusCode || 500;
    customError.status = error.status || 'error';

    if (error.code == 23503) customError = handle23503Code();
    if (error.code == 23505) customError = handle23505Code(error);

    if (customError.statusCode > 499) {
        console.error('\n========================= ERROR =========================');
        console.error(error);
        console.error('=========================================================\n');
    }

    res
        .status(customError.statusCode)
        .json({ errors: [customError.message] });
};