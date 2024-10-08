import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://mdniyaz1842000:rGompkeQ3drsKjTv@cluster0.vayvh.mongodb.net/motor-worlds?retryWrites=true&w=majority&appName=Cluster0';
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

try {
  if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable to avoid reconnecting every time
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri); // No need for useNewUrlParser or useUnifiedTopology
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, it's fine to create a new connection for each request
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} catch (error) {
  console.error('MongoDB connection error:', error);
  throw new Error('Failed to connect to MongoDB');
}

export default clientPromise;
