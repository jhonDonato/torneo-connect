import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';

// Placeholder for database
let paymentsDB = [
    { id: 'p1', userId: 'u1', user: 'GamerPro123', eventId: 't1', tournament: 'Torneo de Verano - Valorant', amount: 25, date: '2024-07-28', evidenceUrl: 'payment receipt', status: 'pending' },
    { id: 'p2', userId: 'u2', user: 'PlayerX', eventId: 't2', tournament: 'Sorteo Skin Rara', amount: 5, date: '2024-07-28', evidenceUrl: 'transaction screenshot', status: 'pending' },
];

const validateSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || !['admin', 'employee'].includes(session.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;

    try {
        const body = await req.json();
        const { status } = validateSchema.parse(body);

        const paymentIndex = paymentsDB.findIndex(p => p.id === id);
        if (paymentIndex === -1) {
            return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
        }

        // Update payment status in your database
        paymentsDB[paymentIndex].status = status;
        console.log(`Payment ${id} has been ${status} by ${session.username}`);

        // In a real app, you might also decrement event slots, send notifications, etc.

        return NextResponse.json({ message: `Payment ${status} successfully` }, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
