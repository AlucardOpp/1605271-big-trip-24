import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const now = () => dayjs();

const humanizeEventDueDate = (date, format) => (date ? dayjs(date).format(format) : '');
const capitalizeFirstLetter = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

const calculateDuration = (start, end) => dayjs.duration(dayjs(end).diff(dayjs(start)));
const formatDuration = ({days, hours, minutes}) => {
  const d = days ? `${String(days).padStart(2, '0')}D ` : '';
  const h = hours || days ? `${String(hours).padStart(2, '0')}H ` : '';
  const m = `${String(minutes).padStart(2, '0')}M`;
  return (d + h + m).trim();
};

function formatDateDifference(startDate, endDate) {
  const calculatedDuration = calculateDuration(startDate, endDate);
  return formatDuration({
    days: calculatedDuration.days(),
    hours: calculatedDuration.hours(),
    minutes: calculatedDuration.minutes(),
  });
}

const findItemByField = (items, field, value) => items.find((item) => item[field] === value);

const getOffersByType = (offers, type) => findItemByField(offers, 'type', type)?.offers || [];
const getDestinationById = (destinations, id) => findItemByField(destinations, 'id', id);
const getDestinationByName = (destinations, name) => findItemByField(destinations, 'name', name);

const isPointFuture = (startDate) => dayjs(startDate).isAfter(now());
const isPointPresent = (startDate, endDate) => dayjs(startDate).isSameOrBefore(now()) && dayjs(endDate).isSameOrAfter(now());
const isPointPast = (endDate) => dayjs(endDate).isBefore(now());

const getNullValueWeight = (a, b) => {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  return null;
};

const sortTime = (a, b) => getNullValueWeight(a.duration, b.duration) ?? calculateDuration(a.dateFrom, a.dateTo).asMilliseconds() - calculateDuration(b.dateFrom, b.dateTo).asMilliseconds();
const sortPrice = (a, b) => getNullValueWeight(a.price, b.price) ?? b.basePrice - a.basePrice;

const extractEventOfferId = (input) => input.match(/event-offer-(.*?)-1/)?.[1] || null;

export {
  humanizeEventDueDate,
  capitalizeFirstLetter,
  formatDateDifference,
  getOffersByType,
  getDestinationById,
  getDestinationByName,
  isPointFuture,
  isPointPresent,
  isPointPast,
  sortTime,
  sortPrice,
  extractEventOfferId
};
