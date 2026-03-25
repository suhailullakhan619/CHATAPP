<template>
 <v-dialog v-model="dialog" max-width="500" persistent>
  <v-card class="dialog-container" rounded="lg">
    <!-- HEADER -->
    <div class="dialog-header" >
      <v-toolbar class="px-2 mb-2" color="primary">
        <v-toolbar-title>Add Members {{ selectedUsers.length }}</v-toolbar-title>
        <v-spacer />
     <v-btn icon>
          <v-icon size="30"  @click="dialog=false">mdi-close</v-icon>
     </v-btn>
      </v-toolbar>

      <v-text-field
        v-model="search"
        placeholder="Search users"
        density="compact"
        variant="outlined"
        hide-details
        class="px-3 pb-2"
      />
    </div>

    <!-- SCROLLABLE USER LIST -->
     <v-container class="dialog-body">
      <v-list v-if="filteredUsers.length">
        <v-list-item
        rounded="lg"
          v-for="user in filteredUsers"
          :key="user.user_id"
          @click="toggleUser(user)"
        >
        <div class="d-flex ga-2 align-center">
        <v-avatar size="32" color="grey-lighten-2">
  <v-img v-if="user.avatar" :src="user.avatar" />

  <span v-else class="text-caption font-weight-bold">
    {{ user.username?.charAt(0).toUpperCase() }}
  </span>
</v-avatar>
          <v-list-item-title width="fit-content">{{ user.username }}</v-list-item-title>
          </div>

          <template #append>
            <v-checkbox hide-details color="primary" :model-value="selectedUsers.includes(user.user_id)" />
          </template>
        </v-list-item>
      </v-list>

      <v-alert v-else type="info" density="compact">
        No users available
      </v-alert>
     </v-container>
    

    <!-- FOOTER -->
    <v-card-actions class="dialog-footer">
      <v-spacer />
      <v-btn variant="outlined" color="primary" @click="dialog=false">Cancel</v-btn>
      <v-btn color="success" variant="flat" @click="addMembers">Add Users</v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>
</template>

<script>
export default {
  props: {
    AddMemberstoGroupDialogEmit: Boolean,
    allUsers: Array,
    groupMembers: Array,
  },

  emits: ["update:AddMemberstoGroupDialogEmit", "add-members"],

  data() {
    return {
      search: "",
      selectedUsers: [],
    };
  },

  computed: {
    dialog: {
      get() {
        return this.AddMemberstoGroupDialogEmit;
      },
      set(val) {
        this.$emit("update:AddMemberstoGroupDialogEmit", val);
      },
    },

   filteredUsers(){

const users = this.allUsers || []
const members = this.groupMembers || []

const memberIds = members.map(m => m.user_id)

return users
  .filter(user => !memberIds.includes(user.user_id))
  .filter(user =>
    user.username.toLowerCase().includes(this.search.toLowerCase())
  )

}
  },

  methods: {
    toggleUser(user) {
      const index = this.selectedUsers.indexOf(user.user_id);

      if (index === -1) {
        this.selectedUsers.push(user.user_id);
      } else {
        this.selectedUsers.splice(index, 1);
      }
    },

   addMembers() {

  if (!this.selectedUsers.length) {
    return
  }

  this.$emit("add-members", this.selectedUsers)

  this.selectedUsers = []

  this.dialog=false
}
  },
};
</script>
<style scoped>
.dialog-container{
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.dialog-header{
  flex-shrink: 0;
}

.dialog-body{
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  scroll-behavior: smooth;
}

.dialog-footer{
  flex-shrink: 0;
}
</style>
