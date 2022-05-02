import express, { json } from 'express';
import cors from 'cors';
import charactersRouter from './routes/characters.js';

const app = express();

// Middlewares
app.use(json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Marvel Challenge API',
  });
});

app.use('/characters', charactersRouter);

export default app;
