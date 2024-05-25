import { BackButton, MainButton, useHapticFeedback } from '@altiore/twa';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EventCard from '../components/EventsListing/EventCard.jsx';
import Header from '../components/Header.jsx';
import { PATH } from '../consts.js';
import { Page } from '../components/Page/index.js';
import { useFetchEvents } from '../hooks/useFetchEvents.js';

const EventSelection = () => {
  const navigate = useNavigate();

  const { impactOccurred, selectionChanged, notificationOccurred } = useHapticFeedback();

  const [selectedEvent, setSelectedEvent] = useState(null);

  const { events } = useFetchEvents();

  const openEvent = useCallback(async (openedEvent) => {
    navigate(PATH.Event(openedEvent.id));
    notificationOccurred('success');
  }, [navigate, notificationOccurred]);

  const handleOpenEvent = useCallback(() => {
    openEvent(selectedEvent).then().catch(console.error);
  }, [openEvent, selectedEvent]);

  const handleEventClick = useCallback((event) => async () => {
    if (selectedEvent) {
      if (selectedEvent?.id === event.id) {

        openEvent(selectedEvent).then().catch(console.error);
        return;
      } else {
        setSelectedEvent(event);
      }
    } else {
      setSelectedEvent(event);
    }

    selectionChanged();
  }, [selectionChanged, selectedEvent, setSelectedEvent]);

  const goBack = useCallback(() => {
    impactOccurred('soft');
    navigate(PATH.Landing());
  }, [navigate, impactOccurred]);

  return (
    <>
      <BackButton onClick={goBack} />
      <Page className="event-selection">
        <Header title="Пожешь подключить" className="header" />
        {/*<SearchBar search={search} setSearch={setSearch}/>*/}
        {/*{specialties &&*/}
        {/*  <Nav specialties={specialties} onSpecialtyClick={setSpecialty} selectedSpecialty={specialty} />*/}
        {/*}*/}
        <main className="main">
          {events?.length ? events.map(event => (
            <EventCard
              className={selectedEvent && selectedEvent.id === event.id ? 'card card--active' : 'card'}
              key={event.id}
              {...event}
              onClick={handleEventClick(event)}
            />)
          ) : (
             <h3>Нет событий в ближайшее время...</h3>
           )}
        </main>
      </Page>
      {selectedEvent && (
        <MainButton
          textColor="#FFF"
          text={`ПОДРОБНЕЕ`}
          onClick={handleOpenEvent}
        />
      )}
    </>
  );
};

export default EventSelection;
