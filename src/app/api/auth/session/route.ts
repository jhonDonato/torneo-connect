import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    try {
        const sessionToken = cookies().get('session_token')?.value;

        if (!sessionToken) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }
        
        // In a real app, you would verify the JWT or session token
        const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString('ascii'));

        if (!sessionData) {
            return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
        }

        // Optionally, re-fetch user from DB to ensure data is fresh
        // For now, just return the decoded session data
        return NextResponse.json(sessionData, { status: 200 });

    } catch (error) {
        console.error(error);
        // Clear invalid cookie
        cookies().set('session_token', '', { expires: new Date(0), path: '/' });
        return NextResponse.json({ message: 'An internal error occurred or session is invalid' }, { status: 500 });
    }
}
