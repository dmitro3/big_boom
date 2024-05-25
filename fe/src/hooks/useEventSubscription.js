import { useHapticFeedback, useShowPopup, useWebApp } from '@altiore/twa';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { whenText } from '../utils/moment.js';
import { fluteForestContext } from '../store/index.jsx';

export function useEventSubscription(event) {
  const { data, setUserSubscription } = useContext(fluteForestContext);

  const user_id = useMemo(() => data.userId, [data]);

  const existingSubscription = useMemo(() => {
    if (event && user_id) {
      const subs = data.subscriptions.find(el => el.userId === user_id && el.eventId === event.id);
      return Boolean(subs);
    }
    return null;
  }, [data, event, user_id]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      if (event?.id && user_id) {
        fetch(`/api/user_events/${event.id}/user/${user_id}`).then((res) => res.json()).then((res) => {
          if (res.ok) {
            setUserSubscription(user_id, event.id, true);
          } else {
            setUserSubscription(user_id, event.id, false);
            if (res?.status !== 'NotFound') {
              console.error('API error: ' + res.message ?? "Unknown API error");
            }
          }
        }).catch(console.error).finally(() => {
          setIsLoading(false);
        });
      }
    } catch (err) {
      console.error(err);
    }

  }, [event?.id, user_id, setUserSubscription]);

  const { notificationOccurred } = useHapticFeedback();

  const showPopup = useShowPopup();

  const webApp = useWebApp();
  const onClose = useCallback(() => {
    webApp?.disableClosingConfirmation();
    webApp?.close();
  }, [webApp]);

  const toggleSubscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/user_events`, {
        body: JSON.stringify({
          event_id: event.id,
          user_id,
        }),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
      });
      const resJson = await res.json();

      if (resJson.ok) {
        notificationOccurred('success');

        setUserSubscription(user_id, event.id, Boolean(resJson.data));

        const title = `${whenText(event.start_at)}`;

        if (resJson.data) {
          showPopup({
            buttons: [{text: 'Супер!'}],
            message: `Вы успешно зарегистрированы на событие: "${event.title}"`,
            title,
          }).then().catch(console.error);
        } else {
          showPopup({
            message: `Регистрация на событие "${event.title}" отменена!`,
            title,
          }).then().catch(console.error);
        }

        onClose();
      } else {
        notificationOccurred('error');

        showPopup({
          title: 'Ошибка:',
          message: resJson.message ?? 'Неизвестная ошибка сервера',
        }).then().catch(console.error);
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);

      setIsLoading(false);
    }
  }, [notificationOccurred, showPopup, event, user_id, onClose, setUserSubscription]);

  return {isLoading, eventSubscription: existingSubscription, user_id, toggleSubscribe};
}
