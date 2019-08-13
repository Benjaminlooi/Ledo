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
  },
  mutations: {
    setAccessToken(state, payload) {
      state.token = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setTasks(state, payload) {
      state.tasks.push({
        id: payload.id,
        isDone: payload.isDone,
        title: payload.title
      })
    },
    clearTasksArr(state) {
      state.tasks = []
    }
  },
  actions: {
    getUserTasks({ commit, state }) {
      //clear current tasks array
      commit('clearTasksArr');


      if (state.user.uid) {
        firestore.collection(state.user.uid).get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            // console.log(doc.id, " => ", doc.data());
            commit('setTasks', {
              id: doc.id,
              title: doc.data().title,
              isDone: doc.data().isDone
            })
          })
        })
      }
    },
    addUserTask({ dispatch, commit, state }, payload) {
      firestore.collection(state.user.uid).add({
        title: payload,
        isDone: false
      }).then(docRef => {
        // console.log("Document written with ID: ", docRef.id);
        dispatch('getUserTasks');
      }).catch(function (error) {
        console.error("Error adding document: ", error);
      });
    }
  }
})
