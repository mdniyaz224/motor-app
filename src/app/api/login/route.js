// /app/api/login/route.js
import { NextResponse } from 'next/server';
// import clientPromise from '@/app/lib/mongodb';
import clientPromise from '../../lib/mongodb'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db('mydatabase'); // Change to your actual database name
        
        const { email, password } = await req.json(); // Ensure you are sending email and password in the body

        const user = await db.collection('users').findOne({ email });
        console.log(user,'user----');
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        console.log(user,'user----');

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const token = await jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
