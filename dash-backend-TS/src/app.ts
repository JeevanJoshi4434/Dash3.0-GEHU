import express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import connectDB from './db/mongoDB';

// Load environment variables
dotenv.config();
class App {
  public app: Application;
  private port: number;
  private dbUris: Map<string, boolean> = new Map<string, boolean>();

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;
    connectDB();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandlers();
  }

  private initializeMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`Origin ${origin} is not allowed by CORS`));
          }
        },
      }),
    );
  }

  private initializeRoutes(): void {
    this.app.use('/api', routes); // Use the dynamic routes manager
  }

  private initializeErrorHandlers(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });

    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }


  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

export default App;
