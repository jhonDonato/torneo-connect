
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as z from 'zod';

const createEventSchema = z.object({
  name: z.string(),
  type: z.enum(["tournament", "raffle"]),
  game: z.string(),
  prizeType: z.enum(["money", "object"]),
  prizeMoney: z.coerce.number().optional(),
  prizeObject: z.string().optional(),
  gameMode: z.string().optional(),
  fee: z.coerce.number(),
  slots: z.coerce.number(),
  eventDate: z.date(),
  description: z.string().optional(),
});

export type EventPayload = z.infer<typeof createEventSchema>;
export type Event = EventPayload & { id: string; published: boolean };

interface EventContextType {
  events: Event[];
  addEvent: (eventPayload: EventPayload) => void;
  toggleEventStatus: (eventId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const initialEvents: Event[] = [
    { id: 't1', type: 'tournament', name: 'Torneo de Verano - Valorant', prizeType: 'money', prizeMoney: 500, fee: 25, slots: 32, game: 'valorant', eventDate: new Date(), published: true },
    { id: 't2', type: 'raffle', name: 'Sorteo Skin Rara', prizeType: 'object', prizeObject: 'Skin "Glitchpop"', fee: 5, slots: 200, game: 'valorant', eventDate: new Date(), published: true },
    { id: 't3', type: 'tournament', name: 'Campeonato Nacional de Dota 2', prizeType: 'money', prizeMoney: 10000, fee: 100, slots: 16, game: 'dota 2', eventDate: new Date(), published: true },
    { id: 't4', type: 'raffle', name: 'Sorteo Silla Gamer', prizeType: 'object', prizeObject: 'Silla Ergonómica Pro', fee: 10, slots: 100, game: 'general', eventDate: new Date(), published: true },
];

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = (eventPayload: EventPayload) => {
    const newEvent: Event = {
      ...eventPayload,
      id: String(Date.now()),
      published: false,
    };
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const toggleEventStatus = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, published: !event.published } : event
      )
    );
  };

  const value = { events, addEvent, toggleEventStatus };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
