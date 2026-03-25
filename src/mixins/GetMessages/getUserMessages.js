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
    async getUserMessagesMethod(conversation_Id,nextToken = null){
      try{
      const result=await client.graphql({
        query:getMessages,
        variables:{
          input:{
            conversationId:conversation_Id,
            nextToken: nextToken,
          }
        }
      })
   
     const resultObj = JSON.parse(result.data.getMessages);
 console.log("🚀 ~ getUserMessages.methods.getUserMessagesMethod:", resultObj)
    const messagesArray = resultObj?.data?.messages ?? [];

    const formatted = messagesArray.map((msg) => ({
      ...msg,
      seen: msg.is_read,
    }));

    // 👇 if first load → replace
    if (!nextToken) {
      this.messages = formatted;
    } else {
      // 👇 prepend older messages
      this.messages = [...formatted, ...this.messages];
    }

    // 👇 update pagination state
    this.messagesInfiniteScroll.nextToken = resultObj.data.nextToken;
    this.messagesInfiniteScroll.hasMoreMessage = !!resultObj.data.nextToken;
    this.messagesInfiniteScroll.isFetchingMore = false;
    }catch(e){
      console.error("🚀 ~ e:getUserMessages.methods.getUserMessagesMethod:", e)   
  }  
  }
  },
}
