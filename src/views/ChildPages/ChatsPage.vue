<template>
  <v-container fluid class="pa-0 fill-height">
    <OpenNewChatDialog
      v-model:OpenNewChatDialogEmit="OpenNewChatDialogEmit"
      @startConversation="createConversation"
      max-width="500"
      max-height="500"
    />
    <v-row no-gutters class="fill-height">
      <!-- CHAT LIST PANEL -->
      <v-col
        cols="12"
        sm="5"
        md="4"
        v-show="!selectedChat || !isMobile"
        class="chat-list"
      >
        <div>
          <v-toolbar flat color="primary">
            <v-toolbar-title>Chats</v-toolbar-title>

            <WebSocketNotifications />
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  variant="text"
                  v-bind="props"
                ></v-btn>
              </template>

              <v-list>
                <v-container class="pa-1">
                  <v-list-item
                    @click="CreateGroupDialogEmit = true"
                    rounded="lg"
                  >
                    <template #prepend>
                      <v-icon>mdi-account-plus</v-icon>
                    </template>
                    <v-list-item-title>New Group</v-list-item-title>
                  </v-list-item>
                </v-container>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-text-field
            placeholder="Search or start new chat"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="ma-3"
            v-model="search"
            hide-details
          />
        </div>
        <div class="chat-list-scroll">
          <div v-if="filteredChats.length">
            <v-list lines="two" class="vlistbg">
              <v-list-item
                v-for="chat in filteredChats"
                :key="chat.conversation_id"
                @click="selectChat(chat)"
                :class="{
                  'chat-item': true,
                  'chat-active':
                    selectedChat?.conversation_id === chat.conversation_id,
                }"
                rounded="lg"
              >
                <template #prepend>
                  <v-avatar
                    v-if="
                      chat.group_avatar && avatarUrlCache[chat.group_avatar]
                    "
                  >
                    <v-img :src="avatarUrlCache[chat.group_avatar]" />
                  </v-avatar>

                  <v-avatar v-else-if="getAvatarUrl(chat)">
                    <v-img :src="getAvatarUrl(chat)" />
                  </v-avatar>
                  <!-- <v-avatar v-else :color="getAvatarColor(getChatName(chat))">
  <span class="text-white font-weight-bold">
    {{ getInitials(getChatName(chat)) }}
  </span>
</v-avatar> -->
                  <v-avatar v-else>
                    <v-avatar v-if="chat.group_name" color="deep-purple">
                      <v-icon color="white">mdi-account-group</v-icon>
                    </v-avatar>

                    <v-img v-else :src="getHardcodedAvatar(chat)" />
                  </v-avatar>
                </template>
                <v-list-item-title>{{ getChatName(chat) }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ chat.last_message }}
                </v-list-item-subtitle>
                <!-- <div class="d-flex justify-space-between align-center pr-2 position-relative" >
              <v-list-item-subtitle>{{ chat.last_message }}</v-list-item-subtitle>
              <v-badge
                v-if="chat.unread"
                color="success"
                :content="chat.unread "
                location="right bottom"
              ></v-badge>
            </div> -->
                <template #append>
                  <div class="d-flex flex-column w-100 h-full">
                    <span class="chat-time">
                      {{ formatChatListTime(chat.last_message_at) }}
                    </span>

                    <v-badge
                      v-if="chat.unread"
                      color="success"
                      :content="chat.unread"
                      location="bottom"
                      style="position: absolute; right: 30px; bottom: 20px"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </div>
          <div v-else class="d-flex align-center justify-center">
            <p class="text-grey">No Chats Found</p>
          </div>
          <div class="fab-container">
            <v-fab
              icon="mdi-message-plus"
              color="primary"
              @click="openNewChat"
            />
          </div>
        </div>
      </v-col>

      <!-- MESSAGE AREA -->
      <v-col
        cols="12"
        sm="7"
        md="8"
        v-show="selectedChat || !isMobile"
        class="chat-panel"
      >
        <!-- FALLBACK — shown on desktop when no chat selected -->
        <NoChatsSelected v-if="!selectedChat && !isMobile" />

        <!-- ACTUAL CHAT — shown when a chat is selected -->
        <template v-else-if="selectedChat">
          <!-- CHAT HEADER -->
          <v-toolbar flat class="px-1" color="primary">
            <v-btn icon class="mr-1" @click="goBackchatList">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div
              class="d-flex align-center cursor-pointer"
              @click="handleHeaderClick"
            >
              <v-avatar v-if="selectedChat.group_name" color="deep-purple">
                <v-icon color="white">mdi-account-group</v-icon>
              </v-avatar>
              <v-avatar v-else-if="getAvatarUrl(selectedChat)">
                <v-img :src="getAvatarUrl(selectedChat)" />
              </v-avatar>

              <!-- <v-avatar v-else :color="getAvatarColor(getChatName(selectedChat))">
              <span class="text-white font-weight-bold">
                {{ getInitials(getChatName(selectedChat)) }}
              </span>
            </v-avatar> -->
              <v-avatar v-else>
                <v-img :src="getHardcodedAvatar(selectedChat)" />
              </v-avatar>
              <div
                v-if="smAndDown"
                class="fontVariant4 ml-1"
                @click="selectedChat?.is_group && openGroupDrawer()"
              >
                {{ getChatName(selectedChat).slice(0, 8) + "..." }}
              </div>
              <div
                v-else
                class="ml-3 cursor-pointer fontVariant6"
                @click="selectedChat?.is_group && openGroupDrawer()"
              >
                {{ getChatName(selectedChat) }}
              </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>mdi-phone</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-video</v-icon></v-btn>
          </v-toolbar>
          <div
            v-if="loadingChats"
            class="w-100 d-flex align-center justify-center position-absolute"
            style="height: 100dvh"
          >
            <v-progress-circular
              :indeterminate="loadingChats"
            ></v-progress-circular>
          </div>

          <!-- MESSAGES -->

          <div class="messages" ref="messageContainer" @scroll="handleScroll">
            <div v-for="(msg, index) in messages" :key="msg.message_id">
              <!-- DATE SEPARATOR -->
              <div v-if="shouldShowDate(index)" class="date-separator">
                {{ formatMessageDate(msg.created_on) }}
              </div>

              <div
                :class="
                  msg.sender_id === currentUser?.user_id
                    ? 'msg-me'
                    : 'msg-other'
                "
              >
                <!-- SENDER INFO (GROUP ONLY) -->
                <div
                  v-if="
                    selectedChat.group_name &&
                    msg.sender_id !== currentUser?.user_id
                  "
                >
                  <span class="sender-name">
                    <v-icon size="12"> mdi-tilde </v-icon>
                    {{ msg.sender_username }}
                  </span>
                </div>

                <!-- MESSAGE -->
                <div class="msg-text d-flex align-center position-relative">
                  <span
                    v-if="msg.content === 'This message was deleted'"
                    class="text-grey"
                  >
                    🚫 This message was deleted
                  </span>

                  <span v-else>
                    {{ msg.content }}
                  </span>

                  <!-- MESSAGE MENU -->
                  <v-menu
                    v-if="msg.content !== 'This message was deleted'"
                    location="bottom end"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-chevron-down"
                        size="20"
                        variant="text"
                        v-bind="props"
                        class="msg-menu-btn"
                      />
                    </template>

                    <v-list density="compact" rounded="lg">
                      <v-container class="pa-1">
                        <!-- DELETE FOR ME -->
                        <v-list-item
                          rounded="pill"
                          @click="deleteMessageMethod(msg, false)"
                        >
                          <v-list-item-title> Delete for me </v-list-item-title>
                        </v-list-item>

                        <!-- DELETE FOR EVERYONE -->
                        <v-list-item
                          rounded="pill"
                          v-if="msg.sender_id === currentUser?.user_id"
                          @click="deleteMessageMethod(msg, true)"
                        >
                          <v-list-item-title>
                            Delete for everyone
                          </v-list-item-title>
                        </v-list-item>
                      </v-container>
                    </v-list>
                  </v-menu>
                </div>
                <div
                  v-if="
                    selectedChat?.is_group &&
                    msg.readBy?.length &&
                    msg.sender_id === currentUser?.user_id
                  "
                  class="text-caption text-grey"
                >
                  Read by:
                  {{ msg.readBy.map((u) => u.username).join(", ") }}
                </div>

                <!-- TIME -->
                <div class="msg-time d-flex align-center ga-1">
                  {{ formatTime(msg.timestamp || msg.created_on) }}

                  <v-icon
                    v-if="msg.sender_id === currentUser?.user_id"
                    size="14"
                    :color="msg.seen ? 'blue' : 'grey'"
                  >
                    {{ msg.seen ? "mdi-check-all" : "mdi-check" }}
                  </v-icon>

                  <span
                    v-if="
                      selectedChat?.is_group &&
                      msg.sender_id === currentUser?.user_id
                    "
                    class="ml-1"
                  >
                    {{ msg.readCount }}/{{ msg.totalMembers }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <v-fab
            v-if="showNewMessageButton"
            class="new-message-btn text-none"
            color="primary"
            @click="scrollToLatest"
            append-icon="mdi-arrow-down"
          >
            New Messages
          </v-fab>

          <!-- MESSAGE INPUT -->
          <v-divider></v-divider>
          <div class="chat-input pa-2 d-flex align-center ga-2 flex-nowrap">
            <v-btn size="40" icon>
              <v-icon>mdi-emoticon-outline</v-icon>
            </v-btn>
            <v-text-field
              ref="messageInput"
              v-model="newMessage"
              placeholder="Type a message"
              variant="solo"
              density="compact"
              hide-details
              class="flex-grow-1 chat-text"
              @keydown.enter.exact.prevent="SendMessageMethod"
            />
            <v-btn size="40" icon color="primary" @click="SendMessageMethod">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </div>
        </template>
      </v-col>
      <SnackbarComponent :snackbarComp="snackbarComp" />
      <RightNaviagtionDrawer
        v-model:groupDrawer="groupDrawer"
        :getGroupMemberArray="getGroupMemberArray"
        :selectedChat="selectedChat"
        @leave-group="openLeaveDialog"
        @open-add-members="AddMemberstoGroupDialogEmit = true"
        @remove-member="removeGroupMemberMethod"
        @open-edit-group="updateGroupDialogEmit = true"
      />
    </v-row>
    <ConfirmLeaveGroupDialog
      v-model="ConfirmLeaveGroupDialog"
      @confirm-leave="leaveGroupMethod"
    />
    <AddMemberstoGroupDialog
      v-model:AddMemberstoGroupDialogEmit="AddMemberstoGroupDialogEmit"
      :allUsers="allUsersList"
      :groupMembers="getGroupMemberArray"
      @add-members="addMemberstogroupMethod"
    />
    <UpdateGroupDialog
      v-model:updateGroupDialogEmit="updateGroupDialogEmit"
      :selectedChat="selectedChat"
      @update-group="updateGroupMethod"
    />
    <CreateGroupDialog
      v-model:CreateGroupDialogEmit="CreateGroupDialogEmit"
      :allUsers="allUsersList"
      @create-group="createGroupMethod"
    />
  </v-container>
</template>

<script>
import { leaveGroup, sendMessage } from "@/graphql/mutations";
import { getConversationsmixins } from "@/mixins/getConversations/getConversations";
import { getUserMessages } from "@/mixins/GetMessages/getUserMessages";
import { onMessageCreated } from "@/graphql/subscriptions";
import OpenNewChatDialog from "@/components/ChatsPageComponent/Dialog/OpenNewChatDialog.vue";
import { startConversation } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";
import { markConversationReadmixin } from "@/mixins/markConversationRead/markConversationRead";
import { onMessagesRead } from "@/graphql/subscriptions";
import img1 from "@/assets/1.png";
import img2 from "@/assets/2.png";
import img3 from "@/assets/5.png";
import img4 from "@/assets/6.png";
import formatTime from "@/mixins/Extras/formatTime";
import getInitials from "@/mixins/Extras/getInitials";
import getChatAvatar from "@/mixins/Extras/getChatAvatar";
import getHardcodedAvatar from "@/mixins/Extras/getHardcodedAvatar";
import formatMessageDate from "@/mixins/Extras/formatMessageDate";
import NoChatsSelected from "@/components/ChatsPageComponent/Cards/NoChatsSelected.vue";
import formatChatListTime from "@/mixins/Extras/formatChatListTime";
import RightNaviagtionDrawer from "@/components/ChatsPageComponent/Cards/RightNaviagtionDrawer.vue";
import { getGroupMembersmixin } from "@/mixins/getGroupMembers/getGroupMembers";
import ConfirmLeaveGroupDialog from "@/components/ChatsPageComponent/Dialog/ConfirmLeaveGroupDialog.vue";
import AddMemberstoGroupDialog from "@/components/ChatsPageComponent/Dialog/AddMemberstoGroupDialog.vue";
import { addGroupMembers } from "@/graphql/mutations";
import { getAllUsersmixins } from "@/mixins/GetAllUsers/getAllUsers";
import SnackbarComponent from "@/components/Extras/SnackbarComponent.vue";
import { removeGroupMember } from "@/graphql/mutations";
import UpdateGroupDialog from "@/components/ChatsPageComponent/Dialog/UpdateGroupDialog.vue";
import { updateGroup } from "@/graphql/mutations";
import CreateGroupDialog from "@/components/ChatsPageComponent/Dialog/CreateGroupDialog.vue";
import { createGroup } from "@/graphql/mutations";
import { deleteMessage } from "@/graphql/mutations";
import { onMessageDeleted } from "@/graphql/subscriptions";
import { uploadImages } from "@/mixins/UploadImagesTOS3/UploadImagestoS3";
import WebSocketNotifications from "@/components/ChatsPageComponent/Cards/WebSocketNotifications.vue";
const client = generateClient();
export default {
  components: {
    OpenNewChatDialog,
    NoChatsSelected,
    RightNaviagtionDrawer,
    ConfirmLeaveGroupDialog,
    AddMemberstoGroupDialog,
    UpdateGroupDialog,
    SnackbarComponent,
    CreateGroupDialog,
    WebSocketNotifications,
  },
  data() {
    return {
      selectedChat: null, // null on mobile initially
      leaveConversationId: null,
      isMobile: false,
      OpenNewChatDialogEmit: false,
      isNearBottom: true,
      showNewMessageButton: false,
      loadingChats: false,
      groupDrawer: false,
      ConfirmLeaveGroupDialog: false,
      AddMemberstoGroupDialogEmit: false,
      updateGroupDialogEmit: false,
      CreateGroupDialogEmit: false,
      newMessage: "",
      search: "",
      messageSubscriptions: {},
      subscriptionsMap: {},
      snackbarComp: {},
      avatarUrlCache: {},
      messagesInfiniteScroll:{
nextToken:null,
isFetchingMore:false,
hasMoreMessage:true
      },
      allUsersList: [],
      avatarHardCodedAvatar: [img1, img2, img3, img4],
    };
  },
  mixins: [
    getConversationsmixins,
    getUserMessages,
    markConversationReadmixin,
    getGroupMembersmixin,
    getAllUsersmixins,
    uploadImages,
  ],
  computed: {
    currentUserAvatar() {
      const key = this.$store.getters.currentUser?.avatar;
      if (!key || typeof key !== "string") return null;
      if (key.startsWith("http")) return key;
      return this.avatarUrlCache[key] || null;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
    filteredChats() {
      const list = this.usersList;
      if (!this.search) return list;

      return list.filter((chat) =>
        this.getChatName(chat)
          .toLowerCase()
          .includes(this.search.toLowerCase()),
      );
    },
  },
  async mounted() {
    try {
      console.log("mounted started");
      this.checkMobile();
      window.addEventListener("resize", this.checkMobile);
      await this.getConversationsMethod();
      await this.getAllUsersMethod(); // ⭐ THIS IS MISSING

      this.allUsersList = this.getAllUsersArray;
      for (const user of this.allUsersList) {
        const key = user.avatar;

        if (!key) continue;

        const url = await this.getUrlImagesMethod(key);

        this.avatarUrlCache = {
          ...this.avatarUrlCache,
          [key]: url,
        };
      }
      this.usersList = this.usersList.map((chat) => {
        let unread = 0;

        if (chat.is_group) {
          unread = chat.my_unread_count || 0;
        } else {
          if (chat.participantAId === this.currentUser.user_id) {
            unread = chat.unreadCountA || 0;
          } else {
            unread = chat.unreadCountB || 0;
          }
        }

        return {
          ...chat,
          unread,
        };
      });
      this.usersList.sort((a, b) => {
        return (b.last_message_at || 0) - (a.last_message_at || 0);
      });
      this.usersList.forEach((chat) => {
        this.subscribeToMessages(chat.conversation_id);
        this.subscribeToMessageRead(chat.conversation_id);
        this.subscribeToMessageDeleted(chat.conversation_id);
      });
    } catch (e) {
      console.error("mounted error", e);
      throw Error;
    }
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
    Object.values(this.messageSubscriptions).forEach((sub) => {
      sub.unsubscribe();
    });
  },

  methods: {
    async deleteMessageMethod(msg, deleteForEveryone) {
      try {
        await client.graphql({
          query: deleteMessage,
          variables: {
            input: {
              messageId: msg.message_id,
              conversationId: this.selectedChat.conversation_id,
              deleteForEveryone: deleteForEveryone,
            },
          },
        });

        if (deleteForEveryone) {
          /* replace message text */
          const index = this.messages.findIndex(
            (m) => m.message_id === msg.message_id,
          );

          if (index !== -1) {
            this.messages[index].content = "This message was deleted";
          }
        } else {
          /* delete only locally */
          this.messages = this.messages.filter(
            (m) => m.message_id !== msg.message_id,
          );
        }

        this.showSnackbar("success", "Message deleted");
      } catch (error) {
        console.error("Delete message error:", error);
        this.showSnackbar("error", "Failed to delete message");
      }
    },
    enrichMessages(messages, members) {
      if (!Array.isArray(members)) return messages;

      return messages.map((msg) => {
        const readers = members.filter(
          (m) =>
            m.user_id !== msg.sender_id &&
            m.last_read_at &&
            m.last_read_at >= msg.created_on,
        );

        const unread = members.filter(
          (m) =>
            m.user_id !== msg.sender_id &&
            (!m.last_read_at || m.last_read_at < msg.created_on),
        );

        const totalMembers = members.filter(
          (m) => m.user_id !== msg.sender_id,
        ).length;

        return {
          ...msg,
          readBy: readers,
          unreadBy: unread,
          readCount: readers.length,
          totalMembers,
          seen: readers.length === totalMembers,
        };
      });
    },
    async resolveAvatar(chat) {
      const key = this.getChatAvatar(chat);

      if (!key) return null;

      if (this.avatarUrlCache[key]) {
        return this.avatarUrlCache[key];
      }

      const url = await this.getUrlImagesMethod(key);

      this.avatarUrlCache[key] = url;

      return url;
    },
    getAvatarUrl(chat) {
      const userId =
        chat.participantAId === this.currentUser.user_id
          ? chat.participantBId
          : chat.participantAId;

      const user = this.allUsersList.find((u) => u.user_id === userId);

      if (!user || !user.avatar) return null;

      return this.avatarUrlCache[user.avatar] || null;
    },
    async createGroupMethod(data) {
      try {
        const result = await client.graphql({
          query: createGroup,
          variables: {
            input: {
              name: data.name,
              participantIds: data.participantIds,
              avatar: data.avatar,
            },
          },
        });

        const newGroup = result.data.createGroup;

        /* ⭐ add group to chat list instantly */

        this.usersList.unshift({ ...newGroup, unread: 0 });
        this.subscribeToMessages(newGroup.conversation_id);
        this.subscribeToMessageRead(newGroup.conversation_id);
        this.subscribeToMessageDeleted(newGroup.conversation_id);

        this.showSnackbar("success", "Group created");
      } catch (error) {
        console.error("Create group error:", error);

        this.showSnackbar("error", "Failed to create group");
      }
    },
    async updateGroupMethod(data) {
      try {
        await client.graphql({
          query: updateGroup,
          variables: {
            input: {
              conversationId: data.conversationId,
              name: data.name,
              avatar: data.avatar,
            },
          },
        });

        /* ⭐ Update selected chat */
        if (this.selectedChat?.conversation_id === data.conversationId) {
          this.selectedChat.group_name = data.name;
          this.selectedChat.group_avatar = data.avatar;
        }

        /* ⭐ Update chat list reactively */
        this.usersList = this.usersList.map((chat) => {
          if (chat.conversation_id === data.conversationId) {
            return {
              ...chat,
              group_name: data.name,
              group_avatar: data.avatar,
            };
          }
          return chat;
        });

        this.showSnackbar("success", "Group updated");
      } catch (error) {
        console.error(error);
        this.showSnackbar("error", "Update failed");
      }
    },
    async removeGroupMemberMethod(member) {
      try {
        const result = await client.graphql({
          query: removeGroupMember,
          variables: {
            input: {
              conversationId: this.selectedChat.conversation_id,
              userId: String(member.user_id),
            },
          },
        });

        console.log("User removed:", result);

        this.showSnackbar("success", "Member removed successfully");

        await this.getGroupMembersMethod(this.selectedChat.conversation_id);
      } catch (error) {
        console.error("Remove member error:", error);

        this.showSnackbar("error", "Failed to remove member");
      }
    },
    showSnackbar(color, message) {
      (this.snackbarComp.snackbarCompValue = true),
        (this.snackbarComp.color = color),
        (this.snackbarComp.message = message);
      setTimeout(() => {
        this.snackbarComp.snackbarCompValue = false;
      }, 1500);
    },
    async addMemberstogroupMethod(userIds) {
      try {
        const cleanUserIds = userIds.map((id) => String(id));
        const result = await client.graphql({
          query: addGroupMembers,
          variables: {
            input: {
              conversationId: this.selectedChat.conversation_id,
              userIds: cleanUserIds,
            },
          },
        });
        console.log("useradded successfully", result);
        this.showSnackbar("success", "Users added Successfully!");
        await this.getGroupMembersMethod(this.selectedChat.conversation_id);
        this.AddMemberstoGroupDialogEmit = false;
      } catch (error) {
        this.showSnackbar("error", error || "error while adding users");
        console.error("Add members error:", error);
      }
    },
    openLeaveDialog(conversationId) {
      this.leaveConversationId = conversationId;
      this.ConfirmLeaveGroupDialog = true;
    },
    async leaveGroupMethod() {
      try {
        await client.graphql({
          query: leaveGroup,
          variables: {
            input: {
              conversationId: this.leaveConversationId,
            },
          },
        });

        this.ConfirmLeaveGroupDialog = false;
        this.groupDrawer = false;

        this.usersList = this.usersList.filter(
          (chat) => chat.conversation_id !== this.leaveConversationId,
        );

        this.selectedChat = null;
        this.leaveConversationId = null;
        this.showSnackbar("success", "You left the group");
      } catch (error) {
        console.error("Leave group error:", error);
        this.showSnackbar("success", "You left the group");
      }
    },
    openGroupDrawer() {
      this.groupDrawer = true;
    },
    formatTime,
    getInitials,
    getChatAvatar,
    getHardcodedAvatar,
    formatMessageDate,
    formatChatListTime,
    shouldShowDate(index) {
      if (index === 0) return true;

      const current = new Date(
        this.messages[index].timestamp || this.messages[index].created_on,
      ).toDateString();
      const prev = new Date(
        this.messages[index - 1].timestamp ||
          this.messages[index - 1].created_on,
      ).toDateString();

      return current !== prev;
    },
    scrollToLatest() {
      this.scrollToBottom();

      this.showNewMessageButton = false;
      this.isNearBottom = true;
    },
    handleScroll() {
      const el = this.$refs.messageContainer;
      if (!el) return;

      const threshold = 120;

      const position = el.scrollHeight - el.scrollTop - el.clientHeight;

      this.isNearBottom = position < threshold;

      if (this.isNearBottom) {
        this.showNewMessageButton = false;
      }
    },
    async createConversation(user) {
      // check if conversation already exists
      const existingChat = this.usersList.find(
        (chat) =>
          chat.participantAId === user.user_id ||
          chat.participantBId === user.user_id,
      );

      // if exists → open it
      if (existingChat) {
        await this.selectChat(existingChat);
        this.OpenNewChatDialogEmit = false;
        return;
      }
      try {
        const result = await client.graphql({
          query: startConversation,
          variables: {
            input: {
              userId: user.user_id,
            },
          },
        });
        const newConversation = result.data.startConversation;
        console.log("🚀 ~ newConversation:", newConversation);
        // refetch conversations from server
        await this.getConversationsMethod();

        this.usersList.sort((a, b) => {
          return (b.last_message_at || 0) - (a.last_message_at || 0);
        });

        // ⭐ subscribe to any new conversations
        this.usersList.forEach((chat) => {
          this.subscribeToMessages(chat.conversation_id);
        });

        // find the new conversation
        const newChat = this.usersList.find(
          (c) =>
            c.participantAId === user.user_id ||
            c.participantBId === user.user_id,
        );

        if (newChat) {
          await this.selectChat(newChat);
        }

        // close dialog
        this.OpenNewChatDialogEmit = false;
      } catch (e) {
        console.log("🚀 ~ e:~ newConversation:", e);
      }
    },
    openNewChat() {
      this.OpenNewChatDialogEmit = true;
    },
    scrollToBottom() {
      const el = this.$refs.messageContainer;
      if (!el) return;

      el.scrollTop = el.scrollHeight;
    },
    subscribeToMessageDeleted(conversationId) {
      if (this.messageSubscriptions[`delete-${conversationId}`]) return;

      const sub = client
        .graphql({
          query: onMessageDeleted,
          variables: { conversationId },
        })
        .subscribe({
          next: (event) => {
            const payload =
              event?.value?.data?.onMessageDeleted ||
              event?.data?.onMessageDeleted;

            if (!payload) return;

            const index = this.messages.findIndex(
              (m) => m.message_id === payload.messageId,
            );

            if (index === -1) return;

            if (payload.deletedForEveryone) {
              this.messages[index].content = "This message was deleted";
            } else {
              this.messages.splice(index, 1);
            }
          },
          error: (error) => {
            console.error(
              "Delete subscription error:",
              JSON.stringify(error, null, 2),
            );
          },
        });

      this.messageSubscriptions[`delete-${conversationId}`] = sub;
    },
    subscribeToMessages(conversationId) {
      if (!conversationId) return;

      if (this.messageSubscriptions[conversationId]) return;

      const subscription = client
        .graphql({
          query: onMessageCreated,
          variables: {
            conversationId: conversationId,
          },
        })
        .subscribe({
          next: (event) => {
            const payload =
              event?.value?.data?.onMessageCreated ||
              event?.data?.onMessageCreated;

            if (!payload) return;

            const conversationId = payload.conversation_id;

            // update open chat
            if (conversationId === this.selectedChat?.conversation_id) {
              const enriched =
                this.selectedChat?.is_group && this.getGroupMemberArray
                  ? this.enrichMessages([payload], this.getGroupMemberArray)[0]
                  : payload;
              this.messages.push(enriched);
              // mark as read instantly if message is from other user
              if (payload.sender_id !== this.currentUser.user_id) {
                this.markConversationReadMethod(conversationId);
              }
              setTimeout(() => {
                if (this.isNearBottom) {
                  this.scrollToBottom();
                } else {
                  this.showNewMessageButton = true;
                }
              });
            }

            // update chat list
            const chatIndex = this.usersList.findIndex(
              (c) => c.conversation_id === conversationId,
            );

            if (chatIndex !== -1) {
              const chat = this.usersList[chatIndex];

              chat.last_message = payload.content;
              chat.last_message_at = payload.created_on;

              if (
                conversationId !== this.selectedChat?.conversation_id &&
                payload.sender_id !== this.currentUser.user_id
              ) {
                chat.unread = (chat.unread || 0) + 1;
              }

              const updatedChat = this.usersList.splice(chatIndex, 1)[0];
              this.usersList.unshift(updatedChat);
            }
          },
        });

      this.messageSubscriptions[conversationId] = subscription;
    },
    subscribeToMessageRead(conversationId) {
      client
        .graphql({
          query: onMessagesRead,
          variables: { conversationId },
        })
        .subscribe({
          next: async (event) => {
            const payload =
              event?.value?.data?.onMessagesRead || event?.data?.onMessagesRead;
            if (payload.readBy === this.currentUser.user_id) return;
            if (!this.selectedChat) return;
            if (payload.conversationId !== this.selectedChat.conversation_id)
              return;

            /* GROUP CHAT */
            if (this.selectedChat.is_group) {
              await this.getGroupMembersMethod(conversationId);

              if (this.getGroupMemberArray) {
                this.messages = this.enrichMessages(
                  this.messages,
                  this.getGroupMemberArray,
                );
              }
            } else {
         await this.markConversationReadMethod(this.selectedChat.conversation_id);
            /* ONE TO ONE CHAT */
              this.messages = this.messages.map((msg) => {
                if (msg.sender_id === this.currentUser.user_id) {
                  return {
                    ...msg,
                    seen: true,
                  };
                }

                return msg;
              });
            }
          },
        });
    },
    async SendMessageMethod() {
      if (!this.newMessage.trim()) return;

      try {
        const messageText = this.newMessage;

        const result = await client.graphql({
          query: sendMessage,
          variables: {
            input: {
              conversationId: this.selectedChat.conversation_id,
              content: messageText,
            },
          },
        });

        const message = result.data.sendMessage;

        this.newMessage = "";

        // update last message in chat list
        const chatIndex = this.usersList.findIndex(
          (c) => c.conversation_id === message.conversation_id,
        );

        if (chatIndex !== -1) {
          this.usersList[chatIndex].last_message = message.content;
          this.usersList[chatIndex].last_message_at = message.created_on;

          // move conversation to top
          const updatedChat = this.usersList.splice(chatIndex, 1)[0];
          this.usersList.unshift(updatedChat);
        }
        setTimeout(() => {
          this.scrollToBottom();
        });
      } catch (e) {
        console.error("Send message error:", e);
      }
    },
    // getAvatarColor(name) {
    //   if(!name) return ""
    //   const colors = ["red", "blue", "green", "purple", "orange", "teal"];

    //   let hash = 0;
    //   for (let i = 0; i < name.length; i++) {
    //     hash = name.charCodeAt(i) + ((hash << 5) - hash);
    //   }

    //   return colors[Math.abs(hash) % colors.length];
    // },
    getChatName(chat) {
      if (!chat || !this.currentUser) return "";
      if (chat.group_name) {
        return chat.group_name;
      }
      return chat.participantAId === this.currentUser.user_id
        ? chat.participantBUsername
        : chat.participantAUsername;
    },
    checkMobile() {
      this.isMobile = this.$vuetify.display.xs;
      // Auto-select on desktop if none selected
    },
    async selectChat(chat) {
      this.loadingChats = true;
      this.groupDrawer = false;
      this.selectedChat = chat;
      
      await this.getUserMessagesMethod(chat.conversation_id);
      if (
        chat.last_message_sender_id !== this.currentUser.user_id &&
        chat.unread > 0
      ) {
        await this.markConversationReadMethod(chat.conversation_id);
      }
chat.unread = 0;
      if (chat.is_group) {
        await this.getGroupMembersMethod(chat.conversation_id);

        this.messages = this.enrichMessages(
          this.messages,
          this.getGroupMemberArray,
        );
      } else {
        this.messages = this.messages.map((msg) => {
          if (msg.sender_id === this.currentUser.user_id) {
            return {
              ...msg,
              seen: msg.seen || false,
            };
          }

          return msg;
        });
         
      }
      setTimeout(() => {
        this.scrollToBottom();
        const input = this.$refs.messageInput;
        if (input && input.focus) {
          input.focus();
        }
      });
      this.loadingChats = false;
    },
    goBackchatList() {
      this.selectedChat = null;
    },
  },
};
</script>

<style scoped>
.vlistbg {
  background: #f7f7f7;
}
.fill-height {
  height: 100dvh !important;
  max-height: 100dvh;
  overflow: hidden;
}

/* CHAT LIST */
.chat-list {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  position: relative;
  background: #f7f7f7;
}
.chat-list-scroll {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
}
/* MESSAGE PANEL */
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  
}

.messages {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 20px;
  background: #efeae2;
  min-height: 0;
  background-image: url("@/assets/diamondbgforchat.png");
}

.chat-input {
  background: #efeae2;
  border-top: 1px solid #ddd;
  flex-shrink: 0; /* prevents input from being squished */
  padding-bottom: env(safe-area-inset-bottom);
}

/* Bubbles */
.msg-me {
  background: #dcf8c6;
  padding: 8px 12px 4px 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  width: fit-content;
  max-width: 500px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  position: relative;
}
.msg-me::after {
  content: "";
  position: absolute;
  right: -6px;
  bottom: 10px;
  width: 0;
  height: 0;
  border-left: 8px solid #dcf8c6;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.msg-other {
  background: white;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 10px;
  width: fit-content;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.msg-other::after {
  content: "";
  position: absolute;
  left: -6px;
  bottom: 10px;
  width: 0;
  height: 0;
  border-right: 8px solid white;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.msg-text {
  word-break: break-word;
}

.msg-time {
  font-size: 10px;
  color: #666;
  align-self: flex-end;
}
.chat-text {
  min-width: 0;
}
.fab-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 5;
}
.msg-time {
  font-size: 10px;
  color: #666;
  margin-top: 4px;
  text-align: right;
}

.date-separator {
  text-align: center;
  margin: 12px 0;
  font-size: 12px;
  color: #555;
  background: #e5e5e5;
  padding: 4px 12px;
  border-radius: 10px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.new-message-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 5;
  animation: fabPulse 1.3s infinite;
}
@keyframes fabPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.chat-item {
  margin: 4px 8px;
  transition: background 0.2s ease;
  cursor: pointer;
}

/* Hover like WhatsApp */
.chat-item:hover {
  background: #e9ecef;
}

/* Active chat */
.chat-active {
  background: #e2e6ea;
}

.sender-name {
  font-size: 12px;
  font-weight: 600;
  color: #6b4eff;
}
.chat-time {
  font-size: 11px;
  color: #777;
  margin-bottom: 4px;
  position: absolute;
  top: 10px;
  right: 15px;
}
.msg-text {
  position: relative;
  padding-right: 30px; /* space for arrow */
}

.msg-menu-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* show arrow when hovering message */
.msg-text:hover .msg-menu-btn {
  opacity: 1;
}
</style>
