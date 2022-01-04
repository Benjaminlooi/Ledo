export function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1)
  var days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

// Convert Luxon Date Time obj to 042022
// New: change LedoDateTime to 01012022
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
