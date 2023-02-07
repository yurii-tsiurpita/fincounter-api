import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { Server } from 'http';
import banksRouter from './banks/banks.router';
import transactionsRouter from './transactions/transactions.router';
import dbService from './db/db.service';
import { errorHandler } from './errors/error-handler.middleware';
import { AppError } from './errors/app-error.entity';
import categoriesRouter from './categories/categories.router';
import securityService from './security/security.service';
import swaggerUi from 'swagger-ui-express';
import loggerService from './logger/logger.service';
import docsSwagger from './docs/docs.swagger';

export class App {
    private app = express();
    private port = process.env.PORT!;
    server: Server;

    useMiddlewares() {
        if (process.env.NODE_ENV !== 'test') this.app.use(loggerService.logger);

        this.app.use(securityService.cors);
        this.app.use(express.json({ limit: '50kb' }));
    }

    useRoutes() {
        this.app.get('/', (req, res) => res.send('Fincounter API'));
        this.app.use('/banks', banksRouter);
        this.app.use('/categories', categoriesRouter);
        this.app.use('/transactions', transactionsRouter);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docsSwagger));
    }

    useErrorHandlers() {
        this.app.all('*', (req, res, next) => {
            next(new AppError(`Can not find ${ req.method } in this path: ${ req.originalUrl }`, 404));
        });

        this.app.use(errorHandler);
    }

    async init() {
        this.useMiddlewares();
        this.useRoutes();
        this.useErrorHandlers();
        await dbService.connect();
        this.server = this.app.listen(this.port);

        console.log(
            `[Server] Server is successfully started in ${ process.env.NODE_ENV } environment`
            + ` on port ${ this.port }.`
        );
    }

    async close() {
        await dbService.disconnect();
        this.server.close();
    }
}