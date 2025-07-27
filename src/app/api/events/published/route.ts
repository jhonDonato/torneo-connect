import { NextRequest, NextResponse } from 'next/server';

// Placeholder for database
let eventsDB: any[] = [
    { id: 't1', type: 'tournament', name: 'Torneo de Verano - Valorant', prizeType: 'money', prizeMoney: 500, fee: 25, slots: 32, game: 'valorant', eventDate: new Date().toISOString(), published: true, creatorId: '1' },
    { id: 't2', type: 'raffle', name: 'Sorteo Skin Rara', prizeType: 'object', prizeObject: 'Skin "Glitchpop"', fee: 5, slots: 200, game: 'valorant', eventDate: new Date().toISOString(), published: true, creatorId: '1' },
    { id: 't3', type: 'tournament', name: 'Campeonato Nacional de Dota 2', prizeType: 'money', prizeMoney: 10000, fee: 100, slots: 16, game: 'dota 2', eventDate: new Date().toISOString(), published: false, creatorId: '2' },
];

// GET only published events
export async function GET(req: NextRequest) {
    try {
        // In a real app, query your DB for `WHERE published = true`
        const publishedEvents = eventsDB.filter(event => event.published);
        return NextResponse.json(publishedEvents, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
