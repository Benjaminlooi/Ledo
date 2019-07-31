<template>
  <v-app id="ledo">
    <v-layout justify-center>
      <v-dialog v-model="dialog" persistent max-width="300px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Login</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Login with...</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-btn @click="googleLogin" color="primary">
                    <v-icon>mdi-google</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: true
  }),
  methods: {
    googleLogin() {
      console.log("working")
    }
  }
};
</script>