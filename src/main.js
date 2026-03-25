import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import {Amplify} from 'aws-amplify'
Amplify.configure({
  Auth:{
    Cognito:{
      region:process.env.VUE_APP_AWS_APPSYNC_REGION,
      userPoolId:process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId:process.env.VUE_APP_AWS_USER_POOL_CLIENT_ID,
      identityPoolId:process.env.VUE_APP_AWS_IDENTITY_POOL_ID,
      loginWith:{email:true}
    }
  },
  API:{
    GraphQL:{
      endpoint:process.env.VUE_APP_AWS_APPSYNC_GRAPHQL_ENDPOINT,
      region:process.env.VUE_APP_AWS_APPSYNC_REGION,
      defaultAuthMode:process.env.VUE_APP_AWS_AUTHENTICATION_TYPE,
    }
  },
  Storage:{
    S3:{
    bucket:process.env.VUE_APP_AWS_STORAGE_BUCKET,
    region:process.env.VUE_APP_AWS_STORAGE_REGION
    }
  }
})

loadFonts()
createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
