import { NextFunction, Request, Response } from 'express';
import transactionsService from './transactions.service';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transaction = await transactionsService.create(req.body);

        res
            .status(201)
            .json(transaction);
    } catch (error) {
        next(error);
    }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await transactionsService.find(req.query);

        res
            .status(200)
            .json(transactions);
    } catch (error) {
        next(error);
    }
};

export const removeTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const removedTransaction = await transactionsService.removeOne(parseInt(req.params.id));

        res
            .status(200)
            .json(removedTransaction);
    } catch (error) {
        next(error);
    }
};