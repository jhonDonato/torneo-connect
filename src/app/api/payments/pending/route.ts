import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// Placeholder for database
const paymentsDB = [
    { id: 'p1', userId: 'u1', user: 'GamerPro123', eventId: 't1', tournament: 'Torneo de Verano - Valorant', amount: 25, date: '2024-07-28', evidenceUrl: 'payment receipt', status: 'pending' },
    { id: 'p2', userId: 'u2', user: 'PlayerX', eventId: 't2', tournament: 'Sorteo Skin Rara', amount: 5, date: '2024-07-28', evidenceUrl: 'transaction screenshot', status: 'pending' },
    { id: 'p3', userId: 'u3', user: 'NewbieNoob', eventId: 't1', tournament: 'Torneo de Verano - Valorant', amount: 25, date: '2024-07-27', evidenceUrl: 'yape transfer', status: 'pending' },
];


export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || !['admin', 'employee'].includes(session.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        // In a real app, you would query your DB for payments with status 'pending'
        const pendingPayments = paymentsDB.filter(p => p.status === 'pending');
        return NextResponse.json(pendingPayments, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
