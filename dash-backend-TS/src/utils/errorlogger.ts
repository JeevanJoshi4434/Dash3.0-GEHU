import * as fs from 'fs';
import * as path from 'path';

class Logger {
    private static instance: Logger;
    private logFilePath: string;

    constructor() {
        this.logFilePath = path.resolve(__dirname, '../logs/errorlogs.txt');
        const logsDir = path.dirname(this.logFilePath);

        // Ensure logs directory exists
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    // Singleton instance
    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    // Log errors
    public logError(description: string): void {
        const timestamp = new Date().toISOString();
        const logEntry = `\n------ error ------\nerror: [${timestamp}] : ${description}\n-------------------\n`;

        fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
    }
}

export default Logger;
