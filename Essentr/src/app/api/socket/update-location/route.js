import { NextResponse } from 'next/server';
import connectDB from '@/Config/Db';
import UserModel from '@/Models/userModel';

export async function POST(req) {
  try {
    await connectDB();
    const { userId, location } = await req.json();

        if (!userId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { location },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

