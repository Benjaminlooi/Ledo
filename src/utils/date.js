export function* getDaysInMonth(interval) {
  let cursor = interval.start.startOf('day')
  while (cursor < interval.end) {
    yield cursor
    cursor = cursor.plus({
      days: 1
    })
  }
}

export function getIsoDateFromLuxonDateTime(luxonDateTime) {
  if (luxonDateTime.isLuxonDateTime) return luxonDateTime.toISODate()
  else {
    console.warn(
      'getIsoDateFromLuxonDateTime error: argument is not valid luxon DateTime object.',
      'Argument: ',
      luxonDateTime
    )

    return luxonDateTime
  }
}

/* 
 @param date1: luxon DateTime object
 @param date2: luxon DateTime object
 */
export function isSameDate(date1, date2) {
  return (
    date1.hasSame(date2, 'year') &&
    date1.hasSame(date2, 'month') &&
    date1.hasSame(date2, 'day')
  )
}
