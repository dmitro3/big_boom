import moment from 'moment';
import {noun} from 'plural-ru';

export const WEEK_DAYS = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

export const WEEK_DAYS_WHEN = ["В воскресенье", "В понедельник", "Во вторник", "В среду", "В четверг", "В пятницу", "В субботу"];

export const WEEK_DAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function getWhenWeekDay(index) {
  return WEEK_DAYS_WHEN[index];
}

export const getWeekDay = (index, short = false) => {
  if (short) {
    return WEEK_DAYS_SHORT[index];
  }
  return WEEK_DAYS[index];
}

export const MONTHS = [
  'Января',
  'Февраля',
  'Марта',
  'Апреля',
  'Мая',
  'Июня',
  'Июля',
  'Августа',
  'Сентября',
  'Октября',
  'Ноября',
  'Декабря',
];

export const MONTHS_SHORT = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
];

export const getMonth = (index, short = false) => {
  if (short) {
    return MONTHS_SHORT[index];
  }

  return MONTHS[index];
}

export const getDayDiff = (start, end) => {
  const curMoment = moment();
  const startMoment = moment(start);

  const startDiff = startMoment.diff(curMoment, 'milliseconds');
  const endDiff = moment(end).diff(curMoment, 'milliseconds');

  if (endDiff < 0) {
    return 'Уже закончилось';
  }
  if (startDiff <= 0) {
    return 'Уже началось';
  }

  /**
   * Прибавляем количество часов для правильного нахождения "сегодня"/"завтра"
   */
  const preparedStart = startMoment.subtract(startMoment.hours(), 'hours').subtract(startMoment.minutes(), 'minutes');

  const minDiff = preparedStart.diff(curMoment, 'minutes');

  if (minDiff <= 0) {
    return 'Сегодня';
  }

  const days = Math.floor(minDiff / (24*60));

  if (days === 0) {
    return 'Завтра';
  }

  if (days === 1) {
    return 'Послезавтра';
  }

  return `Через ${days + 1} ${noun(days + 1, 'день', 'дня', 'дней')}`;
}

export function whenText(time) {
  const startMoment = moment(time);

  return `${startMoment.date()} ${getMonth(startMoment.month()).toLowerCase()} в ${startMoment.format('HH:mm')}`;
}

export function getExpiredTime() {
  return moment().add(1, 'day').unix();
}

export function isExpired(time) {
  return moment.unix(time).diff(moment(), 'seconds') <= 0;
  // return true;
}
