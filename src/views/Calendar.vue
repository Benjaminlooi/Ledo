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
import { formatDate } from '@/utils/date'
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
  }
}
</script>

<style></style>
