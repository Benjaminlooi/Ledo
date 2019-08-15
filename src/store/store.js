import Vue from 'vue'
import Vuex from 'vuex'
import { firestore } from '@/plugins/firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    user: null,
    // isLoggedIn: false,
    // user: null
    tasks: []
    // tasks: [
    //   {
    //     date: "08-14-2019",
    //     list: [{
    //       title: 'kill rabbits',
    //       isDone: false
    //     },
    //     {
    //       title: 'kill dogs',
    //       isDone: false
    //     }]
    //   },
    //   {
    //     date: "08-15-2019",
    //     list: [{
    //       title: 'next day',
    //       isDone: false
    //     },
    //     {
    //       title: 'is next day',
    //       isDone: false
    //     }]
    //   }
    // ]
  },
  mutations: {
    setAccessToken(state, payload) {
      state.token = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setDayList(state, payload) {
      state.tasks.push(payload)
    },
    addTask(state, payload) {
      let d1 = new Date(payload.date);
      let isWrote = false;
      state.tasks.forEach((task, index) => {
        if (task) {
          let d2 = new Date(task.date);
          if (d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()) {

            state.tasks[index].list.push({
              isDone: payload.isDone,
              title: payload.title
            })
            isWrote = true;
          }
        }
      })
      if (!isWrote) {
        let date = `${d1.getMonth() + 1}-${d1.getDate()}-${d1.getFullYear()}`
        state.tasks.push({
          date: date,
          list: [{
            isDone: payload.isDone,
            title: payload.title
          }]
        })
      }
    },
    removeTask(state, payload) {
      state.tasks[payload.taskIndex].list.splice(payload.listIndex, 1);
    },
    updateTask(state, payload){
      state.tasks[payload.taskIndex].list[payload.listIndex].title = payload.title;
      state.tasks[payload.taskIndex].list[payload.listIndex].notes = payload.notes;
    },
    clearTasksArr(state) {
      state.tasks = []
    }
  },
  actions: {
    getDayList({ commit, state }, payload) {
      //clear current tasks array
      // commit('clearTasksArr');
      let d1 = new Date(payload.date);
      let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`;
      // console.log(date)

      if (state.user) {
        firestore.collection(state.user.uid).doc(date).get().then(doc => {
          if (doc.exists) {
            commit('setDayList', doc.data());
          }
        })
      }
    },
    addUserTask({ dispatch, commit, state }, payload) {
      commit('addTask', payload);

      dispatch('updateDayList', payload)
    },
    removeUserTask({ dispatch, commit, state }, payload) {
      if (payload.listIndex > -1) {
        commit('removeTask', payload)
        dispatch('updateDayList', {
          date: payload.date
        })
      }
    },
    updateUserTask({ dispatch, commit, state }, payload){
      commit('updateTask', payload);
      dispatch('updateDayList', payload);
    },
    updateDayList({ commit, state }, payload) {
      let d1 = new Date(payload.date);
      let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`;
      let i;
      state.tasks.forEach((task, index) => {
        let d2 = new Date(task.date);
        if (d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()) {

          i = index;
        }
      })
      console.log(payload)
      firestore.collection(state.user.uid).doc(date).set(
        state.tasks[i])
    }
  }
})
