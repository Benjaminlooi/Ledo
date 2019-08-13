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

        <v-list-item @click="debug">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Debug</v-list-item-title>
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
            <draggable v-model="todo_items" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="todo_item in todo_items" :key="todo_item.title" @click>
                <v-list-item-action style="margin: 0 16px 0 0">
                  <v-checkbox v-model="todo_item.isDone"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title"></v-list-item-title>
                </v-list-item-content>

                <v-menu open-on-hover left offset-x>
                  <template v-slot:activator="{ on }">
                    <v-list-item-action style="margin: 0 0 0 16px">
                      <v-btn small icon>
                        <v-icon color="grey lighten-1" v-on="on">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="todo_item_menu_click"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
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
            <draggable v-model="todo_items" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="todo_item in todo_items" :key="todo_item.title" @click>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title"></v-list-item-title>
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
            <draggable v-model="todo_items" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="todo_item in todo_items" :key="todo_item.title" @click>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title"></v-list-item-title>
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
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me 2" }
    ]

    // todo_items: [
    //   {
    //     id: 0,
    //     isDone: true,
    //     title: "Jason Oner"
    //   },
    //   {
    //     id: 1,
    //     isDone: false,
    //     title: "Travis Howard"
    //   }
    // ]
  }),
  computed: {
    todo_items() {
      return this.$store.state.tasks;
    }
  },
  watch: {
    todo_items: function() {
      // console.log(this.todo_items);
    }
  },
  methods: {
    debug() {
      this.$store.dispatch("getUserTasks");
      // this.todo_items.forEach(item => {
      //   console.log(item.isDone);
      // });
    },
    onSubmit(inputVal) {
      this.$store.dispatch('addUserTask', inputVal)
    },
    toggleIsDone(id) {
      console.log("running toggleIsDone");
      let item = this.todo_items.filter(item => {
        return item.id == id;
      });

      console.log(id);
      console.log(item[0]);
      console.log(item[0].isDone);
      if (item[0].isDone === "yes") {
        console.log("is yes");
        item[0].isDone = "no";
      }
    },
    todo_item_menu_click() {
      //
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
          console.log(error)
        });
    }
  },
  created() {
    let date = new Date();
    this.date.month = months[date.getMonth()];
    this.date.date = date.getDate();

    //check if login(ed)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.$store.commit("setUser", user);
        //get user's tasks
        this.$store.dispatch("getUserTasks");
      } else {
        // User is signed out. Redirect to login
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
