import moment from 'moment';
import { useMemo } from 'react';

import {getMonth, getWeekDay} from '../../utils/moment.js';

const WorkingHours = ({hoursArray}) => {
  const parsedHoursArray = useMemo(() => hoursArray.map(item => {
    const startMoment = moment(item.start_at);
    return {
      day: `${startMoment.date()} ${getMonth(startMoment.month()).toLowerCase()}`,
      start: startMoment.format('HH:mm'),
      end: moment(item.end_at).format('HH:mm'),
    };
  }), []);

  return (
    <div className="working-hours">
      {parsedHoursArray.map((hours, index) => (
        <div className="box__text" key={index}>
          {hours.day}{" "}
          <span className="box__text--color-light">
            {hours.start && hours.end ? `${hours.start} - ${hours.end}` : "Closed"}
          </span>
        </div>
      ))}
    </div>
  )
}

export default WorkingHours
