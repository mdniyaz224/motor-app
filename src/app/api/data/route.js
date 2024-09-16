// import clientPromise from '../../../lib/mongodb';

import clientPromise from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase'); // Replace with your database name
    const data = await db.collection('mycollection').find({}).toArray();
    console.log(data,"data");
    
    
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
    const db = client.db('mydatabase'); // Replace with your database name
    const data = await req.json();
    
    const result = await db.collection('mycollection').insertOne(data);
    console.log(result,"result--");
    
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

// register-----------------------------------


export async function Register(req) {
  try {
    const db = await getDb();
    const { username, email, password } = await req.json();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already in use' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };

    const result = await db.collection('users').insertOne(newUser);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// login----------------------------------------------------------------------------


export async function login(req) {
  try {
    const db = await getDb();
    const { email, password } = await req.json();

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// Forgot Password API-------------------------------------------------------------------


export async function forgot (req) {
  try {
    const db = await getDb();
    const { email } = await req.json();

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // In a real application, you'd send this token via email to the user
    // But here we'll return it in the response (for testing)
    return new Response(JSON.stringify({ resetToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending reset email:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}



//Reset Password API -----------------------------------------------------------

export async function reset(req) {
  try {
    const db = await getDb();
    const { resetToken, newPassword } = await req.json();

    let decoded;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { password: hashedPassword } }
    );

    return new Response(JSON.stringify({ message: 'Password reset successful' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


//Authentication Middleware (Optional for protected routes)----------------------

export function authenticate(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ message: 'No token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Return decoded token (user data)
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
