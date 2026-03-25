<template>
<v-snackbar
  v-model="snackbarComp.snackbarCompValue"
  :color="snackbarComp.color"
  location="top"
  
>
{{ snackbarComp.message }}
</v-snackbar>
</template>

<script>
export default{
  props:{
    snackbarComp:Object
  }
}
</script>