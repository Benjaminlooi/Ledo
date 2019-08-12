<template>
  <div>
    <v-navigation-drawer v-model="drawer" :permanent="true" app>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img v-if="$store.state.user" :src="$store.state.user.photoURL" />
          </v-list-item-avatar>

          <v-list-item-content v-if="$store.state.user">
            <v-list-item-title>{{$store.state.user.displayName}}</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>
      <v-list dense>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="signOut">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <div class="todo-main">
        <div class="current-day">
          <div class="days-navbar">
            <div class="date-day">
              Today
              <span class="date-label">{{this.date.month}} {{this.date.date}}</span>
            </div>

            <div class="add-task">
              <input
                type="text"
                placeholder="Add task +"
                data-list="20190812"
                data-type="Aug 12"
                @keydown.enter="onSubmit($event.target.value);$event.target.value = ''"
              />
            </div>
          </div>
          <v-list>
            <draggable v-model="items" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="item in items" :key="item.title" @click="test">
                <v-list-item-action style="margin-right: 0;">
                  <v-radio-group v-model="item.isDone" @click.native.prevent="toggleIsDone(item.id)">
                    <v-radio value="yes"></v-radio>
                  </v-radio-group>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn small icon>
                    <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </draggable>
          </v-list>
        </div>
        <div class="next-day">
          <div class="days-navbar">
            <div class="date-day">
              Today
              <span class="date-label">{{this.date.month}} {{this.date.date}}</span>
            </div>

            <div class="add-task">
              <input type="text" placeholder="Add task +" data-list="20190812" data-type="Aug 12" />
            </div>
          </div>
          <v-list>
            <draggable v-model="items" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="item in items" :key="item.title" @click="test">
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </draggable>
          </v-list>
        </div>
        <div class="next-day">
          <div class="days-navbar">
            <div class="date-day">
              Today
              <span class="date-label">{{this.date.month}} {{this.date.date}}</span>
            </div>

            <div class="add-task">
              <input type="text" placeholder="Add task +" data-list="20190812" data-type="Aug 12" />
            </div>
          </div>
          <v-list>
            <draggable v-model="items" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="item in items" :key="item.title" @click="test">
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </draggable>
          </v-list>
        </div>
      </div>
    </v-content>

    <!-- <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>-->
  </div>
</template>

<script>
import { firebase } from "@/plugins/firebase";
import draggable from "vuedraggable";
import { months } from "@/utils/date";

export default {
  components: {
    draggable
  },
  props: {
    // source: String
  },
  data: () => ({
    drawer: null,

    userid: null,
    date: {
      month: null,
      date: null
    },

    items: [
      {
        id: 0,
        isDone: "no",
        title: "Jason Oner"
      },
      {
        id: 1,
        isDone: "no",
        title: "Travis Howard"
      },
      {
        id: 2,
        isDone: "no",
        title: "Ali Connors"
      },
      {
        id: 3,
        isDone: "no",
        title: "Cindy Baker"
      }
    ]
  }),
  watch: {
    items: function() {
      console.log(this.items);
    }
  },
  methods: {
    //
    test() {
      //
    },
    onSubmit(inputVal) {
      this.items.push({
        title: inputVal
      });
    },
    toggleIsDone(id) {

      console.log("running toggleIsDone");
      let item = this.items.filter(item => {
        return item.id == id;
      });

      console.log(id)
      console.log(item[0])
      console.log(item[0].isDone)
      if (item[0].isDone === "yes") {
        console.log('is true')
        item[0].isDone = "no";
      } else if (item[0].isDone === "false") {
        console.log('is false')
        // item[0].isDone = "true";
      }
    },
    signOut() {
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
    let date = new Date();
    this.date.month = months[date.getMonth()];
    this.date.date = date.getDate();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.$store.commit("setUser", user);
      } else {
        // User is signed out.
        this.$router.push({ path: "/login" });
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.todo-main {
  display: flex;
  flex-wrap: wrap;
}
.current-day {
  flex: 0 0 50%;
  flex-direction: column;
  margin-right: 3px;
}
.next-day {
  flex: 0 0 24%;
  flex-direction: column;
  margin-right: 3px;
}
.date-day {
  font-weight: 400;
}
.date-label {
  padding-left: 5px;
  font-weight: 300;
  font-size: 0.8rem;
}
.add-task {
  width: 100%;
}
.add-task input {
  width: 100%;
  text-align: center;
  height: 40px;
  padding-left: 4px;
  font-size: 100%;
  line-height: normal;
  display: block;
  border-radius: 0;
  font-weight: 400;
  padding: 0.3em;
  background: none;
  border-bottom: 0.5px solid rgba(41, 41, 41, 0.3);
}
.add-task input:focus {
  outline: none;
  border-bottom: 1px solid rgb(0, 73, 209);
}
.days-navbar {
  position: relative;
  top: 0;
  right: 0;
  // border-bottom: 1px solid #acacac;
  padding-top: 6px;
  text-align: center;
}
</style>
