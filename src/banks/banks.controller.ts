import { NextFunction, Request, Response } from 'express';
import banksService from './banks.service';

export const createBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bank = await banksService.create(req.body);

        res
            .status(201)
            .json(bank);
    } catch (error) {
        next(error);
    }
};

export const getBanks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const banks = await banksService.find(req.query);

        res
            .status(200)
            .json(banks);
    } catch (error) {
        next(error);
    }
};

export const getBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bank = await banksService.findOneById(parseInt(req.params.id));

        res
            .status(200)
            .json(bank);
    } catch (error) {
        next(error);
    }
};

export const updateBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedBank = await banksService.updateOne(req.body, parseInt(req.params.id));

        res
            .status(200)
            .json(updatedBank);
    } catch (error) {
        next(error);
    }
};

export const removeBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const removedBank = await banksService.removeOne(parseInt(req.params.id));

        res
            .status(200)
            .json(removedBank);
    } catch (error) {
        next(error);
    }
};