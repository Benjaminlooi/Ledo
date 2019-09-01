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
        <!-- <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>-->

        <!-- <v-list-item @click="debug">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Debug</v-list-item-title>
          </v-list-item-content>
        </v-list-item>-->

        <v-list-group v-model="listgroup">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Labels</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item @click>
            <v-list-item-icon>
              <v-icon color="red">mdi-checkbox-blank-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>High priority</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click>
            <v-list-item-icon>
              <v-icon color="blue">mdi-checkbox-blank-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Normal priority</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click>
            <v-list-item-icon>
              <v-icon>mdi-checkbox-blank-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Low priority</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="light-blue darken-1" dark @click="signOut">
            Logout
            <v-icon right dark>mdi-logout</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-content>
      <v-btn
        absolute
        icon
        top
        right
        fab
        x-small
        style="top: 19px; left: 10px;"
        @click="movePosPrev"
      >
        <v-icon>mdi-arrow-left-drop-circle-outline</v-icon>
      </v-btn>
      <v-btn
        absolute
        icon
        top
        right
        fab
        x-small
        style="top: 19px; right: 10px;"
        @click="movePosNext"
      >
        <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
      </v-btn>
      <div class="todo-main">
        <!-- ==== FIRST ==== -->
        <div :class="{'next-day': !isToday(date_1), 'current-day': isToday(date_1)}">
          <div class="days-navbar">
            <div v-if="isToday(date_1)" class="date-day">
              Today
              <span class="date-label">{{date_1.getMonth() | toMonth}} {{date_1.getDate()}}</span>
            </div>
            <div v-else class="date-day">
              {{date_1.getDay() | toDay }}
              <span
                class="date-label"
              >{{date_1.getMonth() | toMonth}} {{date_1.getDate()}}</span>
            </div>

            <div class="add-task">
              <input
                type="text"
                placeholder="Add task +"
                @keydown.enter="onSubmit_addTask($event.target.value, 0);$event.target.value = ''"
              />
            </div>
          </div>
          <draggable v-model="todo_items_1" group="people" @start="drag=true" @end="drag=false">
            <v-slide-y-transition class="py-0" group tag="v-list">
              <v-list-item
                v-for="(todo_item, index) in todo_items_1"
                :key="index"
                @click.prevent
                @dblclick="todo_item_dblclick(0, index)"
              >
                <v-list-item-action style="margin: 0 16px 0 0">
                  <v-checkbox
                    :class="{'priority-zero': todo_item.priority == 0, 'priority-one': todo_item.priority == 1, 'priority-two': todo_item.priority == 2}"
                    v-model="todo_item.isDone"
                    @click.native="toggleIsDone(0)"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title" style="font-size: 0.85em;"></v-list-item-title>
                </v-list-item-content>

                <v-menu open-on-hover dense left offset-x close-delay="200">
                  <template v-slot:activator="{ on }">
                    <v-list-item-action style="margin: 0 0 0 16px">
                      <v-btn small icon>
                        <v-icon color="grey lighten-1" v-on="on">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, menu_index) in items"
                      :key="menu_index"
                      @click="todo_item_menu_click(menu_index,0,index)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
            </v-slide-y-transition>
          </draggable>
        </div>
        <!-- ==== END FIRST ==== -->

        <!-- ==== SECOND ==== -->
        <div :class="{'next-day': !isToday(date_2), 'current-day': isToday(date_2)}">
          <div class="days-navbar">
            <div v-if="isToday(date_2)" class="date-day">
              Today
              <span class="date-label">{{date_2.getMonth() | toMonth}} {{date_2.getDate()}}</span>
            </div>
            <div v-else class="date-day">
              {{date_2.getDay() | toDay }}
              <span
                class="date-label"
              >{{date_2.getMonth() | toMonth}} {{date_2.getDate()}}</span>
            </div>

            <div class="add-task">
              <input
                type="text"
                placeholder="Add task +"
                @keydown.enter="onSubmit_addTask($event.target.value, 1);$event.target.value = ''"
              />
            </div>
          </div>
          <draggable v-model="todo_items_2" group="people" @start="drag=true" @end="drag=false">
            <v-slide-y-transition class="py-0" group tag="v-list">
              <v-list-item
                v-for="(todo_item, index) in todo_items_2"
                :key="index"
                @click.prevent
                @dblclick="todo_item_dblclick(1, index)"
              >
                <v-list-item-action style="margin: 0 16px 0 0">
                  <v-checkbox
                    :class="{'priority-zero': todo_item.priority == 0, 'priority-one': todo_item.priority == 1, 'priority-two': todo_item.priority == 2}"
                    v-model="todo_item.isDone"
                    @click.native="toggleIsDone(1)"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title" style="font-size: 0.85em;"></v-list-item-title>
                </v-list-item-content>

                <v-menu open-on-hover dense left offset-x close-delay="200">
                  <template v-slot:activator="{ on }">
                    <v-list-item-action style="margin: 0 0 0 16px">
                      <v-btn small icon>
                        <v-icon color="grey lighten-1" v-on="on">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, menu_index) in items"
                      :key="menu_index"
                      @click="todo_item_menu_click(menu_index,1,index)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
            </v-slide-y-transition>
          </draggable>
        </div>
        <!-- ==== END SECOND ==== -->
        <!-- ==== THIRD ==== -->
        <div :class="{'next-day': !isToday(date_3), 'current-day': isToday(date_3)}">
          <div class="days-navbar">
            <div v-if="isToday(date_3)" class="date-day">
              Today
              <span class="date-label">{{date_3.getMonth() | toMonth}} {{date_3.getDate()}}</span>
            </div>
            <div v-else class="date-day">
              {{date_3.getDay() | toDay }}
              <span
                class="date-label"
              >{{date_3.getMonth() | toMonth}} {{date_3.getDate()}}</span>
            </div>

            <div class="add-task">
              <input
                type="text"
                placeholder="Add task +"
                @keydown.enter="onSubmit_addTask($event.target.value, 2);$event.target.value = ''"
              />
            </div>
          </div>
          <draggable v-model="todo_items_3" group="people" @start="drag=true" @end="drag=false">
            <v-slide-y-transition class="py-0" group tag="v-list">
              <v-list-item
                v-for="(todo_item, index) in todo_items_3"
                :key="index"
                @click.prevent
                @dblclick="todo_item_dblclick(2, index)"
              >
                <v-list-item-action style="margin: 0 16px 0 0">
                  <v-checkbox
                    :class="{'priority-zero': todo_item.priority == 0, 'priority-one': todo_item.priority == 1, 'priority-two': todo_item.priority == 2}"
                    v-model="todo_item.isDone"
                    @click.native="toggleIsDone(2)"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="todo_item.title" style="font-size: 0.85em;"></v-list-item-title>
                </v-list-item-content>

                <v-menu open-on-hover left offset-x close-delay="200">
                  <template v-slot:activator="{ on }">
                    <v-list-item-action style="margin: 0 0 0 16px">
                      <v-btn small icon>
                        <v-icon color="grey lighten-1" v-on="on">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, menu_index) in items"
                      :key="menu_index"
                      @click="todo_item_menu_click(menu_index,2,index)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
            </v-slide-y-transition>
          </draggable>
        </div>
        <!-- ==== END THIRD ==== -->

        <v-snackbar
          v-model="snackbar_taskCompleteSuccess"
          :timeout="4000"
          color="success"
          bottom
          right
        >
          Task Completed
          <v-btn color="white" text @click="snackbar_taskCompleteSuccess = false">Close</v-btn>
        </v-snackbar>

        <v-snackbar
          v-model="snackbar_taskDeleteSuccess"
          :timeout="4000"
          color="success"
          bottom
          right
        >
          Task Deleted
          <v-btn color="white" text @click="snackbar_taskDeleteSuccess = false">Close</v-btn>
        </v-snackbar>

        <v-dialog v-model="taskEditDialog.isShow" max-width="600px">
          <template v-slot:activator="{ on }">
            <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
          </template>
          <v-card>
            <v-card-title style="border-bottom: 1px solid #acacac">
              <v-text-field
                label="Subject"
                v-model="taskEditDialog.title"
                single-line
                full-width
                hide-details
                class="title"
              ></v-text-field>
              <!-- <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Subject"
                      :value="taskEditDialog.title"
                      single-line
                      full-width
                      hide-details
                      class="title"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Add subtask..."
                      value="t"
                      single-line
                      full-width
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>-->
            </v-card-title>
            <v-card-title style="border-bottom: 1px solid #acacac">
              <v-text-field
                label="Add subtask..."
                single-line
                @keydown.enter="onSubmit_addSubTask($event.target.value, 0);$event.target.value = ''"
              ></v-text-field>
              <v-list>
                <v-list-item
                  v-for="(subTask, index) in taskEditDialog.subTasks"
                  :key="index"
                >{{subTask.title}}</v-list-item>
              </v-list>
            </v-card-title>

            <v-card-text>
              <v-container fluid>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-textarea
                      label="Notes..."
                      v-model="taskEditDialog.notes"
                      rows="6"
                      full-width
                      no-resize
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn block color="light-blue darken-1" dark @click="updateTask">Save task and close</v-btn>
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
    pos: 0,
    drawer: null,
    snackbar_taskCompleteSuccess: false,
    snackbar_taskDeleteSuccess: false,
    taskEditDialog: {
      isShow: false,
      title: null,
      notes: "",
      task_index: null,
      list_index: null,
      subTasks: []
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
    date_1() {
      let today = new Date();
      let day_1 = new Date();
      day_1.setDate(today.getDate() + 0 + this.pos);
      // console.log(day_1 .getDay())
      return day_1;
    },
    date_2() {
      let today = new Date();
      let day_2 = new Date();
      day_2.setDate(today.getDate() + 1 + this.pos);
      // console.log(day_2.getDay())
      return day_2;
    },
    date_3() {
      let today = new Date();
      let day_3 = new Date();
      day_3.setDate(today.getDate() + 2 + this.pos);
      // console.log(day_3.getDay())
      return day_3;
    },
    todo_items_1: {
      get() {
        let today = new Date();
        let d1 = new Date();
        d1.setDate(today.getDate() + 0 + this.pos);
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
        let today = new Date();
        let d1 = new Date();
        d1.setDate(today.getDate() + this.pos);
        this.$store.dispatch("reorderUserTask", {
          date: d1,
          data: value
        });
      }
    },
    todo_items_2: {
      get() {
        let today = new Date();
        let d1 = new Date();
        d1.setDate(today.getDate() + 1 + this.pos);
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
        let today = new Date();
        let d1 = new Date();
        d1.setDate(today.getDate() + 1 + this.pos);
        this.$store.dispatch("reorderUserTask", {
          date: d1,
          data: value
        });
      }
    },
    todo_items_3: {
      get() {
        let today = new Date();
        let d1 = new Date();
        d1.setDate(today.getDate() + 2 + this.pos);
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
        let today = new Date();
        let d1 = new Date();
        d1.setDate(today.getDate() + 2 + this.pos);
        this.$store.dispatch("reorderUserTask", {
          date: d1,
          data: value
        });
      }
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
    movePosPrev() {
      --this.pos;

      let d1 = new Date(this.date_1);
      let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`;
      if (!this.$store.state.gettedList.includes(date)) {
        this.$store.dispatch("getDayList", { date: this.date_1 });
      }
    },
    movePosNext() {
      ++this.pos;

      let d1 = new Date(this.date_3);
      let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`;
      if (!this.$store.state.gettedList.includes(date)) {
        this.$store.dispatch("getDayList", { date: this.date_3 });
      }
    },
    isToday(date) {
      let d1 = new Date();
      let d2 = new Date(date);
      if (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      ) {
        return true;
      } else return false;
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
    onSubmit_addTask(inputVal, pos) {
      let today = new Date();
      let theDate = new Date();
      theDate.setDate(today.getDate() + pos + this.pos);

      this.$store.dispatch("addUserTask", {
        title: inputVal,
        isDone: false,
        date: theDate
      });
    },
    onSubmit_addSubTask(inputVal, pos) {
      let today = new Date();
      let theDate = new Date();
      theDate.setDate(today.getDate() + pos + this.pos);

      this.$store.dispatch("addUserSubTask", {
        title: inputVal,
        isDone: false,
        date: this.taskEditDialog.date,
        taskIndex: this.taskEditDialog.task_index,
        listIndex: this.taskEditDialog.list_index
      });
    },
    toggleIsDone(pos) {
      this.snackbar_taskCompleteSuccess = true;
      this.updateDayList(pos);
    },
    updateDayList(pos) {
      let today = new Date();
      let theDate = new Date();
      theDate.setDate(today.getDate() + pos + this.pos);

      this.$store.dispatch("updateDayList", {
        date: theDate
      });
    },
    searchForTaskIndexGivenDate(pos) {
      let today = new Date();
      let d1 = new Date();
      d1.setDate(today.getDate() + pos + this.pos);

      let task_index;
      this.$store.state.tasks.forEach((task, index) => {
        let d2 = new Date(task.date);
        if (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        ) {
          task_index = index;
        }
      });
      return task_index;
    },
    todo_item_menu_click(menu_index, pos, list_index) {
      switch (menu_index) {
        case 1:
          let today = new Date();
          let d1 = new Date();
          d1.setDate(today.getDate() + pos + this.pos);

          let task_index = this.searchForTaskIndexGivenDate(pos);

          this.$store.dispatch("removeUserTask", {
            taskIndex: task_index,
            listIndex: list_index,
            date: d1
          });
          this.snackbar_taskDeleteSuccess = true;
          break;
      }
    },
    todo_item_dblclick(pos, list_index) {
      let today = new Date();
      let theDate = new Date();
      theDate.setDate(today.getDate() + pos + this.pos);

      let task_index = this.searchForTaskIndexGivenDate(pos);

      this.taskEditDialog.title = this.$store.state.tasks[task_index].list[
        list_index
      ].title;
      this.taskEditDialog.notes = this.$store.state.tasks[task_index].list[
        list_index
      ].notes;
      this.taskEditDialog.date = theDate;
      this.taskEditDialog.task_index = task_index;
      this.taskEditDialog.list_index = list_index;
      this.taskEditDialog.isShow = true;
      this.taskEditDialog.subTasks = this.$store.state.tasks[task_index].list[
        list_index
      ].subTasks;
    },
    updateTask() {
      this.taskEditDialog.notes = !this.taskEditDialog.notes
        ? ""
        : this.taskEditDialog.notes;
      this.taskEditDialog.isShow = false;
      this.$store.dispatch("updateUserTask", {
        date: this.taskEditDialog.date,
        title: this.taskEditDialog.title,
        notes: this.taskEditDialog.notes,
        taskIndex: this.taskEditDialog.task_index,
        listIndex: this.taskEditDialog.list_index
      });
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
      return day[value];
    },
    toMonth: function(value) {
      return months[value];
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
