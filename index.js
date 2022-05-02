import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import routes from './routes.js';
import cronjob from './utils/cronjob.js';
import { connectDb } from './utils/db.js';

const port = process.env.PORT || 4000;

const app = express();

// Middlewares
app.use(json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);

  connectDb();
  routes(app);
  cronjob.start();
});
