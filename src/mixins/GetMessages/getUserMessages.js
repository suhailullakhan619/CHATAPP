import { generateClient } from "aws-amplify/api";
import { getMessages } from "@/graphql/queries";
const client =generateClient()

export const getUserMessages={
  data(){
    return{
  messages:[],
    }
  },
  methods: {
    async getUserMessagesMethod(conversation_Id){
      try{
      const result=await client.graphql({
        query:getMessages,
        variables:{
          input:{
            conversationId:conversation_Id
          }
        }
      })
    console.log("🚀 ~ getUserMessages.methods.getUserMessagesMethod:", result)
    const resultObj=JSON.parse(result.data.getMessages)
    console.log('~ getUserMessages.methods.getUserMessagesMethod:resultObj',resultObj)
   this.messages = resultObj.data.map(msg => ({
  ...msg,
  seen: msg.is_read
}))
    }catch(e){
      console.error("🚀 ~ e:getUserMessages.methods.getUserMessagesMethod:", e)   
  }  
  }
  },
}
