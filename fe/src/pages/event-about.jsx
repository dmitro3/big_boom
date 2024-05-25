import { BackButton, MainButton, useHapticFeedback } from '@altiore/twa';
import { useCallback, useMemo } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';

import TopBar from '../components/EventAbout/TopBar.jsx';
import EventInfo from '../components/EventAbout/EventInfo.jsx';
import Section from '../components/EventAbout/Section.jsx';
import ServicesList from '../components/EventAbout/ServicesList.jsx';
import { Page } from '../components/Page';
import { useEventSubscription } from '../hooks/useEventSubscription.js';
import { PATH } from '../consts.js';
import { useFetchEvents } from '../hooks/useFetchEvents.js';

const EventAbout = () => {
  const {impactOccurred} = useHapticFeedback();
  const navigate = useNavigate();
  const goBack = useCallback(() => {
    impactOccurred('soft');
    navigate(PATH.EventList());
  }, [impactOccurred, navigate]);

  const { params } = useMatch('/events/:event_id');
  const eventId = useMemo(() => parseInt(params.event_id, 10), [params]);

  const { isLoading: isLoading1, selectedEvent } = useFetchEvents(eventId);

  const { eventSubscription, isLoading: isLoading2, toggleSubscribe } = useEventSubscription(selectedEvent);

  if (isLoading1 || isLoading2 || (selectedEvent && eventId !== selectedEvent.id)) {
    return null;
  }

  return (
    <>
      <BackButton onClick={goBack} />
      {selectedEvent ? (
        <Page className="about">
          <header className="header">
            <TopBar title={selectedEvent.title} />
            <EventInfo {...selectedEvent} />
          </header>
          <main className="about__main">
            <Section title="Как всегда, для Вас:" tag="services">
              <ServicesList services={['Фрукты', 'Чайная карта', 'Сладости']} />
            </Section>
          </main>
        </Page>
      ) : (
         <Page className="about">
           Нет такого события
         </Page>
       )}
      {selectedEvent && (
        <MainButton
          textColor="#FFF"
          progress={isLoading2}
          disabled={isLoading1 || isLoading2}
          text={isLoading2 ? '...' : eventSubscription ? `ОТМЕНИТЬ БРОНЬ` : `Я БУДУ`}
          onClick={toggleSubscribe}
        />
      )}
    </>
  );
};
export default EventAbout;
