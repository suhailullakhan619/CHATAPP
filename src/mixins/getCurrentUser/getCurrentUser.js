import {generateClient} from 'aws-amplify/api'
import {getCurrentUser} from '@/graphql/queries'
export const getCurrentUsermixin={
  data(){
    return{
   currentUserArray:{}
    }
  },
  methods:{
  async getCurrentUserMethod(){
const client=generateClient()
  const result=await client.graphql({
   query:getCurrentUser,
  })
  const prased=JSON.parse(result.data.getCurrentUser)
  this.currentUserArray=prased.data
    }
  }
}