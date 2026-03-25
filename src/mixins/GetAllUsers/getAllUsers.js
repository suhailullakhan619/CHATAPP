import { generateClient } from "aws-amplify/api";
import { getAllUsers } from "@/graphql/queries";
const client=generateClient()
export const getAllUsersmixins={
  data(){
    return {
getAllUsersArray:[]
    }
  },
  methods: {
   async getAllUsersMethod(){
    try{
const result=await client.graphql({
  query:getAllUsers
})
const resultObj=JSON.parse(result.data.getAllUsers)
this.getAllUsersArray=resultObj.data
 console.log("🚀 ~ getrAllUsers.methods.getAllUsersMethod:", result)
    }
    catch(e){
    console.error("🚀 ~ e:getrAllUsers.methods.getAllUsersMethod:", e) 
  }
  }

  },

}
  
