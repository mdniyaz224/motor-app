import { NextResponse } from 'next/server';
// import clientPromise from '@/app/lib/mongodb';
import clientPromise from '../../lib/mongodb'
import jwt from 'jsonwebtoken';


export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    
    const { email } = await req.json();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log(user,"user");

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // In production, send this token via email to the user
    // Placeholder response for testing purposes
    return new Response(JSON.stringify({ message: 'Reset token generated', resetToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling forgot password:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
