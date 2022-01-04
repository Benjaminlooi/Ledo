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
      <v-main>
        <slot />
      </v-main>
    </v-scroll-x-transition>

    <!-- <v-footer color="indigo" app>
        <span class="white--text">&copy; 2019</span>
    </v-footer>-->
  </div>
</template>

<script>
import TheSettingsSidebar from '@/components/TheSettingsSidebar.vue'
import TheSidebar from '@/components/TheSidebar.vue'
import { auth } from '@/plugins/firebase'
export default {
  components: { TheSidebar, TheSettingsSidebar },
  data: () => ({
    isSidebarOpen: true,
    isSettingsSidebarOpen: false
  }),
  created() {
    //check if login(ed)
    auth.onAuthStateChanged(user => {
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
      let d = new Date()
      let d1 = new Date()
      d1.setDate(d.getDate() + 0)
      let d2 = new Date()
      d2.setDate(d.getDate() + 1)
      let d3 = new Date()
      d3.setDate(d.getDate() + 2)

      this.$store.dispatch('getDayList', { date: d1 })
      this.$store.dispatch('getDayList', { date: d2 })
      this.$store.dispatch('getDayList', { date: d3 })
    }
  }
}
</script>

<style></style>
