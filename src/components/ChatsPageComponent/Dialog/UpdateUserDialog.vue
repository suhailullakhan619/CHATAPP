<template>
  <v-dialog v-model="dialog" max-width="420">
    <v-card>
      <!-- HEADER -->
      <v-toolbar color="primary">
        <v-toolbar-title>Update Avatar</v-toolbar-title>

        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon size="30">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <!-- Avatar Preview -->
        <div class="d-flex flex-column align-center justify-center mb-4">
          <v-avatar size="90" color="deep-purple">
            <v-img v-if="avatarPreview" :src="avatarPreview" />

            <v-img v-else-if="profileImage" :src="profileImage"></v-img>
            <v-icon v-else color="white" size="40"> mdi-account </v-icon>
          </v-avatar>

          <div class="mt-2 fontVariant5 font-weight-medium">
            {{ username }}
          </div>
        </div>

        <!-- Upload -->
        <v-file-input
          label="Choose Avatar"
          accept="image/*"
          prepend-icon="mdi-camera"
          variant="outlined"
          density="compact"
          @update:model-value="handleAvatar"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          variant="outlined"
          class="text-none"
          color="primary"
          @click="dialog = false"
        >
          Cancel
        </v-btn>

        <v-btn
          color="success"
          class="text-none"
          variant="flat"
          @click="updateUser"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    updateUserDialogEmit: Boolean,
    username: String,
    profileImage:String
  },

  emits: ["update:updateUserDialogEmit", "update-user"],

  data() {
    return {
      avatarFile: null,
      avatarPreview: null,
    };
  },

  computed: {
    dialog: {
      get() {
        return this.updateUserDialogEmit;
      },
      set(val) {
        this.$emit("update:updateUserDialogEmit", val);
      },
    }
  },

  methods: {
    handleAvatar(files) {
      const file = Array.isArray(files) ? files[0] : files;

      this.avatarFile = file;

      if (file) {
        this.avatarPreview = URL.createObjectURL(file);
      }
    },
    updateUser() {
      if (!this.avatarFile) return;

      this.$emit("update-user", {
        avatar: this.avatarFile,
      });

      this.dialog = false;
    },
  },
};
</script>
