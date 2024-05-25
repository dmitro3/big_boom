import {createContext} from 'react';

export const fluteForestContext = createContext({
  data: {
    authId: null,
    userId: null,
    selectedEvent: null,
    subscriptions: [],
  },
  setAuthId: (data) => data,
  setUserId: (data) => data,
  setSelectedEvent: (data) => data,
  setUserSubscription: (userId, eventId, subscription) => false,
});
