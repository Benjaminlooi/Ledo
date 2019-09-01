<template>
  <v-app id="ledo">
    <v-app-bar dense fixed elevation="0">
      <v-toolbar-title>Ledo</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn text @click="dialogLogIn = true">Login</v-btn>

      <v-btn text>Signup</v-btn>
    </v-app-bar>

    <v-content>
      <v-container style="height: 100vh">
        <div class="intro">
          <div class="intro-text pa-5">
            <h1>Overcome Procrastination and Start Getting Things Done</h1>
          </div>
          <div class="intro-right"></div>
        </div>
      </v-container>
    </v-content>

    <v-dialog v-model="dialogLogIn" max-width="410px">
      <v-card>
        <v-toolbar light elevation="0">
          <v-toolbar-title>Login</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-btn icon @click="dialogLogIn = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-btn block @click="googleLogin" color="primary">
            <v-icon left>mdi-google</v-icon>Log in with Google Account
          </v-btn>
          <!-- <v-divider class="my-4"></v-divider>
          <v-btn block @click="debug1" color="red">
            <v-icon left>mdi-google</v-icon>Log in with Google Account
          </v-btn>-->
        </v-card-text>
        <span class="or-text">OR</span>
        <v-divider class="mx-4"></v-divider>
        <v-card-text>
          <v-text-field label="Email" outlined></v-text-field>
          <v-text-field label="Password" outlined></v-text-field>
          <v-btn block dark color="blue darken-1" @click="dialogLogIn = false">Log In</v-btn>
          <v-divider class="mt-5 mb-3"></v-divider>

          <span style="width: 100%;">
            Don't have an account?
            <a
              @click="dialogLogIn = false; dialogSignUp = true"
              class="text-center"
            >Sign up in seconds</a>
          </span>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSignUp" max-width="410px">
      <v-card>
        <v-toolbar light elevation="0">
          <v-toolbar-title>Login</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-btn icon @click="dialogSignUp = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-btn block @click="googleLogin" color="primary">
            <v-icon left>mdi-google</v-icon>Sign Up with Google Account
          </v-btn>
          <!-- <v-divider class="my-4"></v-divider>
          <v-btn block @click="debug1" color="red">
            <v-icon left>mdi-google</v-icon>Log in with Google Account
          </v-btn>-->
        </v-card-text>
        <v-divider class="mx-4">or</v-divider>
        <v-card-text>
          <v-text-field label="Your name" outlined></v-text-field>
          <v-text-field label="Email" outlined></v-text-field>
          <v-text-field label="Password" outlined></v-text-field>
          <v-btn block dark color="blue darken-1" @click="dialogSignUp = false">Create My Account</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { firebase } from "@/plugins/firebase";

export default {
  data: () => ({
    dialogLogIn: true,
    dialogSignUp: false,

    auth: {
      provider: null
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
          this.$store.commit("setAccessToken", result.credential.accessToken);
          // The signed-in user info.
          this.$store.commit("setUser", result.user);

          this.$router.push({ path: "/home" });
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

<style lang="scss" scoped>
.intro {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.intro-text {
  flex: 60%;
}
.intro-right {
  flex: 40%;
}
.or-text {
  width: 100%;
  display: flex;
  justify-content: center;
  color: #777;
  font-size: 0.8rem;
  padding: 0 16px 0 16px;
}
</style>