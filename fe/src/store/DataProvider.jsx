import { useCallback, useState } from 'react';

import {fluteForestContext} from './index.jsx';

export const DataProvider = ({children}) => {
  const [data, setData] = useState({
    authId: null,
    userId: null,
    selectedEvent: null,
    subscriptions: [],
  });

  const setAuthId = useCallback((authId) => {
    setData((d) => ({
      ...d,
      authId,
    }));
  }, [setData]);

  const setUserId = useCallback((userId) => {
    setData((d) => ({
      ...d,
      userId,
    }));
  }, [setData]);

  const setSelectedEvent = useCallback((selectedEvent) => {
    setData((d) => ({
      ...d,
      selectedEvent,
    }));
  }, [setData]);

  const setUserSubscription = useCallback((userId, eventId, subscription) => {
    setData((d) => {
      if (subscription) {
        const existing = d.subscriptions.find(el => el.userId === userId && el.eventId === eventId);
        if (existing) {
          return d;
        }
        return {
          ...d,
          subscriptions: [...d.subscriptions, {userId, eventId}],
        }
      } else {
        return {
          ...d,
          subscriptions: d.subscriptions.filter(el => !(el.userId === userId && el.eventId === eventId)),
        };
      }
    });
  }, [setData]);

  return (
    <fluteForestContext.Provider value={{ data, setAuthId, setUserId, setSelectedEvent, setUserSubscription }}>
      {children}
    </fluteForestContext.Provider>
  );
}
