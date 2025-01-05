import dayjs from 'dayjs';

export function reformatDate(dateStr, toFormat, fromFormat = 'YYYY-MM-DD') {
  if (!dateStr) return ''
  const lower = dateStr.toLowerCase()
  if (lower === 'present' || lower === 'now') return 'Present'
  return dayjs(dateStr).format(toFormat)
}
