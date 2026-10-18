import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import notFound from './middleware/not-found.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';


const app = express();

app.use(helmet()); // security headers

app.use(express.json()); // parse incomming json
app.use(express.urlencoded({ extended: true })); // parse incomming URL-encoded form data

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(cookieParser());

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} 

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
})

app.use(notFound); // not found middleware

app.use(errorMiddleware); // error middleware

export default app;