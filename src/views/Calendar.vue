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
import { formatDate, getDaysInMonth } from '@/utils/date'

export default {
  name: 'Calendar',
  computed: {
    events() {
      let events = []
      this.$store.state.tasks.forEach(task => {
        let d = new Date(task.date)
        let date = formatDate(d)
        if (task.list !== undefined || task.list !== 0) {
          task.list.forEach(list => {
            events.push({
              name: list.title,
              start: date
            })
          })
        }
      })
      return events
    }
  },
  methods: {
    getRemainingTasksForMonth() {
      let today = new Date()
      let currentMonth = today.getMonth()
      let currentYear = today.getFullYear()
      let daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear)
      // console.log(daysInCurrentMonth)
      daysInCurrentMonth.forEach(days => {
        let d1 = new Date(days)
        let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`
        if (!this.$store.state.gettedList.includes(date)) {
          this.$store.dispatch('getDayList', { date: d1 })
        }
      })
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
    this.getRemainingTasksForMonth()
  }
}
</script>

<style></style>
