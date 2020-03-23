import Vue from "vue";
import Vuex from "vuex";
import { firestore } from "@/plugins/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    user: null,
    tasks: [],
    gettedList: []
  },
  mutations: {
    setAccessToken(state, payload) {
      state.token = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setDayList(state, payload) {
      state.tasks.push(payload);
    },
    initDayTask(state, payload) {
      let d1 = new Date(payload.date);
      let date = `${d1.getMonth() + 1}-${d1.getDate()}-${d1.getFullYear()}`;
      state.tasks.push({
        date: date,
        list: []
      });
    },
    addTask(state, payload) {
      let d1 = new Date(payload.date);
      let isWrote = false;
      state.tasks.forEach((task, index) => {
        if (task) {
          let dateParts = task.date.split("-");
          let d2 = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
          if (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
          ) {
            state.tasks[index].list.push({
              isDone: payload.isDone,
              title: payload.title,
              priority: 0
            });
            isWrote = true;
          }
        }
      });
      if (!isWrote) {
        let date = `${d1.getMonth() + 1}-${d1.getDate()}-${d1.getFullYear()}`;
        state.tasks.push({
          date: date,
          list: [
            {
              isDone: payload.isDone,
              title: payload.title,
              priority: 0
            }
          ]
        });
      }
    },
    initSubTask(state, payload) {
      if (!state.tasks[payload.taskIndex].list[payload.listIndex].subTasks) {
        state.tasks[payload.taskIndex].list[payload.listIndex].subTasks = [];
      }
    },
    addSubTask(state, payload) {
      if (!state.tasks[payload.taskIndex].list[payload.listIndex].subTasks) {
        state.tasks[payload.taskIndex].list[payload.listIndex].subTasks = [];
      }
      state.tasks[payload.taskIndex].list[payload.listIndex].subTasks.push({
        isDone: payload.isDone,
        title: payload.title
      });
    },
    removeSubTask(state, payload) {
      state.tasks[payload.taskIndex].list[payload.listIndex].subTasks.splice(
        payload.subTaskIndex,
        1
      );
    },
    removeTask(state, payload) {
      state.tasks[payload.taskIndex].list.splice(payload.listIndex, 1);
    },
    updateTaskOrder(state, payload) {
      let d1 = new Date(payload.date);
      let i;
      state.tasks.forEach((task, index) => {
        let dateParts = task.date.split("-");
        let d2 = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
        if (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        ) {
          i = index;
        }
      });
      state.tasks[i].list = payload.data;
    },
    updateTask(state, payload) {
      if (payload.title)
        state.tasks[payload.taskIndex].list[payload.listIndex].title =
          payload.title;
      if (payload.notes)
        state.tasks[payload.taskIndex].list[payload.listIndex].notes =
          payload.notes;
      if (payload.priority || payload.priority === 0)
        state.tasks[payload.taskIndex].list[payload.listIndex].priority =
          payload.priority;
    },
    clearTasksArr(state) {
      state.tasks = [];
    }
  },
  actions: {
    async getDayList({ dispatch, commit, state }, payload) {
      let d1 = new Date(payload.date);
      let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`;
      state.gettedList.push(date);

      if (state.user) {
        await firestore
          .collection(state.user.uid)
          .doc(date)
          .get()
          .then(doc => {
            if (doc.exists) {
              commit("setDayList", doc.data());
            } else {
              commit("initDayTask", {
                date: d1
              });
              dispatch("pushDayList", payload);
            }
          });
      }
    },
    addUserTask({ dispatch, commit }, payload) {
      commit("addTask", payload);
      dispatch("pushDayList", payload);
    },
    addUserSubTask({ dispatch, commit }, payload) {
      commit("addSubTask", payload);
      dispatch("pushDayList", payload);
    },
    removeUserSubTask({ dispatch, commit }, payload) {
      commit("removeSubTask", payload);
      dispatch("pushDayList", payload);
    },
    removeUserTask({ dispatch, commit }, payload) {
      if (payload.listIndex > -1) {
        commit("removeTask", payload);
        dispatch("pushDayList", {
          date: payload.date
        });
      }
    },
    updateUserTask({ dispatch, commit }, payload) {
      commit("updateTask", payload);
      dispatch("pushDayList", payload);
    },
    moveTaskToToday({ state, dispatch }, payload) {
      let today = new Date();
      let i;
      state.tasks.forEach((task, index) => {
        let dateParts = task.date.split("-");
        let d2 = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
        if (
          today.getFullYear() === d2.getFullYear() &&
          today.getMonth() === d2.getMonth() &&
          today.getDate() === d2.getDate()
        ) {
          i = index;
        }
      });
      state.tasks[i].list.push(
        state.tasks[payload.taskIndex].list[payload.listIndex]
      );

      state.tasks[payload.taskIndex].list.splice(payload.listIndex, 1);
      dispatch("pushDayList", {
        date: payload.date
      });
      dispatch("pushDayList", {
        date: today
      });
    },
    reorderUserTask({ dispatch, commit }, payload) {
      commit("updateTaskOrder", payload);
      dispatch("pushDayList", payload);
    },
    pushDayList({ state }, payload) {
      let d1 = new Date(payload.date);
      let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`;
      let i;
      state.tasks.forEach((task, index) => {
        let dateParts = task.date.split("-");
        let d2 = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
        if (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        ) {
          i = index;
        }
      });
      firestore
        .collection(state.user.uid)
        .doc(date)
        .set(state.tasks[i]);
    }
    // makingSureDateIsInFirestore({ commit }, payload) {

    // }
  }
});
