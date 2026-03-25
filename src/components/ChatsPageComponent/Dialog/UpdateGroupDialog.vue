  <template>
  <v-dialog v-model="dialog" max-width="420">
  <v-card rounded="lg">
  <v-toolbar color="primary" class="px-2">
  <v-toolbar-title>Edit Group</v-toolbar-title>
  <v-spacer/>
  <v-btn icon @click="dialog=false">
  <v-icon size="30">mdi-close</v-icon>
  </v-btn>
  </v-toolbar>

  <v-card-text>

  <!-- Avatar -->
  <div class="d-flex justify-center mb-4">

  <v-avatar size="80" color="deep-purple">

  <v-img v-if="avatarPreview" :src="avatarPreview"/>

  <v-icon v-else color="white">mdi-account-group</v-icon>

  </v-avatar>

  </div>

  <v-file-input
  label="Group Avatar"
  prepend-icon="mdi-camera"
  accept="image/*"
  density="compact"
  variant="outlined"
  @change="handleAvatar"
  />

  <!-- Group Name -->
  <v-text-field
  label="Group Name"
  v-model="groupName"
  variant="outlined"
  density="compact"
  class="mt-3"
  />

  </v-card-text>

  <v-card-actions>

  <v-spacer/>

  <v-btn variant="outlined" class="text-none" color="primary" @click="dialog=false">
  Cancel
  </v-btn>

  <v-btn color="success" class="text-none" variant="flat" @click="updateGroup">
  Confirm
  </v-btn>

  </v-card-actions>

  </v-card>

  </v-dialog>
  </template>

  <script>
  export default{

  props:{
  updateGroupDialogEmit:Boolean,
  selectedChat:Object
  },

  emits:["update:updateGroupDialogEmit","update-group"],

  data(){
  return{
  groupName:"",
  avatarFile:null,
  avatarPreview:null
  }
  },

  computed:{
  dialog:{
  get(){
  return this.updateGroupDialogEmit
  },
  set(val){
  this.$emit("update:updateGroupDialogEmit",val)
  }
  }
  },

  watch:{
  selectedChat:{
  immediate:true,
  handler(chat){
  if(!chat) return
  this.groupName = chat.group_name
  this.avatarPreview = chat.group_avatar || null
  }
  }
  },

  methods:{

handleAvatar(files){

  let file = null

  if(Array.isArray(files)){
    file = files[0]
  }
  else if(files instanceof FileList){
    file = files[0]
  }
  else if(files instanceof File){
    file = files
  }

  if(!file) return

  this.avatarFile = file

  if(this.avatarPreview){
    URL.revokeObjectURL(this.avatarPreview)
  }

  this.avatarPreview = URL.createObjectURL(file)

},
  updateGroup(){

  this.$emit("update-group",{
  conversationId:this.selectedChat.conversation_id,
  name:this.groupName,
  avatar:this.avatarFile
  })

  this.dialog=false

  }

  }

  }
  </script>