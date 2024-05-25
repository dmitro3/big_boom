import { useCallback, useEffect, useState } from 'react';

import { EVENT_IMG_PATH } from '../../consts.js';

const EventCard = ({
  id,
  title,
  description,
  onClick,
  className,
}) => {

  const [eventImg, setEventImg] = useState(EVENT_IMG_PATH(id));

  useEffect(() => {
    setEventImg(EVENT_IMG_PATH(id));
  }, [id, setEventImg]);

  const setDefaultEventImg = useCallback(() => {
    setEventImg(`/events/room.jpg`);
  }, [setEventImg]);

  return (
    <section className={className} onClick={onClick}>
      <div className="card__image">
        <img
          className="card__image__img"
          src={eventImg}
          alt="Event"
          onError={setDefaultEventImg}
        />
      </div>

      <div className="card__info">
        <h1 className="card__title">{title}</h1>

        <p className="card__subtitle">{description}</p>
      </div>
    </section>
  );
};

export default EventCard;
