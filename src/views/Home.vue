<template>
  <div>
    <v-navigation-drawer v-model="drawer" mobile-break-point="900" app>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/women/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{$store.state.user.displayName}}</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>
      <v-list dense>
        <!-- <v-list-item @click> -->
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <header class="days-navbar">
      <span>Today</span>
    </header>

    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex text-center></v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <!-- <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>-->
  </div>
</template>

<script>
export default {
  props: {
    // source: String
  },
  data: () => ({
    drawer: null,

    userid: null
  }),
  methods: {
    //
  },
  created() {
    let date = new Date();
    console.log(date)
  }
};
</script>

<style lang="scss" scoped>
.days-navbar {
  position: fixed;
  top: 0;
  left: 256px;
  right: 0;
  border-bottom: 1px solid #acacac;
  padding: 5px;
  text-align: center;
}
</style>
