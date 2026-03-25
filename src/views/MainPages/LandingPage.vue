<template>
  <Overly v-model="overlayValue" />
  <LogoutDialog v-model:logoutDialogEmit="logoutDialogEmit" />
  <v-navigation-drawer permanent rail>
    <div class="d-flex flex-column fill-height">
      <v-list>
        <v-list-item class="profileimg pa-0 d-flex align-center justify-center">
          <template #default>
           <v-avatar
  size="30"
  class="cursor-pointer"
  color="green"
  @click="updateUserDialogEmit = true"
>

  <!-- If user has uploaded avatar -->
  <v-img v-if="profileImageUrl" eager :src="profileImageUrl" />

  <!-- If user has no avatar -->
  <span v-else class="text-h6">
    {{ currentUserArray.username?.charAt(0).toUpperCase() }}
  </span>

</v-avatar>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-for="value in RouterList" density="compact" nav>
        <v-tooltip right>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="value.icon"
              :value="value.title"
              :to="value.route"
            ></v-list-item>
          </template>
          {{ value.title }}
        </v-tooltip>
      </v-list>

      <v-spacer></v-spacer>
      <v-divider></v-divider>
      <v-list>
         <v-tooltip right>
          <template #activator="{ props }">
        <v-list-item
              v-bind="props"
              @click="updateUserDialogEmit=true"
              class="cursor-pointer"
            >
              <template #prepend>
                <v-icon >mdi-account-circle</v-icon>
              </template>
            </v-list-item>
             </template>
          Profile
        </v-tooltip>
        <v-tooltip right>
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              @click="OpenLogoutDialog"
              class="cursor-pointer"
            >
              <template #prepend>
                <v-icon color="error">mdi-logout</v-icon>
              </template>
            </v-list-item>
          </template>
          Logout
        </v-tooltip>
      
      </v-list>
    </div>
  </v-navigation-drawer>
  <v-main>
    <router-view />
  </v-main>
  <UpdateUserDialog
  v-model:updateUserDialogEmit="updateUserDialogEmit"
  :username="currentUserArray.username"
  :profileImage="profileImageUrl"
  @update-user="updateUserMethod"
/>
</template>

<script>
import Overly from "@/components/Extras/Overly.vue";
import LogoutDialog from "@/components/LogoutComponent/LogoutDialog.vue";
import RouterList from "@/Json/RouterList.json";
import { uploadImages } from "@/mixins/UploadImagesTOS3/UploadImagestoS3";
import UpdateUserDialog from "@/components/ChatsPageComponent/Dialog/UpdateUserDialog.vue";
import { updateUser } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";
const client=generateClient();
export default {
  components: {
    Overly,
    LogoutDialog,
    UpdateUserDialog
  },
  data() {
    return {
      overlayValue: false,
      logoutDialogEmit: false,
      RouterList,
      profileImageUrl: null,
      updateUserDialogEmit: false
    };
  },
  mixins: [uploadImages],
  computed: {
    currentUserArray() {
      return this.$store.getters.currentUser || { username: "", avatar: null };
    },
  },
  watch:{
$route:{
async handler(to,from){
  if(to.name==='landingpage'){
    this.$router.replace('/chats')
  }
}
}
  },
  async mounted() {
    this.overlayValue = true;
    if (!this.$store.getters.currentUser) {
     await this.$store.dispatch("fetchCurrentUser");
    }
  if (this.$store.getters.currentUser?.avatar) {
    await this.getProfileImage()
  }
    setTimeout(() => {
      this.$router.push("/chats");
      this.overlayValue = false;
    }, 1000);
  },
  methods: {
    OpenLogoutDialog() {
      this.logoutDialogEmit = true;
    },
    async getProfileImage() {
      let img = await this.getUrlImagesMethod(
       this.$store.getters.currentUser.avatar,
      );
      console.log("current User Profile image", img);
      this.profileImageUrl=img
    },
    async updateUserMethod(data) {

  try {

    const userId = this.currentUserArray.user_id

    const key = await this.uploadImagesMethod(data.avatar, userId)

    await client.graphql({
      query: updateUser,
      variables: {
        input: {
          avatar: key
        }
      }
    })

    this.$store.commit("SET_USER_AVATAR", key)

    const url = await this.getUrlImagesMethod(key)

    this.profileImageUrl = url

  } catch (e) {

    console.error(e)

  }

}
  },
};
</script>

<style scoped>
.profileimg :deep(.v-list-item__content) {
  justify-content: center;
  display: flex;
  align-items: center;
  overflow: hidden;
  min-width: 40px;
}
</style>
