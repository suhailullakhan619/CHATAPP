import { createStore } from "vuex"
import { generateClient } from "aws-amplify/api"
import { getCurrentUser } from "@/graphql/queries"
import persistedstate from 'vuex-persistedstate'
export default createStore({
  state: {
    currentUser: null
  },

  getters: {
    currentUser: (state) => state.currentUser
  },

  mutations: {
    SET_USER(state, user) {
      state.currentUser = user
    },
     SET_USER_AVATAR(state, avatarKey) {

    if(state.currentUser){
      state.currentUser.avatar = avatarKey
    }

  },
     CLEAR_USER(state){
    state.currentUser = null
  }
  },

  actions: {
    async fetchCurrentUser({ commit, state }) {

      // Prevent calling API again if user already exists
      if (state.currentUser) return

      const client = generateClient()

      const result = await client.graphql({
        query: getCurrentUser
      })

      const parsed = JSON.parse(result.data.getCurrentUser)

      commit("SET_USER", parsed.data)
    }
  },
  plugins:[persistedstate( )]
})