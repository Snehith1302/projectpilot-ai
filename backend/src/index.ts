import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppConfig } from './config/app.config';
import { requestIdMiddleware } from './middleware/requestId';
import { loggerMiddleware } from './middleware/logger';
import { errorHandlerMiddleware, AppError } from './middleware/errorHandler';
import { apiRouter } from './routes/api.routes';

const app = express();

// 1. Security & Global Request Context Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware); // Assign unique ID to every request first
app.use(loggerMiddleware);    // Log requests structured

// 2. Register API Routes Gateway
app.use('/api', apiRouter);

// 3. Catch-all Route Handler for Unmapped Paths
app.use('*', (req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// 4. Centralized Error Handler Middleware
app.use(errorHandlerMiddleware);

// 5. Start Listening
app.listen(AppConfig.server.port, () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    message: `[Server] ProjectPilot AI Backend listening on port ${AppConfig.server.port}`,
    port: AppConfig.server.port,
    version: AppConfig.version
  }));
});
export default app;
