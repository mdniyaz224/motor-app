// import { MongoClient } from 'mongodb';

// const uri = 'mongodb://127.0.0.1:27017/mydatabase';
// // const options = {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// // };

// let client;
// let clientPromise;

// if (process.env.NODE_ENV === 'development') {
//   // In development mode, use a global variable to ensure the MongoClient is not instantiated more than once
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   // In production mode, it's best to not use a global variable
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export default clientPromise;




import { MongoClient } from 'mongodb';

const uri ='mongodb://127.0.0.1:27017/mydatabase';
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

try {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so we don't create a new connection every time
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's ok to create a new connection for each request
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} catch (error) {
  console.error('MongoDB connection error:', error);
  throw new Error('Failed to connect to MongoDB');
}

export default clientPromise;
