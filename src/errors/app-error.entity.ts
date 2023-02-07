export class AppError extends Error {
    public status: string;

    constructor(message: string, public statusCode: number) {
        super(message);

        this.status = statusCode > 399 && statusCode < 500 ? 'fail' : 'error';
    }
}