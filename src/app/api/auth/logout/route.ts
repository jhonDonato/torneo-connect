import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Clear the session cookie
        cookies().set('session_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Set expiration to the past
            path: '/',
        });

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An internal error occurred' }, { status: 500 });
    }
}
