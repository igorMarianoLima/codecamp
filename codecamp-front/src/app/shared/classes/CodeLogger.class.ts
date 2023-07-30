export interface CodeLog {
    type: 'message' | 'error';
    value: any;
}

export class CodeLogger {
    logs: CodeLog[];

    constructor() {
        this.logs = [];

        const logger = console.log.bind(console);
        console.log = (message: any) => {
            this.logs.push({
                type: 'message',
                value: message
            });
            logger(message);
        }

        const error = console.error.bind(console);
        console.error = (message: any) => {
            this.logs.push({
                type: 'error',
                value: message
            });
            error(message);
        }
    }
}