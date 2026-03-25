<template >
<v-navigation-drawer
  v-model="drawer"
  width="300"
  location="right"
  :temporary="smandDown"
  class="navigationdrawer"
>

<div class="drawer-container">

  <!-- TOP SECTION -->
  <div class="drawer-header">

    <v-toolbar flat color="primary">
      <v-toolbar-title>Group Info</v-toolbar-title>
      <v-btn icon @click="CloseNaviagtion()">
      <v-icon size="30" >mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider />

    <div class="pa-4 text-center">
      <v-avatar size="80" color="deep-purple">
        <v-icon size="40" color="white">mdi-account-group</v-icon>
      </v-avatar>

      <h3 class="mt-3">
        {{ selectedChat?.group_name }}
      </h3>

      <p class="text-grey">
        {{ getGroupMemberArray?.length || 0 }} members
      </p>
    </div>

    <v-divider />

    <!-- ACTION BUTTONS -->
    <div class="d-flex flex-row align-center justify-center w-100 ga-3 pa-2">
      <v-btn
        class="text-none columnbtn rounded-lg"
        variant="outlined"
        elevation="0"
        @click="$emit('open-add-members')"
      >
        <v-icon start size="24" color="success">mdi-account-plus-outline</v-icon>
        <div>Add Members</div>
      </v-btn>

      <v-btn
        class="text-none columnbtn rounded-lg"
        elevation="0"
        variant="outlined"
        @click="$emit('open-edit-group')"
      >
        <v-icon start size="24" color="success">mdi-pencil-outline</v-icon>
        <div>Edit Group</div>
      </v-btn>
    </div>

    <v-divider />

  </div>


  <!-- SCROLLABLE MEMBERS -->
  <div class="members-scroll">

    <v-list>
      <v-list-subheader>Members</v-list-subheader>

      <v-list-item
        v-for="member in sortedMembers"
        :key="member.user_id"
      >
        <div class="d-flex align-center justify-space-between px-1">

          <div class="d-flex ga-1 align-center">
            <v-avatar size="32" color="grey-lighten-1">
              <v-img v-if="member.avatar && avatarUrlCache[member.avatar]" :src="avatarUrlCache[member.avatar]" />
              <span v-else class="text-white">
                {{ member.username?.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>

            <div>{{ member.username }}</div>
          </div>

          <v-chip
            density="compact"
            color="success"
            v-if="member.role === 'ADMIN'"
          >
            Group Admin
          </v-chip>

          <v-btn
            icon
            size="small"
            v-if="selectedChat?.creator_id === currentUser?.user_id"
            @click="removeMember(member)"
            elevation="0"
          >
            <v-icon color="red">mdi-account-remove</v-icon>
          </v-btn>

        </div>
      </v-list-item>

    </v-list>

  </div>


  <!-- BOTTOM BUTTON -->
  <div class="drawer-footer">

    <v-divider />

    <div class="d-flex justify-center pa-2">
      <v-btn
        class="text-none rounded-lg"
        color="error"
        elevation="1"
        @click="leaveGroupMethod"
      >
        <v-icon start size="24">mdi-logout</v-icon>
        Exit Group
      </v-btn>
    </div>

  </div>

</div>

</v-navigation-drawer>
</template>

<script>
import { uploadImages } from '@/mixins/UploadImagesTOS3/UploadImagestoS3';
export default {
  props: {
    groupDrawer: Boolean,
    getGroupMemberArray:Array,
    selectedChat:Object
  },
mixins:[uploadImages],
  emits: ["update:groupDrawer",'leave-group', "open-add-members","remove-member","open-edit-group" ],
watch: {
  getGroupMemberArray: {
    immediate: true,
    async handler(members) {

      if (!members) return

      for (const member of members) {

        const key = member.avatar

        if (!key) continue

        if (this.avatarUrlCache[key]) continue

        const url = await this.getUrlImagesMethod(key)

        this.avatarUrlCache = {
          ...this.avatarUrlCache,
          [key]: url
        }

      }

    }
  }
},
  computed: {
    currentUser(){
 return this.$store.getters.currentUser
    },
     drawer: {
    get() {
      return this.groupDrawer
    },
    set(val) {
      this.$emit("update:groupDrawer", val)
    }
  },
    smandDown(){
      return this.$vuetify.display.smAndDown.value
    },
   sortedMembers() {
  return [...(this.getGroupMemberArray || [])].sort((a, b) => {

    // 1️⃣ Admins first
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1

    // 2️⃣ Alphabetical by username
    return a.username.localeCompare(b.username)
  })
}
  },
  data(){
    return{
      avatarUrlCache:{}
    }
  },
  methods:{
    CloseNaviagtion(){
      this.$emit('update:groupDrawer',false)
    },
    leaveGroupMethod(){
    this.$emit("leave-group", this.selectedChat?.conversation_id)
  },
  removeMember(member){
    this.$emit("remove-member", member)
  }
     
  }
}
</script>
<style scoped>
.navigationdrawer{
  overflow-y: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
}
.columnbtn :deep(.v-btn__content) {
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}
.columnbtn{
  height: auto;
  width: 120px;
  padding: 5px
}

.navigationdrawer{
  padding:0;
}

.drawer-container{
  display:flex;
  flex-direction:column;
  height:100%;
}

.drawer-header{
  flex-shrink:0;
}

.members-scroll{
  flex:1;
  overflow-y:auto;
  scrollbar-width:none;
}

.drawer-footer{
  flex-shrink:0;
}
</style>