<template>
  <v-scroll-y-transition>
    <v-navigation-drawer :value="open" mobile-breakpoint="1030" app>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img v-if="$store.state.user" :src="$store.state.user.photoURL" />
          </v-list-item-avatar>

          <v-list-item-content v-if="$store.state.user">
            <v-list-item-title>
              {{ $store.state.user.displayName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-btn
                @click="handleSettingsSidebarOpen()"
                color="#F0595A"
                x-small
                outlined
                style="font-size: 0.7em;"
                >Edit Profile</v-btn
              >
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item to="home">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="calendar">
          <v-list-item-action>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Month View</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- <v-list-item @click="debug">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Debug</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
      </v-list>

      <v-list dense nav>
        <v-list-item-content>
          <v-list-item-title>
            Filter
            <v-btn
              v-if="listPriority !== undefined"
              text
              x-small
              color="primary"
              right
              absolute
              @click="listPriority = undefined"
              >Clear filter</v-btn
            >
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-group v-model="listPriority">
          <v-list-item v-for="(list, i) in priorityList" :key="i">
            <v-list-item-icon>
              <v-icon :color="list.iconColor">mdi-circle-slice-8</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ list.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="#F0595A" dark @click="signOut">
            Logout
            <v-icon right dark>mdi-logout</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-scroll-y-transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    open: Boolean,
    handleSettingsSidebarOpen: Function,
    signOut: Function
  },
  data: () => ({
    priorityList: [
      { iconColor: '#F0595A', title: 'High priority' },
      { iconColor: 'blue', title: 'Normal priority' },
      { iconColor: '', title: 'Low priority' }
    ]
  }),
  computed: {
    ...mapState({
      storeListPriority: 'listPriority'
    }),
    listPriority: {
      set(value) {
        this.$store.commit('setListPriority', value)
      },
      get() {
        // Or remove mapState and use this.$store.state.values.example
        return this.storeListPriority
      }
    }
  },
  methods: {}
}
</script>

<style></style>
