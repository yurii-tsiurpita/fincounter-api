import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

class ValidationService {
    async validateClass(target: Record<string, any>, classToValidate: ClassConstructor<Record<string, any>>) {
        const instance = plainToClass(classToValidate, target);

        const errors = await validate(
            instance,
            {
                whitelist: true,
                skipMissingProperties: true
            }
        );

        let errorsMessages: string[] = [];
        if (errors.length) {
            const errorsConstraints = errors.map(error => error.constraints);
            errorsConstraints.forEach(constraint => {
                if (constraint) errorsMessages = [...errorsMessages, ...Object.values(constraint)];
            });
        };

        return {
            instance,
            errorsMessages
        };
    }
}

export default new ValidationService();