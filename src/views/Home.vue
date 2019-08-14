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

        <v-list-group v-model="listgroup" no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Labels</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item @click>
            <v-list-item-content>
              <v-list-item-title>blue</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <div class="todo-main">
        <!-- ==== FIRST ==== -->
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
                @keydown.enter="onSubmit($event.target.value, 0);$event.target.value = ''"
              />
            </div>
          </div>
          <v-list>
            <draggable v-model="todo_items_1" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="(todo_item, index) in todo_items_1" :key="todo_item.title" @click @dblclick="todo_item_dblclick(0, index)">
                <v-list-item-action style="margin: 0 16px 0 0">
                  <v-checkbox v-model="todo_item.isDone" @click.native="toggleIsDone(0)"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title" style="font-size: 0.85em;"></v-list-item-title>
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
        <!-- ==== END FIRST ==== -->

        <!-- ==== SECOND ==== -->
        <div class="next-day">
          <div class="days-navbar">
            <div class="date-day">
              {{date_2.getDay() | toDay }}
              <span
                class="date-label"
              >{{date_2.getMonth() | toMonth}} {{date_2.getDate()}}</span>
            </div>

            <div class="add-task">
              <input
                type="text"
                placeholder="Add task +"
                data-list="20190812"
                data-type="Aug 12"
                @keydown.enter="onSubmit($event.target.value, 1);$event.target.value = ''"
              />
            </div>
          </div>
          <v-list>
            <draggable v-model="todo_items_2" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="todo_item in todo_items_2" :key="todo_item.title" @click>
                <v-list-item-action style="margin: 0 16px 0 0">
                  <v-checkbox v-model="todo_item.isDone" @click.native="toggleIsDone(1)"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title" style="font-size: 0.85em;"></v-list-item-title>
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
        <!-- ==== END SECOND ==== -->
        <!-- ==== THIRD ==== -->
        <div class="next-day">
          <div class="days-navbar">
            <div class="date-day">
              {{date_3.getDay() | toDay}}
              <span
                class="date-label"
              >{{date_3.getMonth() | toMonth}} {{date_3.getDate()}}</span>
            </div>

            <div class="add-task">
              <input
                type="text"
                placeholder="Add task +"
                data-list="20190812"
                data-type="Aug 12"
                @keydown.enter="onSubmit($event.target.value, 2);$event.target.value = ''"
              />
            </div>
          </div>
          <v-list>
            <draggable v-model="todo_items_3" group="people" @start="drag=true" @end="drag=false">
              <v-list-item v-for="todo_item in todo_items_3" :key="todo_item.title" @click>
                <v-list-item-action style="margin: 0 16px 0 0">
                  <v-checkbox v-model="todo_item.isDone" @click.native="toggleIsDone(2)"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title" style="font-size: 0.85em;"></v-list-item-title>
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
        <!-- ==== END THIRD ==== -->

        <v-snackbar
          v-model="snackbar_taskDeleteSuccess"
          :timeout="4000"
          color="success"
          bottom
          right
        >
          Task deleted
          <v-btn color="white" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>

        <v-dialog v-model="taskEditDialog.isShow" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">User Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field label="Legal first name*" required></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="Legal middle name"
                      hint="example of helper text only on focus"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      label="Legal last name*"
                      hint="example of persistent helper text"
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Email*" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Password*" type="password" required></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                      label="Interests"
                      multiple
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="taskEditDialog.isShow = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="taskEditDialog.isShow = false">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import { months, day } from "@/utils/date";

export default {
  components: {
    draggable
  },
  props: {
    // source: String
  },
  data: () => ({
    drawer: null,
    snackbar_taskDeleteSuccess: false,
    taskEditDialog: {
      isShow: false,
      
    },

    listgroup: true,

    userid: null,
    date: {
      month: null,
      date: null
    },

    items: [{ title: "Complete" }, { title: "Remove" }, { title: "Label" }]
  }),
  computed: {
    date_2() {
      let today = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow;
    },
    date_3() {
      let today = new Date();
      let day_3 = new Date();
      day_3.setDate(today.getDate() + 2);
      return day_3;
    },
    todo_items_1: {
      get() {
        let d1 = new Date();
        let tasks = this.$store.state.tasks.filter(task => {
          if (task) {
            let d2 = new Date(task.date);
            return (
              d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate()
            );
          }
        });
        if (tasks.length) return tasks[0].list;
        else return null;
      },
      set(value) {
        // this.$store.commit('updateList', value)
      }
    },
    todo_items_2() {
      let d1 = new Date();
      let tasks = this.$store.state.tasks.filter(task => {
        if (task) {
          let d2 = new Date(task.date);
          return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() + 1 === d2.getDate()
          );
        }
      });
      if (tasks.length) return tasks[0].list;
      else return null;
    },
    todo_items_3() {
      let d1 = new Date();
      let tasks = this.$store.state.tasks.filter(task => {
        if (task) {
          let d2 = new Date(task.date);
          return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() + 2 === d2.getDate()
          );
        }
      });
      if (tasks.length) return tasks[0].list;
      else return null;
    }
  },
  watch: {
    // todo_items: function() {
    //   // console.log(this.todo_items);
    // }
  },
  methods: {
    debug() {
      //
      this.snackbar_taskDeleteSuccess = true;
    },
    getLists() {
      let d = new Date();
      let d1 = new Date();
      d1.setDate(d.getDate() + 0);
      let d2 = new Date();
      d2.setDate(d.getDate() + 1);
      let d3 = new Date();
      d3.setDate(d.getDate() + 2);

      this.$store.dispatch("getDayList", { date: d1 });
      this.$store.dispatch("getDayList", { date: d2 });
      this.$store.dispatch("getDayList", { date: d3 });
    },
    onSubmit(inputVal, date) {
      let today = new Date();
      let theDate = new Date();
      theDate.setDate(today.getDate() + date);
      this.$store.dispatch("addUserTask", {
        title: inputVal,
        isDone: false,
        date: theDate
      });
    },
    toggleIsDone(id) {
      this.snackbar_taskDeleteSuccess = true;
      this.updateDayList(id);
    },
    updateDayList(date) {
      let today = new Date();
      let d = new Date();
      d.setDate(today.getDate() + date);

      this.$store.dispatch("updateDayList", {
        date: d
      });
    },
    todo_item_menu_click() {
      //
    },
    todo_item_dblclick(pos, index) {
      let today = new Date();
      let d1 = new Date();
      d1.setDate(today.getDate() + pos);

      let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`;
      let i;
      this.$store.state.tasks.forEach((task, index) => {
        let d2 = new Date(task.date);
        if (d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()) {

          i = index;
        }
      })

      console.log(this.$store.state.tasks[i].list[index])
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
          console.log(error);
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
        this.getLists();
      } else {
        // User is signed out. Redirect to login
        this.$router.push({ path: "/login" });
      }
    });
  },
  filters: {
    toDay: function(value) {
      if (!value) return "";
      return (value = day[value]);
    },
    toMonth: function(value) {
      if (!value) return value;
      return (value = months[value]);
    }
  }
};
</script>

<style lang="scss" scoped>
.todo-main {
  display: flex;
  flex-wrap: wrap;
}
.current-day {
  flex: 0 0 45%;
  max-width: 45%;
  flex-direction: column;
}
.next-day {
  flex: 0 0 27.5%;
  max-width: calc(27.5% - 3px);
  flex-direction: column;
  margin-left: 3px;
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
