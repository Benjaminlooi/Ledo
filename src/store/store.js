import Vue from 'vue'
import Vuex from 'vuex'
import { firestore } from '@/plugins/firebase'
import { getIsoDateFromLuxonDateTime, isSameDate } from '@/utils/date'
import { DateTime } from 'luxon'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    user: null,
    /* 
      date: ISODate,
      list: []
    */
    tasksByDate: [],
    gettedList: [],
    listPriority: undefined
  },
  mutations: {
    setAccessToken(state, payload) {
      state.token = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setDayList(state, payload) {
      state.tasksByDate.push(payload)
    },
    setListPriority(state, value) {
      state.listPriority = value
    },
    initDayTask(state, dateTime) {
      state.tasksByDate.push({
        date: dateTime,
        list: []
      })
    },
    addTask(state, payload) {
      let thisDateTimeObj = DateTime.fromISO(payload.dateTime)

      const getTaskByDateIndex = state.tasksByDate.findIndex(taskByDate => {
        const taskDate = DateTime.fromISO(taskByDate.date)
        return isSameDate(thisDateTimeObj, taskDate)
      })

      if (getTaskByDateIndex >= 0) {
        // If date is Initialized in tasksByDate
        state.tasksByDate[getTaskByDateIndex].list.push({
          isDone: payload.isDone,
          title: payload.title,
          priority: 0
        })
      } else {
        // If date is NOT Initialized in tasksByDate
        state.tasksByDate.push({
          date: thisDateTimeObj.toISODate(),
          list: [
            {
              isDone: payload.isDone,
              title: payload.title,
              priority: 0
            }
          ]
        })
      }
    },
    initSubTask(state, payload) {
      if (!state.tasks[payload.taskIndex].list[payload.listIndex].subTasks) {
        state.tasks[payload.taskIndex].list[payload.listIndex].subTasks = []
      }
    },
    addSubTask(state, payload) {
      if (!state.tasks[payload.taskIndex].list[payload.listIndex].subTasks) {
        state.tasks[payload.taskIndex].list[payload.listIndex].subTasks = []
      }
      state.tasks[payload.taskIndex].list[payload.listIndex].subTasks.push({
        isDone: payload.isDone,
        title: payload.title
      })
    },
    removeSubTask(state, payload) {
      state.tasks[payload.taskIndex].list[payload.listIndex].subTasks.splice(
        payload.subTaskIndex,
        1
      )
    },
    removeTask(state, payload) {
      state.tasks[payload.taskIndex].list.splice(payload.listIndex, 1)
    },
    modifyTasksByDateValue(state, payload) {
      let thisDateObj = DateTime.fromISO(payload.date)

      const getTaskByDateIndex = state.tasksByDate.findIndex(taskByDate => {
        const taskDate = DateTime.fromISO(taskByDate.date)
        return isSameDate(thisDateObj, taskDate)
      })

      if (getTaskByDateIndex >= 0) {
        state.tasksByDate[getTaskByDateIndex].list = payload.data
      }
    },
    updateTask(state, payload) {
      if (payload.title)
        state.tasks[payload.taskIndex].list[payload.listIndex].title =
          payload.title
      if (payload.notes)
        state.tasks[payload.taskIndex].list[payload.listIndex].notes =
          payload.notes
      if (payload.priority || payload.priority === 0)
        state.tasks[payload.taskIndex].list[payload.listIndex].priority =
          payload.priority
    },
    clearTasksArr(state) {
      state.tasks = []
    }
  },
  actions: {
    getDayList({ dispatch, commit, state }, dateTime) {
      let thisIsoDate = dateTime

      state.gettedList.push(thisIsoDate)

      if (state.user) {
        firestore
          .collection(state.user.uid)
          .doc(thisIsoDate)
          .get()
          .then(doc => {
            if (doc.exists) {
              commit('setDayList', doc.data())
            } else {
              commit('initDayTask', thisIsoDate)
              dispatch('pushDayListNew', thisIsoDate)
            }
          })
      }
    },
    addUserTask({ dispatch, commit }, payload) {
      commit('addTask', payload)
      dispatch('pushDayListNew', payload.dateTime)
    },
    addUserSubTask({ dispatch, commit }, payload) {
      commit('addSubTask', payload)
      dispatch('pushDayList', payload)
    },
    removeUserSubTask({ dispatch, commit }, payload) {
      commit('removeSubTask', payload)
      dispatch('pushDayList', payload)
    },
    removeUserTask({ dispatch, commit }, payload) {
      if (payload.listIndex > -1) {
        commit('removeTask', payload)
        dispatch('pushDayList', {
          date: payload.date
        })
      }
    },
    updateUserTask({ dispatch, commit }, payload) {
      commit('updateTask', payload)
      dispatch('pushDayList', payload)
    },
    moveTaskToToday({ state, dispatch }, payload) {
      let today = new Date()
      let i
      state.tasks.forEach((task, index) => {
        let dateParts = task.date.split('-')
        let d2 = new Date(dateParts[2], dateParts[0] - 1, dateParts[1])
        if (
          today.getFullYear() === d2.getFullYear() &&
          today.getMonth() === d2.getMonth() &&
          today.getDate() === d2.getDate()
        ) {
          i = index
        }
      })
      state.tasks[i].list.push(
        state.tasks[payload.taskIndex].list[payload.listIndex]
      )

      state.tasks[payload.taskIndex].list.splice(payload.listIndex, 1)
      dispatch('pushDayList', {
        date: payload.date
      })
      dispatch('pushDayList', {
        date: today
      })
    },
    reorderUserTask({ dispatch, commit }, payload) {
      commit('modifyTasksByDateValue', payload)
      dispatch('pushDayListNew', payload.date)
    },
    pushDayList({ state }, payload) {
      let d1 = new Date(payload.date)
      let date = `${d1.getMonth()}${d1.getDate()}${d1.getFullYear()}`
      let i
      state.tasks.forEach((task, index) => {
        let dateParts = task.date.split('-')
        let d2 = new Date(dateParts[2], dateParts[0] - 1, dateParts[1])
        if (
          d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
        ) {
          i = index
        }
      })
      firestore
        .collection(state.user.uid)
        .doc(date)
        .set(state.tasks[i])
    },
    pushDayListNew({ state }, dateTime) {
      const getTaskByDateOfDate = state.tasksByDate.find(taskByDate => {
        const thisDateTimeObj = DateTime.fromISO(dateTime)
        const taskDate = DateTime.fromISO(taskByDate.date)
        return isSameDate(thisDateTimeObj, taskDate)
      })

      firestore
        .collection(state.user.uid)
        .doc(dateTime)
        .set(getTaskByDateOfDate)
    }
    // makingSureDateIsInFirestore({ commit }, payload) {

    // }
  }
})
