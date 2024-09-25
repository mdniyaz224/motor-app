//Reset Password API -----------------------------------------------------------
import clientPromise from '../../lib/mongodb'
import jwt from 'jsonwebtoken';

export async function reset(req) {
    try {
      const client = await clientPromise;
      const db = client.db('mydatabase');
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
  