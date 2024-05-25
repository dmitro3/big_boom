import { useHapticFeedback, useShowPopup } from '@altiore/twa';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import WorkingHours from '../Resume/WorkingHours.jsx';
// import { PATH } from '../../consts.js';
import { getDayDiff, getWhenWeekDay } from '../../utils/moment.js';

import './EventInfo.scss';
import { EVENT_IMG_PATH } from '../../consts.js';

const EventInfo = (event) => {
  const { notificationOccurred } = useHapticFeedback();

  const navigate = useNavigate();
  const showPopup = useShowPopup();

  // const webApp = useWebApp();

  const selectTimeSlots = useCallback(() => {
    try {
      // webApp?.disableClosingConfirmation();
      // webApp?.close();
      // navigate(PATH.EventTimeSlots(event.id));

      showPopup({
        message: 'Только указанное время доступно!\n' +
          'Это твой шанс встретиться с лучшими людьми...', title: 'Друг!', buttons: [{ text: 'Ясно' }]
      }).then().catch(console.error);
      notificationOccurred('warning');
    } catch (err) {
      console.error(err);
    }
    // }, [notificationOccurred, showPopup, navigate, webApp, event.id]);
  }, [notificationOccurred, showPopup, navigate]);

  const [eventImg, setEventImg] = useState(event?.id ? EVENT_IMG_PATH(event?.id) : null);

  useEffect(() => {
    setEventImg(EVENT_IMG_PATH(event?.id));
  }, [event?.id, setEventImg]);

  const setDefaultEventImg = useCallback(() => {
    setEventImg(`/events/room.jpg`);
  }, [setEventImg]);

  return (
    <div className="about__content">
      <img
        className="about__img"
        src={eventImg}
        alt="Event"
        onError={setDefaultEventImg}
      />
      <p className="about__subtitle">{event.description}</p>

      <span className="week-day">{getWhenWeekDay(moment(event.start_at).weekday())}</span>
      <button
        className="button about__button"
        onClick={selectTimeSlots}
      >
        <WorkingHours hoursArray={[event]} />
      </button>
      <span className="after-days">{getDayDiff(event.start_at, event.end_at)}</span>
    </div>);
};

export default EventInfo;
