class ConfigService {
    dbPort: number = +process.env.DB_PORT!;
    dbHost: string = process.env.DB_HOST!;

    constructor() {
        if (process.env.NODE_ENV === 'local-production') {
            this.dbHost = 'localhost';
        }

        if (process.env.NODE_ENV === 'development') {
            this.dbPort = +process.env.DB_PORT!
            this.dbHost = 'localhost';
        }

        if (process.env.NODE_ENV === 'test') {
            this.dbPort = +process.env.TEST_DB_PORT!
            this.dbHost = 'localhost';
        }
    }
}

export default new ConfigService();