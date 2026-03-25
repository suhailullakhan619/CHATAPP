import { generateClient } from "aws-amplify/api"
import { markConversationRead } from "@/graphql/mutations"
const client=generateClient()
export const markConversationReadmixin={
data(){
  return{

  }
},
methods: {
  async markConversationReadMethod(conversationId){
    try{
    const result=await client.graphql({
      query:markConversationRead,
      variables:{
        input:{
conversationId
        }
      }
    })
    console.log('markConversationRead result',result)

  }catch(e){
  console.error("🚀 ~ e:markConversationRead result", e)

  }

  }
},
}