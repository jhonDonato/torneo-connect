"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as z from 'zod';
import { useAuth } from './AuthContext';

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
export type Event = Omit<EventPayload, 'eventDate'> & { id: string; published: boolean; eventDate: string };

interface EventContextType {
  events: Event[];
  addEvent: (eventPayload: EventPayload) => Promise<void>;
  toggleEventStatus: (eventId: string) => void;
  loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
        const url = user && ['admin', 'employee'].includes(user.role) 
            ? '/api/events' 
            : '/api/events/published';
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
    } catch (error) {
        console.error(error);
        setEvents([]); // Reset on error
    } finally {
        setLoading(false);
    }
  };
  
  // Refetch events if user role changes
  useEffect(() => {
    fetchEvents();
  }, [user]);

  const addEvent = async (eventPayload: EventPayload) => {
    const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
    }

    const newEvent = await response.json();
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const toggleEventStatus = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    try {
        const response = await fetch(`/api/events/${eventId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: !event.published }),
        });

        if (!response.ok) {
            throw new Error('Failed to update event status');
        }
        
        // Update local state
        setEvents(prevEvents =>
          prevEvents.map(e =>
            e.id === eventId ? { ...e, published: !e.published } : e
          )
        );
    } catch (error) {
        console.error(error);
    }
  };

  const value = { events, addEvent, toggleEventStatus, loading };

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
