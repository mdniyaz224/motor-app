// import clientPromise from "@/app/lib/mongodb";
import clientPromise from '../../lib/mongodb'
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase'); // Replace with your database name
    const data = await db.collection('mycollection').find({}).toArray();    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    const data = await req.json();
    
    const result = await db.collection('mycollection').insertOne(data);    
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(req, { params }) {
  const { id } = params; // Get the document ID from params
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase'); // Replace with your database name
    const data = await req.json();

    const result = await db.collection('mycollection').updateOne(
      { _id: new ObjectId(id) }, // Use ObjectId to find the document
      { $set: data }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ message: 'Entry not found or no changes made.' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Entry updated successfully!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating data:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}



//Authentication Middleware (Optional for protected routes)----------------------

// export function authenticate(req) {
//   const token = req.headers.get('Authorization')?.split(' ')[1];

//   if (!token) {
//     return new Response(JSON.stringify({ message: 'No token provided' }), {
//       status: 401,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     return decoded; // Return decoded token (user data)
//   } catch (error) {
//     return new Response(JSON.stringify({ message: 'Invalid token' }), {
//       status: 401,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
