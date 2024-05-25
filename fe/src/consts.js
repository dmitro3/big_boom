const EVENT_DEF_ID = ':event_id';

export const PATH = {
  Landing: () => '/big_boom/',
  EventList: () => '/big_boom/events',
  Event: (event_id = EVENT_DEF_ID) => `/big_boom/events/${event_id}`,
  EventBookingConfirm: (event_id = EVENT_DEF_ID) => `/big_boom/events/${event_id}/booking-confirm`,
  EventTimeSlots: (event_id = EVENT_DEF_ID) => `/big_boom/events/${event_id}/time-slots`,
}

export const DATA_PATH = {
  AuthId: 'auth_id',
  UserId: 'user_id',
  ExpiredAt: 'expired_at',
  SelectedEvent: 'selected_event',
  EventSubscription: (eventId, userId) => `event_subscription_${userId}_${eventId}`,
}

export const EVENT_IMG_PATH = (id) => `/static_images/events/${id}.jpg`;
