<template>
<v-dialog v-model="dialog" max-width="400" persistent="">

  <v-card rounded="lg">

    <v-toolbar class="px-2" color="primary">
      <v-toolbar-title>Leave Group?</v-toolbar-title>
      <v-btn icon  @click="$emit('update:modelValue', false)">
      <v-icon size="30">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
<v-container>
    <v-card-text class="fontVariant5">
      Are you sure you want to leave this group?
      </v-card-text>
</v-container>
    <v-card-actions>

      <v-spacer/>

      <v-btn
      class="text-none"
      color="primary"
        variant="outlined"
        @click="$emit('update:modelValue', false)"
      >
        Cancel
      </v-btn>

      <v-btn
      class="text-none"
        color="error"
        variant="flat"
        @click="confirmLeave"
      >
        Leave
      </v-btn>

    </v-card-actions>

  </v-card>

</v-dialog>
</template>

<script>
export default{
props:{
modelValue:Boolean
},

emits:["update:modelValue","confirm-leave"],

computed:{
dialog:{
get(){
return this.modelValue
},
set(val){
this.$emit("update:modelValue",val)
}
}
},

methods:{
confirmLeave(){
this.$emit("confirm-leave")
}
}
}
</script>