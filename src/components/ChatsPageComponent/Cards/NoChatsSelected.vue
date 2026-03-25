<template>
<div class="no-chat-selected">
          <v-icon size="80" color="grey-lighten-1"
            >mdi-message-text-outline</v-icon
          >
          <h2 class="mt-4 text-grey-darken-1">Welcome to Chat</h2>
          <p class="text-grey">Select a conversation to start messaging</p>
        </div>
</template>
<style scoped>
.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f0f2f5;
  color: #aaa;
  text-align: center;
  padding: 20px;
}
</style>