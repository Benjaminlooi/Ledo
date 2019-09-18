<template>
  <v-app id="ledo">
    <v-app-bar dense fixed elevation="0">
      <v-toolbar-title style="display: flex;">
        <v-icon color="#F0595A">mdi-clipboard-check</v-icon>
        <span style="padding-left: 2px;">Ledo</span>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn outlined color="#F0595A" @click="dialogLogIn = true">Login</v-btn>

      <v-btn text @click="dialogSignUp = true">Signup</v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid style="height: 100vh; padding: 0;">
        <div class="intro">
          <div class="intro-text px-12 py-8">
            <v-sparkline
              :value="value"
              :gradient="gradient"
              :smooth="radius || false"
              :padding="padding"
              :line-width="width"
              :stroke-linecap="lineCap"
              :gradient-direction="gradientDirection"
              :fill="fill"
              :type="type"
              :auto-line-width="autoLineWidth"
              auto-draw
              class="py-4"
            ></v-sparkline>
            <h1 style="font-size: 42px;">Overcome Procrastination and Start Getting Things Done</h1>
          </div>
          <div class="intro-right"></div>
        </div>
      </v-container>
    </v-content>

    <v-dialog v-model="dialogLogIn" max-width="410px" persistent>
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
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <span class="or-text">OR...</span>
        <v-card-text>
          <v-form ref="formLogin" v-model="formLoginIsValid" :lazy-validation="false">
            <v-alert v-if="errorLogin" type="error">{{errorLoginMessage}}</v-alert>
            <v-text-field
              type="email"
              v-model="inputEmail"
              name="email"
              label="Email"
              :rules="emailRules"
              outlined
            ></v-text-field>
            <v-text-field
              :type="inputPasswordLoginShow ? 'text' : 'password'"
              name="password"
              v-model="inputPassword"
              label="Password"
              :append-icon="inputPasswordLoginShow ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              hint="At least 6 characters"
              @click:append="inputPasswordLoginShow = !inputPasswordLoginShow"
              outlined
            ></v-text-field>
            <v-btn
              block
              color="#F0595A"
              :disabled="!formLoginIsValid"
              @click="passwordLogin"
              style="color: white;"
            >Log In</v-btn>
            <v-divider class="mt-5 mb-3"></v-divider>

            <span style="width: 100%;">
              Don't have an account?
              <a
                @click="dialogLogIn = false; dialogSignUp = true"
                class="text-center" style="color: #F0595A"
              >Sign up in seconds</a>
            </span>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSignUp" max-width="410px" persistent>
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
        </v-card-text>

        <v-divider class="mx-4"></v-divider>
        <span class="or-text">OR...</span>
        <v-card-text>
          <v-form ref="formSignUp" v-model="formSignUpIsValid" :lazy-validation="false">
            <v-alert v-if="errorSignUp" type="error">{{errorSignUpMessage}}</v-alert>
            <v-text-field
              type="text"
              name="name"
              v-model="inputName"
              label="Your name"
              :rules="nameRules"
              outlined
            ></v-text-field>
            <v-text-field
              type="email"
              v-model="inputEmail"
              name="email"
              label="Email"
              :rules="emailRules"
              outlined
            ></v-text-field>
            <v-text-field
              :type="inputPasswordLoginShow ? 'text' : 'password'"
              name="password"
              v-model="inputPassword"
              label="Password"
              :append-icon="inputPasswordLoginShow ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              hint="At least 6 characters"
              @click:append="inputPasswordLoginShow = !inputPasswordLoginShow"
              outlined
            ></v-text-field>
            <v-btn
              block
              color="#F0595A"
              style="color: white;"
              :disabled="!formSignUpIsValid"
              @click="passwordSignup"
            >Create My Account</v-btn>
            <v-divider class="mt-5 mb-3"></v-divider>

            <span style="width: 100%;">
              Already have an account? 
              <a
                @click="dialogSignUp = false; dialogLogIn = true;"
                class="text-center" style="color: #F0595A"
              >Log in instead!</a>
            </span>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { firebase } from "@/plugins/firebase";
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
  ["#F0595A", "#ffd200",  "#1FEAEA", "#40596B"]
];

export default {
  data: () => ({
    dialogLogIn: false,
    dialogSignUp: false,

    inputName: undefined,
    inputEmail: undefined,
    inputPassword: undefined,
    inputPasswordLoginShow: false,
    nameRules: [v => !!v || "Name is required"],
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length >= 6) || "Password must be at least 6 characters"
    ],
    formLoginIsValid: false,
    formSignUpIsValid: false,
    errorLogin: false,
    errorLoginMessage: "",
    errorSignUp: false,
    errorSignUpMessage: "",

    auth: {
      provider: null
    },

    width: 4,
    radius: 10,
    padding: 3,
    lineCap: "round",
    gradient: gradients[6],
    value: [0, 2, 3, 5, 2, 5, 1, 3, 4, 3, 6, 8, 6, 9, 10],
    gradientDirection: "top",
    gradients,
    fill: false,
    type: "trend",
    autoLineWidth: false
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
    passwordLogin() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.inputEmail, this.inputPassword)
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          console.log("error! ", error);
          this.errorLogin = true;
          this.errorLoginMessage = errorMessage;
        });
    },
    passwordSignup() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.inputEmail, this.inputPassword)
        .then(user => {
          if (user) {
            var u = firebase.auth().currentUser;
            u.updateProfile({
              displayName: this.inputName
            })
              .then(function() {
                // Update successful.
              })
              .catch(function(error) {
                // An error happened.
              });
          }
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("error! ", error);
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
    //check if login(ed)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.$store.commit("setUser", user);
        this.$router.push({ path: "/home" });
      }
    });

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
  height: 100%;
  background: url(../assets/boy.png) bottom left no-repeat,
    url(../assets/frame.png) center no-repeat, #40596b;
  background-size: 100%, cover;
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