import { useState, useEffect } from 'react';
import { type EventItem } from '@/types';
import { supabaseService } from '@/services/supabaseService';
import { mockEvents } from '@/data/mockData';

export function useSupabaseData(setIsRegistrationConfirmed?: (confirmed: boolean) => void) {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const stored = localStorage.getItem('runnicle_events');
      if (stored && stored !== 'undefined') return JSON.parse(stored);
    } catch {
      // fallback
    }
    return mockEvents;
  });

  const [registrations, setRegistrations] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('runnicle_registrations');
      if (stored && stored !== 'undefined') return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Sync state with Supabase on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch events
        let dbEvents: EventItem[] = [];
        try {
          dbEvents = await supabaseService.fetchEvents();
        } catch (err) {
          console.error("Error fetching events from Supabase:", err);
        }

        let finalEvents = mockEvents;
        if (dbEvents && dbEvents.length > 0) {
          finalEvents = dbEvents;
        } else {
          console.log("Supabase events table is empty. Seeding mock events...");
          try {
            const seeded = await supabaseService.seedEvents(mockEvents);
            if (seeded && seeded.length > 0) {
              finalEvents = seeded;
            }
          } catch (seedErr) {
            console.error("Failed to seed events in Supabase:", seedErr);
          }
        }
        setEvents(finalEvents);
        localStorage.setItem('runnicle_events', JSON.stringify(finalEvents));

        // Fetch registrations
        try {
          const dbRegs = await supabaseService.fetchRegistrations(finalEvents);
          setRegistrations(dbRegs);
          localStorage.setItem('runnicle_registrations', JSON.stringify(dbRegs));
        } catch (regsErr) {
          console.error("Error fetching registrations from Supabase:", regsErr);
        }
      } catch (err) {
        console.error("Failed to sync with Supabase on load:", err);
      }
    };

    fetchInitialData();
  }, []);

  const handleAddEvent = async (newEvent: EventItem) => {
    const tempId = newEvent.id;
    // Optimistic local update
    const updated = [newEvent, ...events];
    setEvents(updated);
    localStorage.setItem('runnicle_events', JSON.stringify(updated));

    // Save to Supabase
    try {
      const dbEvent = await supabaseService.insertEvent(newEvent);
      setEvents(prev => prev.map(item => item.id === tempId ? dbEvent : item));
      setTimeout(() => {
        setEvents(currentEvents => {
          localStorage.setItem('runnicle_events', JSON.stringify(currentEvents));
          return currentEvents;
        });
      }, 100);
    } catch (err) {
      console.error("Failed to add event to Supabase:", err);
    }
  };

  const handleUpdateEvents = async (newEvents: EventItem[]) => {
    // Update local state immediately
    setEvents(newEvents);
    localStorage.setItem('runnicle_events', JSON.stringify(newEvents));

    // Sync changes to Supabase
    try {
      // 1. Handle Deletions
      const deletedEvents = events.filter(e => !newEvents.some(ne => ne.id === e.id));
      for (const del of deletedEvents) {
        await supabaseService.deleteEvent(del.id);
      }

      // 2. Handle Updates
      for (const ne of newEvents) {
        const old = events.find(e => e.id === ne.id);
        if (old && (old.title !== ne.title || old.date !== ne.date || old.location !== ne.location)) {
          await supabaseService.updateEvent(ne);
        }
      }
    } catch (err) {
      console.error("Error during handleUpdateEvents:", err);
    }
  };

  const handleUpdateRegistrations = async (newRegs: any[]) => {
    // Update local state immediately
    setRegistrations(newRegs);
    localStorage.setItem('runnicle_registrations', JSON.stringify(newRegs));

    try {
      // 1. Handle Deletions
      const deletedRegs = registrations.filter(r => !newRegs.some(nr => nr.id === r.id));
      for (const del of deletedRegs) {
        await supabaseService.deleteRegistration(del.id);
      }

      // 2. Handle Updates / Admin insertions
      for (const nr of newRegs) {
        const old = registrations.find(r => r.id === nr.id);
        if (old) {
          // If status, bib, name or details changed, update in DB
          if (
            old.status !== nr.status || 
            old.registeredBib !== nr.registeredBib || 
            old.firstName !== nr.firstName || 
            old.lastName !== nr.lastName ||
            old.email !== nr.email ||
            old.phone !== nr.phone ||
            old.size !== nr.size
          ) {
            await supabaseService.updateRegistration(nr, events);
          }
        } else {
          // Admin created new registration record directly
          const dbReg = await supabaseService.insertRegistration(nr, events);
          setRegistrations(prev => {
            const updatedList = prev.map(item => item.id === nr.id ? dbReg : item);
            localStorage.setItem('runnicle_registrations', JSON.stringify(updatedList));
            return updatedList;
          });
        }
      }
    } catch (err) {
      console.error("Error during handleUpdateRegistrations:", err);
    }
  };

  const handleRegisterComplete = async (newRegistration: any) => {
    const tempId = `reg-${Date.now()}`;
    const record = {
      id: tempId,
      registrationDate: new Date().toISOString(),
      status: 'Pending',
      ...newRegistration
    };

    // Update local state immediately
    const updated = [record, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('runnicle_registrations', JSON.stringify(updated));
    if (setIsRegistrationConfirmed) {
      setIsRegistrationConfirmed(true);
    }

    try {
      const dbReg = await supabaseService.insertRegistration(record, events);
      setRegistrations(prev => {
        const updatedList = prev.map(item => item.id === tempId ? dbReg : item);
        localStorage.setItem('runnicle_registrations', JSON.stringify(updatedList));
        return updatedList;
      });
    } catch (err: any) {
      console.error("Error during handleRegisterComplete:", err);
      const errMsg = err?.message || JSON.stringify(err);
      localStorage.setItem('runnicle_last_db_error', errMsg);
      window.alert("Database Error: Failed to save registration to database.\nDetails: " + errMsg);
    }
  };

  return {
    events,
    registrations,
    handleAddEvent,
    handleUpdateEvents,
    handleUpdateRegistrations,
    handleRegisterComplete
  };
}
