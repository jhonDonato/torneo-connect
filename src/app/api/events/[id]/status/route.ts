import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';

// Placeholder for database
let eventsDB: any[] = [
    { id: 't1', type: 'tournament', name: 'Torneo de Verano - Valorant', prizeType: 'money', prizeMoney: 500, fee: 25, slots: 32, game: 'valorant', eventDate: new Date().toISOString(), published: true, creatorId: '1' },
];

const updateStatusSchema = z.object({
  published: z.boolean(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || !['admin', 'employee'].includes(session.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = params;

    try {
        const body = await req.json();
        const { published } = updateStatusSchema.parse(body);

        const eventIndex = eventsDB.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }
        
        // Update in your database
        eventsDB[eventIndex].published = published;

        return NextResponse.json(eventsDB[eventIndex], { status: 200 });

    } catch (error) {
         if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
