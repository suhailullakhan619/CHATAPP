<template>
   <v-overlay
      :model-value="overlayValue"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
</template>
<script>
export default{
  props:{
   overlayValue:Boolean
  },
  data(){
    return{

    }
  }
}
</script>