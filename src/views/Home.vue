<template>
  <div>
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

    <v-tooltip bottom v-if="pos > 1 || pos < -1">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          absolute
          x-small
          icon
          fab
          style="top: -3px; right: -3px; z-index: 55;"
          @click="pos = 0"
        >
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </template>
      <span>Reset</span>
    </v-tooltip>

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
      <div
        :class="{
          'next-day': !isToday(date_1),
          'current-day': isToday(date_1),
          'any-day': !isTodayOnScreen
        }"
      >
        <div class="days-navbar">
          <div v-if="isToday(date_1)" class="date-day">
            Today
            <span class="date-label">
              {{ date_1.toFormat('MMM') }}
              {{ date_1.toFormat('d') }}
            </span>
          </div>
          <div v-else class="date-day">
            {{ date_1.toFormat('EEEE') }}
            <span class="date-label">
              {{ date_1.toFormat('MMM') }}
              {{ date_1.toFormat('d') }}
            </span>
          </div>

          <div class="add-task">
            <input
              type="text"
              placeholder="Add task +"
              @keydown.enter="
                onSubmit_addTask($event.target.value, 0)
                $event.target.value = ''
              "
            />
          </div>
        </div>
        <draggable
          v-model="todo_items_1"
          style="display: flex;"
          group="task"
          @start="drag = true"
          @end="drag = false"
        >
          <!-- 
          ! Error:
          Unknown custom element: <v-list> - did you register the component correctly? For recursive components, make sure to provide the "name" option.
            If don't use v-list in tag attribute, will cause transition not working (on new task added)
           -->
          <v-slide-y-transition
            class="py-0"
            style="width: 100%; min-height: 50px;"
            group
            tag="v-list"
          >
            <v-list-item
              v-for="(todo_item, index) in todo_items_1"
              :key="index"
              @click.prevent
              @dblclick.native="todo_item_dblclick(0, index)"
            >
              <v-list-item-action style="margin: 0 16px 0 0">
                <v-checkbox
                  :class="{
                    'priority-zero': todo_item.priority == 0,
                    'priority-one': todo_item.priority == 1,
                    'priority-two': todo_item.priority == 2
                  }"
                  v-model="todo_item.isDone"
                  @click.native="toggleIsDone(0, todo_item.isDone)"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  v-if="!todo_item.isDone"
                  v-text="todo_item.title"
                  style="font-size: 0.85em;"
                ></v-list-item-title>
                <v-list-item-title
                  v-else
                  v-text="todo_item.title"
                  style="font-size: 0.85em; color: #B3B4B4!important;
    text-decoration: line-through;"
                ></v-list-item-title>
              </v-list-item-content>

              <v-menu open-on-hover dense left offset-x close-delay="200">
                <template v-slot:activator="{ on: taskMenu }">
                  <v-list-item-action style="margin: 0 0 0 16px">
                    <v-btn small icon v-on="taskMenu">
                      <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </template>

                <v-list dense>
                  <v-list-item
                    v-if="isBeforeToday(0)"
                    @click="todo_item_menu_click(0, 0, index)"
                  >
                    <v-list-item-title>Move to today</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="todo_item_menu_click(1, 0, index)">
                    <v-list-item-title>Remove</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="todo_item_menu_click(2, 0, index)">
                    <v-icon color="red">mdi-circle-slice-8</v-icon>
                    <v-list-item-title>High Priority</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="todo_item_menu_click(3, 0, index)">
                    <v-icon color="blue">mdi-circle-slice-8</v-icon>
                    <v-list-item-title>Normal Priority</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="todo_item_menu_click(4, 0, index)">
                    <v-icon>mdi-circle-slice-8</v-icon>
                    <v-list-item-title>Low Priority</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item>
          </v-slide-y-transition>
        </draggable>
      </div>
      <!-- ==== END FIRST ==== -->

      <!-- ==== SECOND ==== -->
      <div
        :class="{
          'next-day': !isToday(date_2),
          'current-day': isToday(date_2),
          'any-day': !isTodayOnScreen
        }"
      >
        <div class="days-navbar">
          <div v-if="isToday(date_2)" class="date-day">
            Today
            <span class="date-label">
              {{ date_2.toFormat('MMM') }}
              {{ date_2.toFormat('d') }}
            </span>
          </div>
          <div v-else class="date-day">
            {{ date_2.toFormat('EEEE') }}
            <span class="date-label">
              {{ date_2.toFormat('MMM') }}
              {{ date_2.toFormat('d') }}
            </span>
          </div>

          <div class="add-task">
            <input
              type="text"
              placeholder="Add task +"
              @keydown.enter="
                onSubmit_addTask($event.target.value, 1)
                $event.target.value = ''
              "
            />
          </div>
        </div>
        <draggable
          v-model="todo_items_2"
          style="display: flex;"
          group="task"
          @start="drag = true"
          @end="drag = false"
        >
          <v-slide-y-transition
            class="py-0"
            style="width: 100%; min-height: 50px;"
            group
            tag="v-list"
          >
            <v-list-item
              v-for="(todo_item, index) in todo_items_2"
              :key="index"
              @click.prevent
              @dblclick.native="todo_item_dblclick(1, index)"
            >
              <v-list-item-action style="margin: 0 16px 0 0">
                <v-checkbox
                  :class="{
                    'priority-zero': todo_item.priority == 0,
                    'priority-one': todo_item.priority == 1,
                    'priority-two': todo_item.priority == 2
                  }"
                  v-model="todo_item.isDone"
                  @click.native="toggleIsDone(1, todo_item.isDone)"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  v-if="!todo_item.isDone"
                  v-text="todo_item.title"
                  style="font-size: 0.85em;"
                ></v-list-item-title>
                <v-list-item-title
                  v-else
                  v-text="todo_item.title"
                  style="font-size: 0.85em; color: #B3B4B4!important;
    text-decoration: line-through;"
                ></v-list-item-title>
              </v-list-item-content>

              <v-menu open-on-hover dense left offset-x close-delay="200">
                <template v-slot:activator="{ on: taskMenu }">
                  <v-list-item-action style="margin: 0 0 0 16px">
                    <v-btn small icon v-on="taskMenu">
                      <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </template>

                <v-list dense>
                  <v-list-item
                    v-if="isBeforeToday(1)"
                    @click="todo_item_menu_click(0, 1, index)"
                  >
                    <v-list-item-title>Move to today</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="todo_item_menu_click(1, 1, index)">
                    <v-list-item-title>Remove</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="todo_item_menu_click(2, 1, index)">
                    <v-icon color="red">mdi-circle-slice-8</v-icon>
                    <v-list-item-title>High Priority</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="todo_item_menu_click(3, 1, index)">
                    <v-icon color="blue">mdi-circle-slice-8</v-icon>
                    <v-list-item-title>Normal Priority</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="todo_item_menu_click(4, 1, index)">
                    <v-icon>mdi-circle-slice-8</v-icon>
                    <v-list-item-title>Low Priority</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item>
          </v-slide-y-transition>
        </draggable>
      </div>
      <!-- ==== END SECOND ==== -->

      <!-- ==== THIRD ==== -->
      <div
        :class="{
          'next-day': !isToday(date_3),
          'current-day': isToday(date_3),
          'any-day': !isTodayOnScreen
        }"
      >
        <div class="days-navbar">
          <div v-if="isToday(date_3)" class="date-day">
            Today
            <span class="date-label">
              {{ date_3.toFormat('MMM') }}
              {{ date_3.toFormat('d') }}
            </span>
          </div>
          <div v-else class="date-day">
            {{ date_3.toFormat('EEEE') }}
            <span class="date-label">
              {{ date_3.toFormat('MMM') }}
              {{ date_3.toFormat('d') }}
            </span>
          </div>

          <div class="add-task">
            <input
              type="text"
              placeholder="Add task +"
              @keydown.enter="
                onSubmit_addTask($event.target.value, 2)
                $event.target.value = ''
              "
            />
          </div>
        </div>
        <draggable
          v-model="todo_items_3"
          style="display: flex;"
          group="task"
          @start="drag = true"
          @end="drag = false"
        >
          <v-slide-y-transition
            class="py-0"
            style="width: 100%; min-height: 50px;"
            group
            tag="v-list"
          >
            <v-list-item
              v-for="(todo_item, index) in todo_items_3"
              :key="index"
              @click.prevent
              @dblclick.native="todo_item_dblclick(2, index)"
            >
              <v-list-item-action style="margin: 0 16px 0 0">
                <v-checkbox
                  :class="{
                    'priority-zero': todo_item.priority == 0,
                    'priority-one': todo_item.priority == 1,
                    'priority-two': todo_item.priority == 2
                  }"
                  v-model="todo_item.isDone"
                  @click.native="toggleIsDone(2, todo_item.isDone)"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  v-if="!todo_item.isDone"
                  v-text="todo_item.title"
                  style="font-size: 0.85em;"
                ></v-list-item-title>
                <v-list-item-title
                  v-else
                  v-text="todo_item.title"
                  style="font-size: 0.85em; color: #B3B4B4!important;
    text-decoration: line-through;"
                ></v-list-item-title>
              </v-list-item-content>

              <v-menu open-on-hover left offset-x close-delay="200">
                <template v-slot:activator="{ on: taskMenu }">
                  <v-list-item-action style="margin: 0 0 0 16px">
                    <v-btn small icon v-on="taskMenu">
                      <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </template>

                <v-list dense>
                  <v-list-item
                    v-if="isBeforeToday(2)"
                    @click="todo_item_menu_click(0, 2, index)"
                  >
                    <v-list-item-title>Move to today</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="todo_item_menu_click(1, 2, index)">
                    <v-list-item-title>Remove</v-list-item-title>
                  </v-list-item>

                  <v-list-item @click="todo_item_menu_click(2, 2, index)">
                    <v-icon color="red">mdi-circle-slice-8</v-icon>
                    <v-list-item-title>High Priority</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="todo_item_menu_click(3, 2, index)">
                    <v-icon color="blue">mdi-circle-slice-8</v-icon>
                    <v-list-item-title>Normal Priority</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="todo_item_menu_click(4, 2, index)">
                    <v-icon>mdi-circle-slice-8</v-icon>
                    <v-list-item-title>Low Priority</v-list-item-title>
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
        :timeout="3000"
        color="success"
        bottom
        right
      >
        Task Completed
        <v-btn color="white" text @click="snackbar_taskCompleteSuccess = false"
          >Close</v-btn
        >
      </v-snackbar>

      <v-snackbar
        v-model="snackbar_taskDeleteSuccess"
        :timeout="3000"
        color="success"
        bottom
        right
      >
        Task Deleted
        <v-btn color="white" text @click="snackbar_taskDeleteSuccess = false"
          >Close</v-btn
        >
      </v-snackbar>

      <v-dialog v-model="taskEditDialog.isShow" max-width="500px">
        <!-- <template v-slot:activator="{ on }"> -->
        <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
        <!-- </template> -->
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
          </v-card-title>
          <v-card-title
            style="border-bottom: 1px solid #acacac; display: flex; flex-direction: column;"
          >
            <v-text-field
              style="width: 100%;"
              label="Add subtask..."
              single-line
              v-model="inputSubTask"
              @keydown.enter="
                onSubmit_addSubTask($event.target.value, dialogPos)
              "
            ></v-text-field>
            <v-list dense style="width: 100%; min-height: unset;">
              <v-list-item
                class="subtask-list"
                v-for="(subTask, subTaskIndex) in taskEditDialogSubTasks"
                :key="subTaskIndex"
              >
                <v-list-item-action style="margin: 0 16px 0 0">
                  <v-checkbox
                    v-model="subTask.isDone"
                    @click.native="toggleIsDone(this.dialogPos, subTask.isDone)"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-if="!subTask.isDone">
                    {{ subTask.title }}
                  </v-list-item-title>
                  <v-list-item-title
                    v-else
                    style="color: #B3B4B4!important;
    text-decoration: line-through;"
                    >{{ subTask.title }}</v-list-item-title
                  >
                </v-list-item-content>
                <v-list-item-action style="margin: 0 0 0 16px">
                  <v-btn @click="deleteSubTask(subTaskIndex)" small icon>
                    <v-icon color="grey lighten-1">mdi-close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
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
            <v-btn block color="light-blue darken-1" dark @click="updateTask"
              >Save task and close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- <v-btn
        @click="debug()"
        color="pink"
        x-small
        dark
        absolute
        bottom
        right
        fab
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn> -->
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import {
  months,
  day,
  getIsoDateFromLuxonDateTime,
  isSameDate
} from '@/utils/date'
import { mapState } from 'vuex'
import { DateTime } from 'luxon'

export default {
  components: {
    draggable
  },
  props: {
    // source: String
  },
  data: () => ({
    pos: 0,

    snackbar_taskCompleteSuccess: false,
    snackbar_taskDeleteSuccess: false,

    taskEditDialog: {
      date: null,
      isShow: false,
      title: null,
      notes: '',
      task_index: null,
      list_index: null,
      subTasks: []
    },
    inputSubTask: '',
    dialogPos: null,

    items: [{ title: 'Complete' }, { title: 'Remove' }, { title: 'Label' }]
  }),
  computed: {
    ...mapState(['listPriority']),
    date_1() {
      const today = DateTime.now().startOf('day')
      const day_1 = today.plus({ days: 0 + this.pos })
      return day_1
    },
    date_2() {
      const today = DateTime.now().startOf('day')
      const day_2 = today.plus({ days: 1 + this.pos })
      return day_2
    },
    date_3() {
      const today = DateTime.now().startOf('day')
      const day_3 = today.plus({ days: 2 + this.pos })
      return day_3
    },
    todo_items_1: {
      get() {
        const today = DateTime.now().startOf('day')
        const thisDateTimeObj = today.plus({ days: 0 + this.pos })

        const queriedTaskByDate = this.$store.state.tasksByDate.find(
          taskByDate => {
            const taskDateTimeObj = DateTime.fromISO(taskByDate.date)
            return isSameDate(thisDateTimeObj, taskDateTimeObj)
          }
        )

        if (queriedTaskByDate) {
          if (this.listPriority !== undefined) {
            let priorityFilter
            switch (this.listPriority) {
              case 0:
                priorityFilter = 2
                break
              case 1:
                priorityFilter = 1
                break
              case 2:
                priorityFilter = 0
                break
            }
            let list = queriedTaskByDate.list.filter(
              taskList => taskList.priority == priorityFilter
            )
            return list
          } else return queriedTaskByDate.list
        } else return null
      },
      set(value) {
        const todayDateObj = DateTime.now().startOf('day')
        const thisDateObj = todayDateObj.plus({ days: this.pos })
        this.$store.dispatch('reorderUserTask', {
          date: getIsoDateFromLuxonDateTime(thisDateObj),
          data: value
        })
      }
    },
    todo_items_2: {
      get() {
        const today = DateTime.now().startOf('day')
        const thisDateTimeObj = today.plus({ days: 1 + this.pos })

        const queriedTaskByDate = this.$store.state.tasksByDate.find(
          taskByDate => {
            const taskDateTimeObj = DateTime.fromISO(taskByDate.date)
            return isSameDate(thisDateTimeObj, taskDateTimeObj)
          }
        )

        if (queriedTaskByDate) {
          if (this.listPriority !== undefined) {
            let priorityFilter
            switch (this.listPriority) {
              case 0:
                priorityFilter = 2
                break
              case 1:
                priorityFilter = 1
                break
              case 2:
                priorityFilter = 0
                break
            }
            let list = queriedTaskByDate.list.filter(
              taskList => taskList.priority == priorityFilter
            )
            return list
          } else return queriedTaskByDate.list
        } else return null
      },
      set(value) {
        const todayDateObj = DateTime.now().startOf('day')
        const thisDateObj = todayDateObj.plus({ days: 1 + this.pos })
        this.$store.dispatch('reorderUserTask', {
          date: getIsoDateFromLuxonDateTime(thisDateObj),
          data: value
        })
      }
    },
    todo_items_3: {
      get() {
        const today = DateTime.now().startOf('day')
        const thisDateTimeObj = today.plus({ days: 2 + this.pos })

        const queriedTaskByDate = this.$store.state.tasksByDate.find(
          taskByDate => {
            const taskDateTimeObj = DateTime.fromISO(taskByDate.date)
            return isSameDate(thisDateTimeObj, taskDateTimeObj)
          }
        )

        if (queriedTaskByDate) {
          if (this.listPriority !== undefined) {
            let priorityFilter
            switch (this.listPriority) {
              case 0:
                priorityFilter = 2
                break
              case 1:
                priorityFilter = 1
                break
              case 2:
                priorityFilter = 0
                break
            }
            let list = queriedTaskByDate.list.filter(
              taskList => taskList.priority == priorityFilter
            )
            return list
          } else return queriedTaskByDate.list
        } else return null
      },
      set(value) {
        const todayDateObj = DateTime.now().startOf('day')
        const thisDateObj = todayDateObj.plus({ days: 2 + this.pos })
        this.$store.dispatch('reorderUserTask', {
          date: getIsoDateFromLuxonDateTime(thisDateObj),
          data: value
        })
      }
    },
    isTodayOnScreen() {
      return (
        this.isToday(this.date_1) ||
        this.isToday(this.date_2) ||
        this.isToday(this.date_3)
      )
    },
    taskEditDialogSubTasks() {
      if (
        this.taskEditDialog.task_index !== null &&
        this.taskEditDialog.task_index !== undefined
      ) {
        if (
          this.$store.state.tasks[this.taskEditDialog.task_index].list[
            this.taskEditDialog.list_index
          ].subTasks == undefined
        ) {
          this.$store.commit('initSubTask', {
            date: this.taskEditDialog.date,
            taskIndex: this.taskEditDialog.task_index,
            listIndex: this.taskEditDialog.list_index
          })
        }
        return this.$store.state.tasks[this.taskEditDialog.task_index].list[
          this.taskEditDialog.list_index
        ].subTasks
      } else return []
    }
  },
  methods: {
    // debug() {
    //   this.isSidebarOpen = !this.isSidebarOpen
    //   // console.log(a)
    // },
    isBeforeToday(pos) {
      const todayDateObj = DateTime.now().startOf('day')
      const thisDateObj = todayDateObj.plus({ days: pos + this.pos })

      return todayDateObj > thisDateObj
    },
    movePosPrev() {
      --this.pos

      const thisIsoDate = getIsoDateFromLuxonDateTime(this.date_1)
      if (!this.$store.state.gettedList.includes(thisIsoDate)) {
        this.$store.dispatch('getDayList', thisIsoDate)
      }
    },
    movePosNext() {
      ++this.pos

      const thisIsoDate = getIsoDateFromLuxonDateTime(this.date_3)
      if (!this.$store.state.gettedList.includes(thisIsoDate)) {
        this.$store.dispatch('getDayList', thisIsoDate)
      }
    },
    isToday(date) {
      let todayDateObj = DateTime.now().startOf('day')
      let thisDateObj = DateTime.fromISO(date)
      return isSameDate(todayDateObj, thisDateObj)
    },
    onSubmit_addTask(inputVal, pos) {
      const theDate = DateTime.now().plus({ days: pos + this.pos })

      this.$store.dispatch('addUserTask', {
        title: inputVal,
        isDone: false,
        dateTime: getIsoDateFromLuxonDateTime(theDate)
      })
    },
    onSubmit_addSubTask(inputVal, pos) {
      // Todo: Subtask
      this.inputSubTask = ''
      let today = new Date()
      let theDate = new Date()
      theDate.setDate(today.getDate() + pos + this.pos)

      this.$store.dispatch('addUserSubTask', {
        title: inputVal,
        isDone: false,
        date: this.taskEditDialog.date,
        taskIndex: this.taskEditDialog.task_index,
        listIndex: this.taskEditDialog.list_index
      })
    },
    toggleIsDone(pos, isDone) {
      if (isDone) this.snackbar_taskCompleteSuccess = true
      this.pushDayList(pos)
    },
    pushDayList(pos) {
      const todayDateObj = DateTime.now().startOf('day')
      const theDateObj = todayDateObj.plus({ days: pos + this.pos })

      this.$store.dispatch(
        'pushDayListNew',
        getIsoDateFromLuxonDateTime(theDateObj)
      )
    },
    searchForTaskIndexGivenDate(pos) {
      // Todo
      let todayDateObj = DateTime.now().startOf('day')
      let thisDateObj = todayDateObj.plus({ days: pos + this.pos })

      const getTaskByDateIndex = this.$store.state.tasksByDate.findIndex(
        taskByDate => {
          const taskDate = DateTime.fromISO(taskByDate.date)
          return isSameDate(thisDateObj, taskDate)
        }
      )

      return getTaskByDateIndex
    },
    todo_item_menu_click(menu_index, pos, list_index) {
      // Todo
      let todayDateObj = DateTime.now().startOf('day')
      let thisDateObj = todayDateObj.plus({ days: pos + this.pos })
      let thisDateIso = getIsoDateFromLuxonDateTime(thisDateObj)

      let task_index = this.searchForTaskIndexGivenDate(pos)
      switch (menu_index) {
        // Move to today
        case 0:
          this.$store.dispatch('moveTaskToToday', {
            taskIndex: task_index,
            listIndex: list_index,
            date: thisDateIso
          })
          break
        // Remove
        case 1:
          this.$store.dispatch('removeUserTask', {
            taskIndex: task_index,
            listIndex: list_index,
            date: thisDateIso
          })
          this.snackbar_taskDeleteSuccess = true
          break
        // High Priority
        case 2:
          this.$store.dispatch('updateUserTask', {
            taskIndex: task_index,
            listIndex: list_index,
            date: thisDateIso,
            priority: 2
          })
          break
        // Normal Priority
        case 3:
          this.$store.dispatch('updateUserTask', {
            taskIndex: task_index,
            listIndex: list_index,
            date: thisDateIso,
            priority: 1
          })
          break
        // Low Priority
        case 4:
          this.$store.dispatch('updateUserTask', {
            taskIndex: task_index,
            listIndex: list_index,
            date: thisDateIso,
            priority: 0
          })
          break
      }
    },
    deleteSubTask(subTaskIndex) {
      // Todo: Subtask
      this.$store.dispatch('removeUserSubTask', {
        taskIndex: this.taskEditDialog.task_index,
        listIndex: this.taskEditDialog.list_index,
        subTaskIndex: subTaskIndex,
        date: this.taskEditDialog.date
      })
    },
    todo_item_dblclick(pos, list_index) {
      // Todo
      this.dialogPos = pos
      let today = new Date()
      let theDate = new Date()
      theDate.setDate(today.getDate() + pos + this.pos)

      let task_index = this.searchForTaskIndexGivenDate(pos)
      this.taskEditDialog.title = this.$store.state.tasks[task_index].list[
        list_index
      ].title
      this.taskEditDialog.notes = this.$store.state.tasks[task_index].list[
        list_index
      ].notes
      this.taskEditDialog.date = theDate
      this.taskEditDialog.task_index = task_index
      this.taskEditDialog.list_index = list_index
      this.taskEditDialog.isShow = true
      this.taskEditDialog.priority = this.$store.state.tasks[task_index].list[
        list_index
      ].priority
      this.taskEditDialog.subTasks = this.$store.state.tasks[task_index].list[
        list_index
      ].subTasks
    },
    updateTask() {
      // Todo
      this.taskEditDialog.notes = !this.taskEditDialog.notes
        ? ''
        : this.taskEditDialog.notes
      this.taskEditDialog.isShow = false
      this.$store.dispatch('updateUserTask', {
        date: this.taskEditDialog.date,
        title: this.taskEditDialog.title,
        notes: this.taskEditDialog.notes,
        taskIndex: this.taskEditDialog.task_index,
        listIndex: this.taskEditDialog.list_index,
        priority: this.taskEditDialog.priority
      })
    }
  },
  created() {
    //
  }
}
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
.any-day {
  flex: 0 0 33.3% !important;
  max-width: calc(33.3% - 3px) !important;
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
