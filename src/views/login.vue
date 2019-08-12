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
                  <v-btn @click="debug1" color="red">
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
    dialog: true,

    auth: {
      provider: null,
    }
  }),
  methods: {
    debug1() {
      console.log(this.$store.state.user);
    },
    googleLogin() {
      firebase
        .auth()
        .signInWithPopup(this.auth.provider)
        .then(result => {
          // console.log("result: ", result);
          // This gives you a Google Access Token. You can use it to access the Google API.
          this.$store.commit("setAccessToken", result.credential.accessToken)
          // The signed-in user info.
          this.$store.commit("setUser", result.user);
          // ...
          this.$router.push({path: '/home'})
        })
        .catch(function(error) {
          console.log("error: ", error);
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // The email of the user's account used.
          // var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          // var credential = error.credential;
          // ...
        });
    },
    googleLogout() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
        })
        .catch(function(error) {
          // An error happened.
        });
    }
  },
  created() {
    this.auth.provider = new firebase.auth.GoogleAuthProvider();
  }
};
</script>