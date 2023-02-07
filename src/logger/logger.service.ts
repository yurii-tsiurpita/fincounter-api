import morgan from 'morgan';

class LoggerService {
    logger = morgan('common');
}

export default new LoggerService();