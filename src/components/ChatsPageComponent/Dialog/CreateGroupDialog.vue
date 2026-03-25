<template>
  <v-dialog v-model="dialog" max-width="420">
    <v-card rounded="lg">
      <v-toolbar color="primary">
        <v-toolbar-title>Create Group</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon size="30">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <!-- Avatar -->
        <div class="d-flex justify-center mb-4">
          <v-avatar size="80" color="deep-purple">
            <!-- <v-img v-if="avatarPreview" :src="avatarPreview" /> -->

            <v-icon  color="white">mdi-account-group</v-icon>
          </v-avatar>
        </div>

        <!-- <v-file-input
          label="Group Avatar"
          accept="image/*"
          density="compact"
          variant="outlined"
          @update:modelValue="handleAvatar"
        /> -->

        <!-- Group Name -->
        <v-text-field
          label="Group Name"
          v-model="groupName"
          variant="outlined"
          density="compact"
          class="mt-3"
        />

        <!-- Members -->
        <v-autocomplete
          v-model="selectedUsers"
          :items="allUsers"
          item-title="username"
          item-value="user_id"
          label="Add Participants"
          chips
          multiple
          closable-chips
          density="compact"
          variant="outlined"
          class="mt-3"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="outlined"
          color="primary"
          class="text-none"
          @click="dialog = false"
        >
          Cancel
        </v-btn>

        <v-btn
          color="success"
          variant="flat"
          class="text-none"
          @click="createGroupMethod"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    CreateGroupDialogEmit: Boolean,
    allUsers: Array,
  },

  emits: ["update:CreateGroupDialogEmit", "create-group"],

  data() {
    return {
      groupName: "",
      selectedUsers: [],
      avatarFile: null,
      avatarPreview: null,
    };
  },

  computed: {
    dialog: {
      get() {
        return this.CreateGroupDialogEmit;
      },
      set(val) {
        this.$emit("update:CreateGroupDialogEmit", val);
      },
    },
  },

  methods: {
    createGroupMethod() {
      if (!this.groupName || !this.selectedUsers.length) return;

      this.$emit("create-group", {
        name: this.groupName,
        participantIds: this.selectedUsers,
        avatar: this.avatarFile,
      });

      this.groupName = "";
      this.selectedUsers = [];
      this.avatarFile = null;
      this.avatarPreview = null;

      this.dialog = false;
    },
  },
};
</script>
