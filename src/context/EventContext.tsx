
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
// Dates are not serializable in JSON, so we store them as strings
export type StoredEvent = Omit<EventPayload, 'eventDate'> & { id: string; published: boolean; eventDate: string; };
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

const eventToStoredEvent = (event: Event): StoredEvent => ({
    ...event,
    eventDate: event.eventDate.toISOString(),
});

const storedEventToEvent = (storedEvent: StoredEvent): Event => ({
    ...storedEvent,
    eventDate: new Date(storedEvent.eventDate),
});

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    try {
        const storedEventsJSON = localStorage.getItem('events');
        if (storedEventsJSON) {
            const storedEvents: StoredEvent[] = JSON.parse(storedEventsJSON);
            setEvents(storedEvents.map(storedEventToEvent));
        } else {
            setEvents(initialEvents);
            localStorage.setItem('events', JSON.stringify(initialEvents.map(eventToStoredEvent)));
        }
    } catch (error) {
        console.error("Failed to parse events from localStorage", error);
        setEvents(initialEvents);
    }
  }, []);

  const updateAndStoreEvents = (newEvents: Event[]) => {
      setEvents(newEvents);
      localStorage.setItem('events', JSON.stringify(newEvents.map(eventToStoredEvent)));
  }

  const addEvent = (eventPayload: EventPayload) => {
    const newEvent: Event = {
      ...eventPayload,
      id: String(Date.now()),
      published: false,
    };
    updateAndStoreEvents([newEvent, ...events]);
  };

  const toggleEventStatus = (eventId: string) => {
    const updatedEvents = events.map(event =>
        event.id === eventId ? { ...event, published: !event.published } : event
    );
    updateAndStoreEvents(updatedEvents);
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

    