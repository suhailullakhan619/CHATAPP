import { generateClient } from "aws-amplify/api"
import { getGroupMembers } from "@/graphql/queries"
const client=generateClient()
export const getGroupMembersmixin={
  data() {
    return {
      getGroupMemberArray:[]
    }
  },
  methods: {
  async  getGroupMembersMethod(conversationId){
    try{
const result=await client.graphql({
  query:getGroupMembers,
  variables:{
    input:{
    conversationId
    }
  }
})
const resultObj=JSON.parse(result.data.getGroupMembers);
console.log('getGroupMembersMethod',resultObj)
this.getGroupMemberArray=resultObj.data
    }
    catch(e){
    console.error('getGroupMembersMethod',e)
  }
  }
  },
}