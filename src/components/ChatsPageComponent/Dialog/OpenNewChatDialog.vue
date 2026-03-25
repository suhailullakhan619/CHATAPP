<template>
  <v-dialog :model-value="OpenNewChatDialogEmit" persistent>
    <v-card rounded="lg">
    <v-toolbar color="primary" class="px-2" fixed>
      <v-toolbar-title>Start Conversation</v-toolbar-title>
      <v-btn icon  @click="closeOpenNewChatDialogDialog"  >
      <v-icon size="30">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container class="overflow-y-auto hide-scrollbar" >
      
      <v-text-field
  v-model="search"
  prepend-inner-icon="mdi-magnify"
  placeholder="Search users"
  variant="outlined"
  density="comfortable"
/>
 <v-list lines="two">

    <v-list-item
      v-for="user in filterUserbyname"
      :key="user.user_id"
      @click="StartConversationwithUser(user)"
    >

      <template #prepend>
        <v-avatar color="primary">
          {{ user.username.charAt(0).toUpperCase() }}
        </v-avatar>
      </template>

      <v-list-item-title>
        {{ user.username }}
      </v-list-item-title>

      <v-list-item-subtitle>
        {{ user.email }}
      </v-list-item-subtitle>

    </v-list-item>

  </v-list>

      

    </v-container>
    <v-card-actions>
      <v-btn color="primary" variant="outlined" class="text-none" density="comfortable" @click="closeOpenNewChatDialogDialog">Close</v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>


</template>

<script>
import { getAllUsersmixins } from '@/mixins/GetAllUsers/getAllUsers';
export default{
  props:{
    OpenNewChatDialogEmit:Boolean
  },
  data(){
    return{
search:''
    }
  },
  mixins:[getAllUsersmixins],
  emits:['update:OpenNewChatDialogEmit','startConversation'],
   mounted(){
   this.getAllUsersMethod()
  },
  computed:{
    filterUserbyname(){
      if(!this.getAllUsersArray)return []
      if(!this.search)return this.getAllUsersArray
      return this.getAllUsersArray.filter(user=>user.username.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  methods:{
    StartConversationwithUser(user){
  this.$emit("startConversation", user)
  this.$emit("update:OpenNewChatDialogEmit", false)
},
closeOpenNewChatDialogDialog(){
this.$emit('update:OpenNewChatDialogEmit',false)
}
  }
}
</script>
<style scoped>
.hide-scrollbar{
  scrollbar-width: thin;
}
</style>