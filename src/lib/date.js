import dayjs from 'dayjs';

export function reformatDate(dateStr, toFormat, fromFormat = 'YYYY-MM-DD') {
  return dayjs(dateStr).format(toFormat)
}
