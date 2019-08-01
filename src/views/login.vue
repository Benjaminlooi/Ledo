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
import { firebase } from "@/plugins/firebase";

export default {
  data: () => ({
    dialog: true
  }),
  methods: {
    googleLogin() {
      console.log("working");
    }
  },
  created() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }
};
</script>