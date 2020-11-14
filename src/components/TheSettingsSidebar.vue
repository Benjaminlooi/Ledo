<template>
  <v-scroll-y-transition>
    <v-navigation-drawer
      :value="open"
      v-if="user"
      absolute
      style="z-index: 99;"
    >
      <v-subheader
        style="font-weight: bold; font-size: 1rem; color: rgba(0, 0, 0, 0.74);"
      >
        Personal information
        <div class="flex-grow-1"></div>
        <v-btn icon @click="handleSettingsSidebarClose()">
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
          <v-list-item-title style="font-size: 13px; color: gray;"
            >Photo</v-list-item-title
          >
          <v-list-item-title style="font-size: 13px;">
            <v-hover v-slot:default="{ hover }">
              <v-list-item-avatar size="62" style="margin: 0;">
                <img class="imageEdit" :src="user.photoURL" />
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
          <v-list-item-title style="font-size: 13px; color: gray;"
            >Name</v-list-item-title
          >
          <v-list-item-title v-if="!editingName" style="font-size: 13px;">
            {{ user.displayName }}
            <v-btn
              x-small
              outlined
              color="#F0595A"
              style="font-size: 12px; margin-left: 5px;"
              @click="handleEditUsernameClick"
              >Edit</v-btn
            >
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
                @click="handleChangeNameClick"
                >Save</v-btn
              >
              <v-btn
                x-small
                text
                color="#F0595A"
                style="font-size: 12px; margin-left: 5px;"
                @click="
                  editingName = false
                  inputName = ''
                "
                >Cancel</v-btn
              >
            </v-form>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title style="font-size: 13px; color: gray;"
            >Email</v-list-item-title
          >
          <v-list-item-title style="font-size: 13px;">
            {{ user.email }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title style="font-size: 13px; color: gray;"
            >Password</v-list-item-title
          >
          <v-list-item-title v-if="!editingPassword" style="font-size: 13px;">
            ******
            <v-btn
              v-if="userAccountProvider == 'password'"
              x-small
              outlined
              color="#F0595A"
              style="font-size: 12px; margin-left: 5px;"
              @click="editingPassword = true"
              >Edit</v-btn
            >
          </v-list-item-title>
          <v-list-item-subtitle v-else style="font-size: 13px;">
            <v-form
              v-model="formChangePasswordHasErrors"
              :lazy-validation="false"
            >
              <v-text-field
                ref="inputPasswordChange"
                v-model="inputPassword"
                label="New Password"
                :rules="passwordRules"
                style="padding: 2px;"
                single-line
                solo
                :type="inputPasswordChangeShow ? 'text' : 'password'"
                :append-icon="
                  inputPasswordChangeShow ? 'mdi-eye' : 'mdi-eye-off'
                "
                @click:append="
                  inputPasswordChangeShow = !inputPasswordChangeShow
                "
              ></v-text-field>
              <v-text-field
                ref="inputPasswordChangeConfirmation"
                v-model="inputPasswordConfirmation"
                label="Retype new Password"
                :rules="passwordConfirmationRules"
                style="padding: 2px;"
                single-line
                solo
                :type="
                  inputPasswordChangeConfirmationShow ? 'text' : 'password'
                "
                :append-icon="
                  inputPasswordChangeConfirmationShow
                    ? 'mdi-eye'
                    : 'mdi-eye-off'
                "
                @click:append="
                  inputPasswordChangeConfirmationShow = !inputPasswordChangeConfirmationShow
                "
              ></v-text-field>
              <v-btn
                x-small
                outlined
                color="#F0595A"
                style="font-size: 12px; margin-left: 5px;"
                @click="handleChangePasswordClick"
                >Save</v-btn
              >
              <v-btn
                x-small
                text
                color="#F0595A"
                style="font-size: 12px; margin-left: 5px;"
                @click="handleCancelChangePasswordClick"
                >Cancel</v-btn
              >
            </v-form>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="userAccountProvider == 'google.com'">
        <v-list-item-content>
          <v-list-item-subtitle
            >Your account is linked with Google</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
  </v-scroll-y-transition>
</template>

<script>
import { auth } from '@/plugins/firebase'
import { mapState } from 'vuex'
export default {
  props: {
    open: Boolean,
    handleSettingsSidebarClose: Function
  },
  data: () => ({
    editingName: false,
    inputName: '',
    nameRules: [v => !!v || 'Name is required'],
    formChangeNameHasErrors: true,
    editingPassword: false,
    inputPassword: '',
    inputPasswordConfirmation: '',
    inputPasswordChangeShow: false,
    inputPasswordChangeConfirmationShow: false,
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Password must be at least 6 characters'
    ],
    passwordConfirmationRules: [
      v => !!v || 'Password Confirmation is required'
    ],
    formChangePasswordHasErrors: true
  }),
  computed: {
    ...mapState(['user']),
    passwordChangeForm() {
      return {
        inputPasswordChange: this.inputPassword,
        inputPasswordChangeConfirmation: this.inputPasswordConfirmation
      }
    },
    userAccountProvider() {
      return this.user.providerData[0].providerId
    },
    nameChangeForm() {
      return {
        inputNameChange: this.inputName
      }
    }
  },
  methods: {
    handleEditUsernameClick() {
      this.editingName = true
      this.inputName = this.user.displayName
    },
    handleChangePasswordClick() {
      this.formChangePasswordHasErrors = false

      Object.keys(this.passwordChangeForm).forEach(f => {
        if (!this.passwordChangeForm[f]) this.formChangePasswordHasErrors = true

        this.$refs[f].validate(true)
      })

      if (!this.formChangePasswordHasErrors) {
        if (this.inputPassword == this.inputPasswordConfirmation) {
          var user = auth.currentUser
          let newPassword = this.inputPasswordConfirmation
          this.editingPassword = false
          user
            .updatePassword(newPassword)
            .then(() => {
              this.inputPassword = ''
              this.inputPasswordConfirmation = ''
              var user = auth.currentUser
              this.$store.commit('setUser', user)
            })
            .catch(function(error) {
              // An error happened.
              console.log(error)
            })
        }
      }
    },
    handleCancelChangePasswordClick() {
      this.editingPassword = false
      this.inputPassword = ''
      this.inputPasswordConfirmation = ''
    },
    handleChangeNameClick() {
      this.formChangeNameHasErrors = false

      Object.keys(this.nameChangeForm).forEach(f => {
        if (!this.nameChangeForm[f]) this.formChangeNameHasErrors = true

        this.$refs[f].validate(true)
      })

      if (!this.formChangeNameHasErrors) {
        var user = auth.currentUser
        this.editingName = false
        user
          .updateProfile({
            displayName: this.inputName
          })
          .then(() => {
            this.inputName = ''
            var user = auth.currentUser
            this.$store.commit('setUser', user)
            // this.$store.commit("setUser", user);
          })
          .catch(function(error) {
            // An error happened.
            console.log(error)
          })
      }
    }
  }
}
</script>

<style scoped>
.imageEdit:hover {
  cursor: pointer;
  background: white;
}
</style>
