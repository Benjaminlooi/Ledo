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
    }
  }
}
</script>

<style></style>
