<template>
  <div>
    <v-scroll-y-transition>
      <v-navigation-drawer v-model="drawer" :permanent="true" app>
        <template v-slot:prepend>
          <v-list-item two-line>
            <v-list-item-avatar>
              <img v-if="$store.state.user" :src="$store.state.user.photoURL" />
            </v-list-item-avatar>

            <v-list-item-content v-if="$store.state.user">
              <v-list-item-title>{{$store.state.user.displayName}}</v-list-item-title>
              <v-list-item-subtitle>
                <v-btn
                  @click="navDrawerView = 1"
                  color="#F0595A"
                  x-small
                  outlined
                  style="font-size: 0.7em;"
                >Edit Profile</v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider></v-divider>
        <v-list dense>
          <v-list-item @click="contentView = 0">
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="contentView = 1">
            <v-list-item-action>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Month View</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- <v-list-item @click="debug">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Debug</v-list-item-title>
            </v-list-item-content>
          </v-list-item>-->
        </v-list>

        <v-list dense nav>
          <v-list-item-content>
            <v-list-item-title>
              Filter
              <v-btn
                v-if="listPriority !== undefined"
                text
                x-small
                color="primary"
                right
                absolute
                @click="listPriority = undefined"
              >Clear filter</v-btn>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-group v-model="listPriority">
            <v-list-item @click v-for="(list , i) in priorityList" :key="i">
              <v-list-item-icon>
                <v-icon :color="list.iconColor">mdi-circle-slice-8</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{list.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="#F0595A" dark @click="signOut">
              Logout
              <v-icon right dark>mdi-logout</v-icon>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </v-scroll-y-transition>

    <v-scroll-y-transition>
      <v-navigation-drawer
        v-if="navDrawerView == 1"
        v-model="drawer"
        :permanent="true"
        absolute
        style="z-index: 99;"
      >
        <v-subheader style="font-weight: bold; font-size: 1rem; color: rgba(0, 0, 0, 0.74);">
          Personal information
          <div class="flex-grow-1"></div>
          <v-btn icon @click="navDrawerView = 0">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-subheader>
        <!-- <v-list-item-content>
            <v-btn icon width="62" height="62">
              <v-icon>mdi-camera</v-icon>
            </v-btn>
        </v-list-item-content>-->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size: 13px; color: gray;">Photo</v-list-item-title>
            <v-list-item-title style="font-size: 13px;">
              <v-hover v-slot:default="{ hover }">
                <v-list-item-avatar size="62" style="margin: 0;">
                  <img class="imageEdit" :src="$store.state.user.photoURL" />
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute color="#F0595A">
                      <v-btn icon width="62" height="62">
                        <v-icon>mdi-camera</v-icon>
                      </v-btn>
                    </v-overlay>
                  </v-fade-transition>
                </v-list-item-avatar>
              </v-hover>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size: 13px; color: gray;">Name</v-list-item-title>
            <v-list-item-title v-if="!editingName" style="font-size: 13px;">
              {{$store.state.user.displayName}}
              <v-btn
                x-small
                outlined
                color="#F0595A"
                style="font-size: 12px; margin-left: 5px;"
                @click="editingName = true; inputName = $store.state.user.displayName"
              >Edit</v-btn>
            </v-list-item-title>
            <v-list-item-subtitle v-else style="font-size: 13px;">
              <v-form v-model="formChangeNameHasErrors" :lazy-validation="false">
                <v-text-field
                  type="text"
                  ref="inputNameChange"
                  v-model="inputName"
                  label="Your name"
                  :rules="nameRules"
                  style="padding: 2px;"
                  single-line
                  solo
                ></v-text-field>
                <v-btn
                  x-small
                  outlined
                  color="#F0595A"
                  style="font-size: 12px; margin-left: 5px;"
                  @click="changeName"
                >Save</v-btn>
                <v-btn
                  x-small
                  text
                  color="#F0595A"
                  style="font-size: 12px; margin-left: 5px;"
                  @click="editingName = false; inputName = ''"
                >Cancel</v-btn>
              </v-form>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size: 13px; color: gray;">Email</v-list-item-title>
            <v-list-item-title style="font-size: 13px;">{{$store.state.user.email}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size: 13px; color: gray;">Password</v-list-item-title>
            <v-list-item-title v-if="!editingPassword" style="font-size: 13px;">
              ******
              <v-btn
                v-if="userAccountProvider == 'password'"
                x-small
                outlined
                color="#F0595A"
                style="font-size: 12px; margin-left: 5px;"
                @click="editingPassword = true"
              >Edit</v-btn>
            </v-list-item-title>
            <v-list-item-subtitle v-else style="font-size: 13px;">
              <v-form v-model="formChangePasswordHasErrors" :lazy-validation="false">
                <v-text-field
                  ref="inputPasswordChange"
                  v-model="inputPassword"
                  label="New Password"
                  :rules="passwordRules"
                  style="padding: 2px;"
                  single-line
                  solo
                  :type="inputPasswordChangeShow ? 'text' : 'password'"
                  :append-icon="inputPasswordChangeShow ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="inputPasswordChangeShow = !inputPasswordChangeShow"
                ></v-text-field>
                <v-text-field
                  ref="inputPasswordChangeConfirmation"
                  v-model="inputPasswordConfirmation"
                  label="Retype new Password"
                  :rules="passwordConfirmationRules"
                  style="padding: 2px;"
                  single-line
                  solo
                  :type="inputPasswordChangeConfirmationShow ? 'text' : 'password'"
                  :append-icon="inputPasswordChangeConfirmationShow ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="inputPasswordChangeConfirmationShow = !inputPasswordChangeConfirmationShow"
                ></v-text-field>
                <v-btn
                  x-small
                  outlined
                  color="#F0595A"
                  style="font-size: 12px; margin-left: 5px;"
                  @click="changePassword"
                >Save</v-btn>
                <v-btn
                  x-small
                  text
                  color="#F0595A"
                  style="font-size: 12px; margin-left: 5px;"
                  @click="editingPassword = false; inputPassword = '';inputPasswordConfirmation = ''"
                >Cancel</v-btn>
              </v-form>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="userAccountProvider == 'google.com'">
          <v-list-item-content>
            <v-list-item-subtitle>Your account is linked with Google</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-navigation-drawer>
    </v-scroll-y-transition>

    <v-scroll-x-transition leave-absolute>
      <v-content v-if="contentView == 0">
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

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              v-if="pos > 1 || pos < -1"
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
            :class="{'next-day': !isToday(date_1), 'current-day': isToday(date_1), 'any-day': !isTodayOnScreen}"
          >
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
            <draggable
              v-model="todo_items_1"
              style="display: flex;"
              group="task"
              @start="drag=true"
              @end="drag=false"
            >
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
                      :class="{'priority-zero': todo_item.priority == 0, 'priority-one': todo_item.priority == 1, 'priority-two': todo_item.priority == 2}"
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
                      <v-list-item v-if="isBeforeToday(0)" @click="todo_item_menu_click(0,0,index)">
                        <v-list-item-title>Move to today</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(1,0,index)">
                        <v-list-item-title>Remove</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="todo_item_menu_click(2,0,index)">
                        <v-icon color="red">mdi-circle-slice-8</v-icon>
                        <v-list-item-title>High Priority</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(3,0,index)">
                        <v-icon color="blue">mdi-circle-slice-8</v-icon>
                        <v-list-item-title>Normal Priority</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(4,0,index)">
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
            :class="{'next-day': !isToday(date_2), 'current-day': isToday(date_2), 'any-day': !isTodayOnScreen}"
          >
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
            <draggable
              v-model="todo_items_2"
              style="display: flex;"
              group="task"
              @start="drag=true"
              @end="drag=false"
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
                      :class="{'priority-zero': todo_item.priority == 0, 'priority-one': todo_item.priority == 1, 'priority-two': todo_item.priority == 2}"
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
                      <v-list-item v-if="isBeforeToday(0)" @click="todo_item_menu_click(0,1,index)">
                        <v-list-item-title>Move to today</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(1,1,index)">
                        <v-list-item-title>Remove</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="todo_item_menu_click(2,1,index)">
                        <v-icon color="red">mdi-circle-slice-8</v-icon>
                        <v-list-item-title>High Priority</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(3,1,index)">
                        <v-icon color="blue">mdi-circle-slice-8</v-icon>
                        <v-list-item-title>Normal Priority</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(4,1,index)">
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
            :class="{'next-day': !isToday(date_3), 'current-day': isToday(date_3), 'any-day': !isTodayOnScreen}"
          >
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
            <draggable
              v-model="todo_items_3"
              style="display: flex;"
              group="task"
              @start="drag=true"
              @end="drag=false"
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
                      :class="{'priority-zero': todo_item.priority == 0, 'priority-one': todo_item.priority == 1, 'priority-two': todo_item.priority == 2}"
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
                      <v-list-item v-if="isBeforeToday(0)" @click="todo_item_menu_click(0,2,index)">
                        <v-list-item-title>Move to today</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(1,2,index)">
                        <v-list-item-title>Remove</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="todo_item_menu_click(2,2,index)">
                        <v-icon color="red">mdi-circle-slice-8</v-icon>
                        <v-list-item-title>High Priority</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(3,2,index)">
                        <v-icon color="blue">mdi-circle-slice-8</v-icon>
                        <v-list-item-title>Normal Priority</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="todo_item_menu_click(4,2,index)">
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
            <v-btn color="white" text @click="snackbar_taskCompleteSuccess = false">Close</v-btn>
          </v-snackbar>

          <v-snackbar
            v-model="snackbar_taskDeleteSuccess"
            :timeout="3000"
            color="success"
            bottom
            right
          >
            Task Deleted
            <v-btn color="white" text @click="snackbar_taskDeleteSuccess = false">Close</v-btn>
          </v-snackbar>

          <v-dialog v-model="taskEditDialog.isShow" max-width="500px">
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
              </v-card-title>
              <v-card-title
                style="border-bottom: 1px solid #acacac; display: flex; flex-direction: column;"
              >
                <v-text-field
                  style="width: 100%;"
                  label="Add subtask..."
                  single-line
                  v-model="inputSubTask"
                  @keydown.enter="onSubmit_addSubTask($event.target.value, dialogPos)"
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
                      <v-list-item-title v-if="!subTask.isDone">{{subTask.title}}</v-list-item-title>
                      <v-list-item-title
                        v-else
                        style="color: #B3B4B4!important;
    text-decoration: line-through;"
                      >{{subTask.title}}</v-list-item-title>
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
                <v-btn
                  block
                  color="light-blue darken-1"
                  dark
                  @click="updateTask"
                >Save task and close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-content>
    </v-scroll-x-transition>

    <v-scroll-x-transition leave-absolute>
      <v-content v-if="contentView == 1">
        <v-sheet height="100vh">
          <v-calendar
            style="padding-left: 2.5px;"
            @click:date="calendarDateOnClick"
            event-color="#F0595A"
            type="month"
            :now="calendarNow"
            :value="calendarNow"
            :events="events"
          ></v-calendar>
        </v-sheet>
      </v-content>
    </v-scroll-x-transition>

    <!-- <v-footer color="indigo" app>
        <span class="white--text">&copy; 2019</span>
    </v-footer>-->
  </div>
</template>

<script>
import { firebase } from "@/plugins/firebase";
import draggable from "vuedraggable";
import { months, day, getDaysInMonth, formatDate } from "@/utils/date";

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

    navDrawerView: 0,
    editingName: false,
    inputName: "",
    nameRules: [v => !!v || "Name is required"],
    formChangeNameHasErrors: true,
    editingPassword: false,
    inputPassword: "",
    inputPasswordConfirmation: "",
    inputPasswordChangeShow: false,
    inputPasswordChangeConfirmationShow: false,
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length >= 6) || "Password must be at least 6 characters"
    ],
    passwordConfirmationRules: [
      v => !!v || "Password Confirmation is required"
    ],
    formChangePasswordHasErrors: true,

    snackbar_taskCompleteSuccess: false,
    snackbar_taskDeleteSuccess: false,
    contentView: 0,
    taskEditDialog: {
      date: null,
      isShow: false,
      title: null,
      notes: "",
      task_index: null,
      list_index: null,
      subTasks: []
    },
    inputSubTask: "",
    dialogPos: null,

    listPriority: undefined,
    priorityList: [
      { iconColor: "#F0595A", title: "High priority" },
      { iconColor: "blue", title: "Normal priority" },
      { iconColor: "", title: "Low priority" }
    ],

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
        if (tasks.length) {
          if (this.listPriority !== undefined) {
            let priorityFilter;
            switch (this.listPriority) {
              case 0:
                priorityFilter = 2;
                break;
              case 1:
                priorityFilter = 1;
                break;
              case 2:
                priorityFilter = 0;
                break;
            }
            let list = tasks[0].list.filter(
              taskList => taskList.priority == priorityFilter
            );
            return list;
          } else return tasks[0].list;
        } else return null;
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
        if (tasks.length) {
          if (this.listPriority !== undefined) {
            let priorityFilter;
            switch (this.listPriority) {
              case 0:
                priorityFilter = 2;
                break;
              case 1:
                priorityFilter = 1;
                break;
              case 2:
                priorityFilter = 0;
                break;
            }
            let list = tasks[0].list.filter(
              taskList => taskList.priority == priorityFilter
            );
            return list;
          } else return tasks[0].list;
        } else return null;
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
        if (tasks.length) {
          if (this.listPriority !== undefined) {
            let priorityFilter;
            switch (this.listPriority) {
              case 0:
                priorityFilter = 2;
                break;
              case 1:
                priorityFilter = 1;
                break;
              case 2:
                priorityFilter = 0;
                break;
            }
            let list = tasks[0].list.filter(
              taskList => taskList.priority == priorityFilter
            );
            return list;
          } else return tasks[0].list;
        } else return null;
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
    },
    isTodayOnScreen() {
      if (
        this.isToday(this.date_1) ||
        this.isToday(this.date_2) ||
        this.isToday(this.date_3)
      ) {
        return true;
      } else return false;
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
          this.$store.commit("initSubTask", {
            date: this.taskEditDialog.date,
            taskIndex: this.taskEditDialog.task_index,
            listIndex: this.taskEditDialog.list_index
          });
        }
        return this.$store.state.tasks[this.taskEditDialog.task_index].list[
          this.taskEditDialog.list_index
        ].subTasks;
      } else return [];
    },
    calendarNow() {
      let d = new Date();
      return formatDate(d);
    },
    events() {
      let events = [];
      this.$store.state.tasks.forEach((task, index) => {
        let d = new Date(task.date);
        let date = formatDate(d);
        if (task.list !== undefined || task.list !== 0) {
          task.list.forEach((list, index) => {
            events.push({
              name: list.title,
              start: date
            });
          });
        }
      });
      return events;
    },
    nameChangeForm() {
      return {
        inputNameChange: this.inputName
      };
    },
    passwordChangeForm() {
      return {
        inputPasswordChange: this.inputPassword,
        inputPasswordChangeConfirmation: this.inputPasswordConfirmation
      };
    },
    userAccountProvider() {
      return this.$store.state.user.providerData[0].providerId;
    }
  },
  watch: {
    contentView: function(val) {
      if (val === 1) {
        this.getRemainingTasksForMonth();
      }
    }
  },
  methods: {
    debug(a) {
      //
      // console.log(a)
    },
    isBeforeToday(pos) {
      let today = new Date();
      let theDate = new Date();
      theDate.setDate(today.getDate() + pos + this.pos);
      today.setHours(12, 0, 0, 0);
      theDate.setHours(12, 0, 0, 0);
      if (today.getTime() > theDate.getTime()) {
        return true;
      } else return false;
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
      this.inputSubTask = "";
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
    toggleIsDone(pos, isDone) {
      if (isDone) this.snackbar_taskCompleteSuccess = true;
      this.pushDayList(pos);
    },
    pushDayList(pos) {
      let today = new Date();
      let theDate = new Date();
      theDate.setDate(today.getDate() + pos + this.pos);

      this.$store.dispatch("pushDayList", {
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
      let today = new Date();
      let d1 = new Date();
      d1.setDate(today.getDate() + pos + this.pos);

      let task_index = this.searchForTaskIndexGivenDate(pos);
      switch (menu_index) {
        case 0:
          this.$store.dispatch("moveTaskToToday", {
            taskIndex: task_index,
            listIndex: list_index,
            date: d1
          });
          break;
        case 1:
          this.$store.dispatch("removeUserTask", {
            taskIndex: task_index,
            listIndex: list_index,
            date: d1
          });
          this.snackbar_taskDeleteSuccess = true;
          break;
        case 2:
          this.$store.dispatch("updateUserTask", {
            taskIndex: task_index,
            listIndex: list_index,
            date: d1,
            priority: 2
          });
          break;
        case 3:
          this.$store.dispatch("updateUserTask", {
            taskIndex: task_index,
            listIndex: list_index,
            date: d1,
            priority: 1
          });
          break;
        case 4:
          this.$store.dispatch("updateUserTask", {
            taskIndex: task_index,
            listIndex: list_index,
            date: d1,
            priority: 0
          });
          break;
      }
    },
    deleteSubTask(subTaskIndex) {
      this.$store.dispatch("removeUserSubTask", {
        taskIndex: this.taskEditDialog.task_index,
        listIndex: this.taskEditDialog.list_index,
        subTaskIndex: subTaskIndex,
        date: this.taskEditDialog.date,
      });
    },
    todo_item_dblclick(pos, list_index) {
      this.dialogPos = pos;
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
      this.taskEditDialog.priority = this.$store.state.tasks[task_index].list[
        list_index
      ].priority;
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
        listIndex: this.taskEditDialog.list_index,
        priority: this.taskEditDialog.priority
      });
    },
    getRemainingTasksForMonth() {
      let today = new Date();
      let currentMonth = today.getMonth();
      let currentYear = today.getFullYear();
      let daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
      // console.log(daysInCurrentMonth)
      daysInCurrentMonth.forEach(days => {
        let d1 = new Date(days);
        let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`;
        if (!this.$store.state.gettedList.includes(date)) {
          this.$store.dispatch("getDayList", { date: d1 });
        }
      });
    },
    calendarDateOnClick(payload) {
      let d = new Date(payload.date);
      let today = new Date();
      d.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = d - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.pos = diffDays;
      this.contentView = 0;
    },
    changeName() {
      this.formChangeNameHasErrors = false;

      Object.keys(this.nameChangeForm).forEach(f => {
        if (!this.nameChangeForm[f]) this.formChangeNameHasErrors = true;

        this.$refs[f].validate(true);
      });

      if (!this.formChangeNameHasErrors) {
        var user = firebase.auth().currentUser;
        this.editingName = false;
        user
          .updateProfile({
            displayName: this.inputName
          })
          .then(_ => {
            this.inputName = "";
            var user = firebase.auth().currentUser;
            this.$store.commit("setUser", user);
            // this.$store.commit("setUser", user);
          })
          .catch(function(error) {
            // An error happened.
          });
      }
    },
    changePassword() {
      this.formChangePasswordHasErrors = false;

      Object.keys(this.passwordChangeForm).forEach(f => {
        if (!this.passwordChangeForm[f])
          this.formChangePasswordHasErrors = true;

        this.$refs[f].validate(true);
      });

      if (!this.formChangePasswordHasErrors) {
        if (this.inputPassword == this.inputPasswordConfirmation) {
          var user = firebase.auth().currentUser;
          let newPassword = this.inputPasswordConfirmation;
          this.editingPassword = false;
          user
            .updatePassword(newPassword)
            .then(_ => {
              this.inputPassword = "";
              this.inputPasswordConfirmation = "";
              var user = firebase.auth().currentUser;
              this.$store.commit("setUser", user);
            })
            .catch(function(error) {
              // An error happened.
              console.log(error);
            });
        }
      }
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          this.$store.commit("clearTasksArr");
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
.imageEdit:hover {
  cursor: pointer;
  background: white;
}
</style>
