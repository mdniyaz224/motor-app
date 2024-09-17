// app/api/register/route.js
import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    const { username, email, password } = await req.json();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };

    const result = await db.collection('users').insertOne(newUser);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
