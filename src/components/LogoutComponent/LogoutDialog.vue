<template>
<v-dialog :model-value="logoutDialogEmit" persistent width="400">
  <v-card rounded="lg">
    <v-toolbar class="px-2" color="primary">
     <v-toolbar-title> Confirm Logout</v-toolbar-title>
     <v-spacer></v-spacer>
     <v-icon size="30" @click="closeLogoutDialog">mdi-close</v-icon>
    </v-toolbar>

    <v-card-text>
      Are you sure you want to logout from Chat App?
    </v-card-text>

    <v-card-actions>

      <v-spacer></v-spacer>

      <v-btn
        variant="outlined"
        class="text-none"
        density="comfortable"
        color="primary"
        @click="closeLogoutDialog"
      >
        Cancel
      </v-btn>

      <v-btn
        color="error"
        variant="flat"
        class="text-none"
        density="comfortable"
        @click="GlobalSignOut"
        :loading="loading"
        :disabled="loading"
      >
        Logout
      </v-btn>

    </v-card-actions>

  </v-card>

</v-dialog>
</template>

<script>
import { signOut } from 'aws-amplify/auth';
export default{
  props:{
logoutDialogEmit:Boolean
  },
  components:{
  },
  emits:['update:logoutDialogEmit'],
  data(){
    return{
loading:false
    }
  },
  methods:{
  async GlobalSignOut(){
        this.loading=true 
      try{
 await signOut()
 this.$emit('update:logoutDialogEmit',false)
 this.$router.push('/')
      }catch(e){
        console.error('signOutError',e)
      }finally{
        this.loading=false
      }     
    },
    closeLogoutDialog(){
    this.$emit('update:logoutDialogEmit',false)
  }
  },
  
 
}
</script>
<style>
</style>