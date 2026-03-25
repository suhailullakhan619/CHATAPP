import { generateClient } from "aws-amplify/api";
import { getConversations } from "@/graphql/queries";
const client =generateClient();
export const getConversationsmixins={
  data() {
    return {
      usersList:[]
    }
  },
  methods: {
    async getConversationsMethod(){
      try{
      const result=await client.graphql({
        query:getConversations
      })
     console.log("🚀 ~ getUserList.methods.getConversationsMethod:", result) 
     const prased=JSON.parse(result.data.getConversations)
     this.usersList=prased.data;
    
   
    }
    catch(e){
      console.error("🚀 ~ e getUserList.methods.getConversationsMethod:", e)
    }
  }
  },
}
