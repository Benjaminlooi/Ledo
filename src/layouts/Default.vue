<template>
  <div>
    <TheSidebar
      :signOut="signOut"
      :open="isSidebarOpen"
      :handleSettingsSidebarOpen="openSettingsSidebar"
    />
    <TheSettingsSidebar
      :open="isSettingsSidebarOpen"
      :handleSettingsSidebarClose="closeSettingsSidebar"
    />
    <v-scroll-x-transition leave-absolute>
      <v-main class="v-main">
        <slot />
      </v-main>
    </v-scroll-x-transition>

    <!-- <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019-2021 Benjamin Looi</span>
    </v-footer> -->
  </div>
</template>

<script>
import TheSettingsSidebar from '@/components/TheSettingsSidebar.vue'
import TheSidebar from '@/components/TheSidebar.vue'
import { auth } from '@/plugins/firebase'
import { DateTime } from 'luxon'
import { getIsoDateFromLuxonDateTime } from '@/utils/date'
import { onAuthStateChanged } from '@firebase/auth'

export default {
  components: { TheSidebar, TheSettingsSidebar },
  data: () => ({
    isSidebarOpen: true,
    isSettingsSidebarOpen: false
  }),
  created() {
    //check if login(ed)
    onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in.
        this.$store.commit('setUser', user)
        //get user's tasks
        this.getLists()
      } else {
        // User is signed out. Redirect to login
        this.$router.push({ path: '/login' })
      }
    })
  },
  methods: {
    openSettingsSidebar() {
      this.isSettingsSidebarOpen = true
    },
    closeSettingsSidebar() {
      this.isSettingsSidebarOpen = false
    },
    signOut() {
      auth
        .signOut()
        .then(() => {
          // Sign-out successful.
          this.$store.commit('clearTasksArr')
        })
        .catch(function(error) {
          // An error happened.
          console.log(error)
        })
    },
    getLists() {
      let currentDate = DateTime.now().startOf('day')
      let dateOne = currentDate
      let dateTwo = currentDate.plus({ days: 1 })
      let dateThree = currentDate.plus({ days: 2 })

      this.$store.dispatch('getDayList', getIsoDateFromLuxonDateTime(dateOne))
      this.$store.dispatch('getDayList', getIsoDateFromLuxonDateTime(dateTwo))
      this.$store.dispatch('getDayList', getIsoDateFromLuxonDateTime(dateThree))
    }
  }
}
</script>

<style lang="scss" scoped>
.v-main {
  height: 100vh;
}
</style>
