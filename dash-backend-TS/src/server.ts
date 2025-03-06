import App from './app';
import Logger from './utils/errorlogger';

const appInstance = new App();
const logger = Logger.getInstance();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  logger.logError(`Uncaught Exception: ${error}`);
  process.exit(1); // Restart the server
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  logger.logError(`Unhandled Rejection: ${reason}`);
  process.exit(1); // Restart the server
});

appInstance.start();
