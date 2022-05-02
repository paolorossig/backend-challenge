import 'dotenv/config';
import app from './app.js';
import { connectDb } from './utils/db.js';

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  connectDb();
});
