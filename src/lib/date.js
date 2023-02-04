import dayjs from 'dayjs';

export function reformatDate(dateStr, format) {
  return dayjs(dateStr).format(format)
}
