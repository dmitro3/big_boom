import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fluteForestContext } from '../store/index.jsx';

export function useFetchEvents(id) {
  const {data, setSelectedEvent} = useContext(fluteForestContext);

  const selectedEvent = useMemo(() => data.selectedEvent, [data?.selectedEvent]);

  const fetchEvents = useCallback(async () => {
    const response = await fetch('/api/events');
    const eventsRes = await response.json();
    if (eventsRes?.ok) {
      return eventsRes.data;
    }
    return [];
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    if (!isLoading && !isLoaded) {
      setIsLoading(true);
      fetchEvents().then((_events) => {
        if (!id) {
          setIsLoaded(true);
        }
        setEvents(_events);
      }).catch((err) => {
        console.error(err);
        if (!id) {
          setIsLoaded(true);
        }
      }).finally(() => {
        if (!id) {
          setIsLoading(false);
        }
      });
    }
  }, [fetchEvents, isLoaded, isLoading, setEvents, setIsLoaded, setIsLoading, id]);

  useEffect(() => {
    if (events?.length && id && !isLoaded) {
      const _selectedEvent = events.find(e => e.id === id);
      if (_selectedEvent) {
        setSelectedEvent(_selectedEvent);
        setIsLoaded(true);
        setIsLoading(false);
      } else {
        setIsLoaded(false);
        setIsLoading(false);
      }
    }
  }, [id, setSelectedEvent, events, isLoaded]);

  return {isLoading, isLoaded, events, selectedEvent};
}
