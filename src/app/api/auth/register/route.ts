import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

// This is a placeholder for your user database logic
// In a real app, you'd interact with a database.
const users: any = {}; // In-memory store for demo

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password } = registerSchema.parse(body);

        // Check if user already exists (in a real app, query your DB)
        if (Object.values(users).some((user: any) => user.email === email)) {
            return NextResponse.json({ message: 'Este correo electrónico ya está en uso.' }, { status: 409 });
        }
        
        // In a real app, you would hash the password
        // const passwordHash = await bcrypt.hash(password, 10);

        const newUser = {
            id: String(Date.now()),
            username,
            email,
            passwordHash: password, // Storing plain text for demo only. DO NOT DO THIS IN PRODUCTION.
            role: 'customer',
        };

        // Save the new user (in a real app, insert into your DB)
        users[newUser.id] = newUser;
        
        const sessionData = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        };

        // Create a session for the new user
        const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

        cookies().set('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json(sessionData, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'An internal error occurred' }, { status: 500 });
    }
}
