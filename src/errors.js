class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class NotFoundError extends AppError {}
export class InvalidConfigurationError extends AppError {}
export class InvalidInputError extends AppError {}
