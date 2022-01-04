<template>
  <v-sheet height="100vh">
    <v-calendar
      style="padding-left: 2.5px;"
      @click:date="calendarDateOnClick"
      event-color="#F0595A"
      type="month"
      :now="calendarNow"
      :value="calendarNow"
      :events="events"
    ></v-calendar>
  </v-sheet>
</template>

<script>
import { getDaysInMonth, getIsoDateFromLuxonDateTime } from '@/utils/date'
import { Interval, DateTime } from 'luxon'
import { auth } from '@/plugins/firebase'

export default {
  name: 'Calendar',
  computed: {
    events() {
      let events = []
      this.$store.state.tasksByDate.forEach(task => {
        if (task.list !== undefined || task.list !== 0) {
          task.list.forEach(list => {
            events.push({
              name: list.title,
              start: task.date
            })
          })
        }
      })
      return events
    },
    calendarNow() {
      const todayDateObj = DateTime.now().startOf('day')
      return todayDateObj.toISODate()
    }
  },
  methods: {
    getRemainingTasksForMonth() {
      let todayDateObj = DateTime.now().startOf('day')
      let startDateObj = todayDateObj.startOf('month')
      let endDateObj = todayDateObj.endOf('month')
      let interval = Interval.fromDateTimes(startDateObj, endDateObj)

      // you can iterate over it
      for (var dateObj of getDaysInMonth(interval)) {
        if (
          !this.$store.state.gettedList.includes(
            getIsoDateFromLuxonDateTime(dateObj)
          )
        ) {
          this.$store.dispatch(
            'getDayList',
            getIsoDateFromLuxonDateTime(dateObj)
          )
        }
      }
    },
    calendarDateOnClick(payload) {
      let d = new Date(payload.date)
      let today = new Date()
      d.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      const diffTime = d - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      // TODO: fix bottom line by moving pos from Home to store
      this.pos = diffDays
      // TODO: redirect to home
    }
  },
  mounted() {
    //check if login(ed)
    auth.onAuthStateChanged(user => {
      if (user) {
        this.getRemainingTasksForMonth()
      }
    })
  }
}
</script>

<style></style>
