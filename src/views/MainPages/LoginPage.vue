<template>
<v-container fluid class="login-container primary d-flex align-center justify-center">
  <SnackbarComponent :snackbarComp="snackbarComp"/>
  <v-card width="430" elevation="12" rounded="xl">

    <!-- LOGO + TITLE -->
    <v-card-title class="flex-column text-center pt-8">

      <v-avatar size="70" class="mb-3 ">
        <v-img lazy src="@/assets/chatlogo.svg" alt="Logo"></v-img>
      </v-avatar>

      <h2 class="font-weight-bold">Chat App</h2>
      <span class="text-grey-darken-1 text-body-2">
        Connect and start chatting
      </span>

    </v-card-title>

    <v-divider class="my-4"></v-divider>

    <!-- FORM -->
    <v-card-text>

      <v-form ref="form" @submit.prevent="confirmValiationMethod"> 

        <!-- EMAIL -->
        <v-text-field
          v-model="email"
          label="Email*"
          variant="outlined"
          prepend-inner-icon="mdi-email-outline"
          density="comfortable"
          class="mb-4"
          :rules="emailRules"
        ></v-text-field>

        <!-- PASSWORD -->
        <v-text-field
          v-model="password"
          label="Password*"
          :type="passwordShow?'text':'password'"
          variant="outlined"
          prepend-inner-icon="mdi-lock-outline"
          density="comfortable"
          class="mb-2"
          :append-inner-icon="passwordShow?'mdi-eye-off-outline':'mdi-eye-outline'"
          @click:append-inner="passwordShow=!passwordShow"
          :rules="passwordRules"
        >
      
      </v-text-field>

        <!-- OPTIONS -->
        <div class="d-flex justify-space-between align-center mb-4">
           <v-spacer></v-spacer>
          <div elevation="0" size="small" class="forgetpassword text-primary cursor-pointer ">
            Forgot password?
          </div>

        </div>

        <!-- LOGIN BUTTON -->
        <v-btn
        variant="flat"
        elevation="0"
          color="primary"
          class="mb-3 text-none w-100"
         type="submit"
          :loading="loading"
        :disabled="loading"
        >
          Login
        </v-btn>
      </v-form>

    </v-card-text>

    <!-- SIGNUP -->
    <v-card-actions class="justify-center pb-6">
      <span class="text-grey">Don't have an account?</span>

      <v-btn
        variant="text"
        color="primary"
        class="text-none"
      >
        Sign Up
      </v-btn>

    </v-card-actions>

  </v-card>

</v-container>
</template>

<!-- <script>
import {signIn,signOut,fetchAuthSession} from 'aws-amplify/auth'
import SnackbarComponent from '@/components/Extras/SnackbarComponent.vue';
import { getCurrentUsermixin } from '@/mixins/getCurrentUser/getCurrentUser';
export default{
  components:{
SnackbarComponent,
  },
  data(){
    return{
      passwordShow:false,
      overlayValue:false,
      loading:false,
      email:"suhail@gmail.com",
      password:"*Asset1*",
      emailRules:[
v => !!v || 'Email is required',
v => /.+@.+\..+/.test(v) || 'Email must be valid'
],

passwordRules:[
v => !!v || 'Password is required',
v => v.length >= 6 || 'Password must be at least 6 characters'
],
snackbarComp:{}
    }
  },
  mixins:[getCurrentUsermixin],
  methods:{
    showSnackBar(color,message){
     this.snackbarComp={
      snackbarCompValue:true,
      message,
      color
     }
     setTimeout(()=>{
      this.snackbarComp.snackbarCompValue=false
     },2000)
    },
   async confirmValiationMethod(){
    try{
      await signOut()
    }catch(e){

    }
    try{
 const {valid}=await this.$refs.form.validate()
      if(!valid){
        this.showSnackBar('error','Field are mandatory with (*) Astrisk')
        return
      }
      this.loading=true
    await this.UserSignInMethod()
    const res= await this.getCurrentUserMethod()
         console.log('res curent',res)
        this.$router.push('/Landingpage')
        
    }catch(e){
      this.showSnackBar('error',e)
    }finally{
      this.loading=false
    }
    },
    async UserSignInMethod(){
      try{
      const response=await signIn(
        {
          username:this.email,
          password:this.password
        }
      )
      this.showSnackBar('success','Login successful')
      console.log('signin response',response)
      // wait for tokens
    const session = await fetchAuthSession()
    console.log("JWT", session.tokens?.idToken)
      }catch(e){
        console.error('error in signin fn',e)
        this.showSnackBar('error', e.message || 'Login failed')
      }
    }
  }
}
</script> -->

<script>
import {signIn, signOut, fetchAuthSession} from 'aws-amplify/auth'
import SnackbarComponent from '@/components/Extras/SnackbarComponent.vue';
import { getCurrentUsermixin } from '@/mixins/getCurrentUser/getCurrentUser';
export default {
  components: {
    SnackbarComponent,
  },
  data() {
    return {
      passwordShow: false,
      overlayValue: false,
      loading: false,
      email: "suhail@gmail.com",
      password: "*Asset1*",
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters'
      ],
      snackbarComp: {}
    }
  },
  mixins: [getCurrentUsermixin],
  methods: {
    showSnackBar(color, message) {
      this.snackbarComp = {
        snackbarCompValue: true,
        message,
        color
      }
      setTimeout(() => {
        this.snackbarComp.snackbarCompValue = false
      }, 2000)
    },
    async confirmValiationMethod() {
      try {
        await signOut({global:true}) 
        this.$store.commit("CLEAR_USER") 
      } catch {
        console.log("removed active session")
      }
      try {
        const { valid } = await this.$refs.form.validate()
        if (!valid) {
          this.showSnackBar('error', 'Fields marked with (*) are mandatory')
          return
        }
        this.loading = true
        await this.UserSignInMethod()
         await this.getCurrentUserMethod()
        this.$router.push('/Landingpage')
        this.loading = false
      } catch (e) {
        this.loading = false 
        console.log('errorre',e) // FIX 2: reset loading on error
        this.showSnackBar('error', e.message || e)
      }
    },
    async UserSignInMethod() {
      try {
        const response = await signIn({
          username: this.email,
          password: this.password
        })
        this.showSnackBar('success', 'Login successful')
        console.log('signin response', response)
        const session = await fetchAuthSession()
        console.log("JWT", session.tokens?.idToken)
      } catch (e) {
        console.error('error in signin fn', e)
        this.showSnackBar('error', e.message || 'Login failed')
        throw e  // FIX 3: rethrow so outer method stops on failure
      }
    }
  }
}
</script>
<style scoped>

.login-container{
  height:100vh;
  background: #6366f1;
}
.forgetpassword{
  transform: scale(1);
}
.forgetpassword:active{
  transform: scale(0.9);
}

</style>