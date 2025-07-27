import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';

// Placeholder for database
let eventsDB: any[] = [
    { id: 't1', type: 'tournament', name: 'Torneo de Verano - Valorant', prizeType: 'money', prizeMoney: 500, fee: 25, slots: 32, game: 'valorant', eventDate: new Date().toISOString(), published: true, creatorId: '1' },
    { id: 't2', type: 'raffle', name: 'Sorteo Skin Rara', prizeType: 'object', prizeObject: 'Skin "Glitchpop"', fee: 5, slots: 200, game: 'valorant', eventDate: new Date().toISOString(), published: true, creatorId: '1' },
];

const createEventSchema = z.object({
  name: z.string().min(5),
  type: z.enum(["tournament", "raffle"]),
  game: z.string(),
  prizeType: z.enum(["money", "object"]),
  prizeMoney: z.number().optional(),
  prizeObject: z.string().optional(),
  gameMode: z.string().optional(),
  fee: z.number().min(0),
  slots: z.number().min(2),
  eventDate: z.string().datetime(),
  description: z.string().optional(),
});

// GET all events (for admin/employee)
export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session || !['admin', 'employee'].includes(session.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    // In a real app, fetch all events from DB
    return NextResponse.json(eventsDB, { status: 200 });
}

// POST a new event
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || !['admin', 'employee'].includes(session.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        // The frontend sends a Date object, but JSON stringifies it. We'll handle it as a string.
        const eventData = { ...body, eventDate: new Date(body.eventDate).toISOString() };

        const data = createEventSchema.parse(eventData);

        const newEvent = {
            id: String(Date.now()),
            ...data,
            published: false, // Events are not published by default
            creatorId: session.id,
        };

        eventsDB.push(newEvent);

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.flatten().fieldErrors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
