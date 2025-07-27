import { cookies } from 'next/headers';

type Role = 'admin' | 'employee' | 'customer';

interface UserSession {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export async function getSession(): Promise<UserSession | null> {
    const sessionToken = cookies().get('session_token')?.value;
    if (!sessionToken) {
        return null;
    }

    try {
        // In a real app, you would verify a JWT here
        const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString('ascii'));
        return sessionData as UserSession;
    } catch (error) {
        console.error("Invalid session token:", error);
        return null;
    }
}
