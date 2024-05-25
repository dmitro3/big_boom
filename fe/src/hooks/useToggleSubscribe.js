import { useHapticFeedback, useShowPopup, useWebApp } from '@altiore/twa';
import { useCallback } from 'react';
import { whenText } from '../utils/moment.js';

export function useToggleSubscribe(event, user_id) {
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

        saveEventSubscription(Boolean(resJson.data));

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
  }, [notificationOccurred, showPopup, event, user_id, onClose]);
}
