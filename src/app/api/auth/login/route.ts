// In a real app, you'd import from a database library
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// Assume you have a library for password hashing and JWT
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// This is a placeholder for your database
const users = {
    "donato@gmail.com": { id: "1", username: "Donato", passwordHash: "Donay20", role: "admin" }, // In real app, this should be a hash
    "empleado@test.com": { id: "2", username: "EmpleadoUno", passwordHash: "password123", role: "employee" },
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        // Find user in your "database"
        const user = (users as any)[email];

        if (!user) {
            return NextResponse.json({ message: 'Credenciales incorrectas.' }, { status: 401 });
        }

        // In a real app, you would compare the hashed password
        // const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        const isPasswordValid = password === user.passwordHash; // Placeholder comparison

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Credenciales incorrectas.' }, { status: 401 });
        }
        
        const sessionData = {
            id: user.id,
            username: user.username,
            email: email,
            role: user.role,
        };

        // In a real app, you would use JWT or a similar session mechanism
        // const token = jwt.sign(sessionData, process.env.JWT_SECRET, { expiresIn: '1d' });
        const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64'); // Simple session token for demo

        cookies().set('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json(sessionData, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'An internal error occurred' }, { status: 500 });
    }
}
