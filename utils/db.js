import mongoose from 'mongoose';

let connection;

export function connectDb() {
  if (connection) return;

  const url = process.env.MONGO_URL;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  connection = mongoose.connection;

  connection.once('open', () => {
    console.log('DB connected successfully on', url);
  });
  connection.on('disconnected', () => {
    console.log('DB successfully disconnected');
  });
  connection.on('error', (error) => {
    console.error(error);
  });

  mongoose.connect(url, options);
}

export async function disconnectDb() {
  if (!connection) return;

  await mongoose.disconnect();
}

export async function cleanupDb() {
  for (const collection in connection.collections) {
    await connection.collections[collection].deleteMany({});
  }
}
