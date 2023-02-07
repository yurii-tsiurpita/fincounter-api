import { NextFunction, Request, Response } from 'express';
import categoriesService from './categories.service';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoriesService.create(req.body);

        res
            .status(201)
            .json(category);
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoriesService.find(req.query);

        res
            .status(200)
            .json(categories);
    } catch (error) {
        next(error);
    }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoriesService.findOneById(parseInt(req.params.id));

        res
            .status(200)
            .json(category);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedCategory = await categoriesService.updateOne(req.body, parseInt(req.params.id));

        res
            .status(200)
            .json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

export const removeCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const removedCategory = await categoriesService.removeOne(parseInt(req.params.id));

        res
            .status(200)
            .json(removedCategory);
    } catch (error) {
        next(error);
    }
};

export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const statistics = await categoriesService.getStatistics(req.query);

        res
            .status(200)
            .json(statistics);
    } catch (error) {
        next(error);
    }
};