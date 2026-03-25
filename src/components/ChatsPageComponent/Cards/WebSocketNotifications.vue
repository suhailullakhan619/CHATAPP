
<template>
  <v-menu v-model="showMenu" location="bottom end" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-badge
        :content="notificationCount"
        color="red"
        :model-value="notificationCount > 0"
      >
        <v-btn icon v-bind="props">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <v-card min-width="320" max-width="380">
      <v-toolbar flat density="compact" color="primary">
        <v-toolbar-title>Notifications</v-toolbar-title>
        <v-spacer />
        <v-btn variant="text" class="text-none" size="small" @click="markAllRead">
          Mark all read
        </v-btn>
      </v-toolbar>

      <v-progress-linear v-if="loading" indeterminate color="primary" />

      <v-list
        v-if="notifications.length"
        lines="two"
        max-height="400"
        style="overflow-y:auto"
      >
        <v-list-item
  v-for="notif in notifications"
  :key="notif.notification_id"
  :class="{ 'unread-notif': !notif.is_read }"
  @click="markRead(notif)"
>
  <template #prepend>
    <v-avatar :color="notif.is_read ? 'grey-lighten-2' : 'primary'" size="36">
      <v-icon :color="notif.is_read ? 'grey' : 'white'" size="18">
        mdi-bell
      </v-icon>
    </v-avatar>
  </template>

  <!-- ✅ show title as header, body as subtitle -->
  <v-list-item-title class="font-weight-medium">
    {{ notif.title || notif.type }}
  </v-list-item-title>

  <v-list-item-subtitle>
    {{ notif.body }}
  </v-list-item-subtitle>

  <template #append>
    <span class="text-caption text-grey">
      {{ formatTime(notif.created_on) }}
    </span>
  </template>
</v-list-item>
      </v-list>

      <div v-else-if="!loading" class="pa-4 text-center text-grey">
        No notifications
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import { fetchAuthSession } from "aws-amplify/auth"
import { generateClient } from "aws-amplify/api"
import { getNotifications } from "@/graphql/queries"
import { markNotificationRead } from "@/graphql/mutations"
import formatTime from "@/mixins/Extras/formatTime"

const client = generateClient()

export default {
  data() {
    return {
      socket: null,
      reconnectTimer: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      isUnmounting: false,
      notifications: [],
      showMenu: false,
      loading: false,
    }
  },

  computed: {
    notificationCount() {
      if (!Array.isArray(this.notifications)) return 0
      return this.notifications.filter(n => !n.is_read).length
    }
  },

  async mounted() {
    await this.fetchNotifications()
    this.connectWebSocket()
  },

  beforeUnmount() {
    this.isUnmounting = true
    clearTimeout(this.reconnectTimer)
    if (this.socket) this.socket.close(1000, "component unmounted")
  },

  methods: {
    formatTime,

    async fetchNotifications() {
      this.loading = true
      try {
        const result = await client.graphql({
          query: getNotifications,
          variables: { input: { unreadOnly: false, limit: 20 } }
        })
         const raw = result.data.getNotifications
         const res = typeof raw === 'string' ? JSON.parse(raw) : raw
    console.log("raw res:", res)                          // ✅ check shape
    console.log("res.data:", res?.data)                   // ✅ check array
    this.notifications = Array.isArray(res?.data) ? res.data : []
    console.log("notifications set:", this.notifications) // ✅ verify
      } catch (e) {
        console.error("Failed to fetch notifications", e)
        this.notifications = []
      } finally {
        this.loading = false
      }
    },

    async markRead(notif) {
  if (notif.is_read) return
  try {
    await client.graphql({
      query: markNotificationRead,
      variables: { input: { notificationId: notif.notification_id }}
    })
    const index = this.notifications.findIndex(
      n => n.notification_id === notif.notification_id
    )
    if (index !== -1) {
      // ✅ splice triggers Vue reactivity, direct index assignment does not
      this.notifications.splice(index, 1, { ...this.notifications[index], is_read: true })
    }
  } catch (e) {
    console.error("Failed to mark notification read", e)
  }
},

    async markAllRead() {
      const unread = this.notifications.filter(n => !n.is_read)
      await Promise.all(unread.map(n => this.markRead(n)))
    },
  async connectWebSocket() {
  if (this.isUnmounting) return
  if (this.reconnectAttempts >= this.maxReconnectAttempts) {
    console.warn("Max WebSocket reconnect attempts reached")
    return
  }

  try {
    const session = await fetchAuthSession({ forceRefresh: true })
    const token = session.tokens?.accessToken?.toString()
    if (!token) return

    const self = this  // ✅ use self like the working code

    // ✅ pass token in URL — no action needed on open
    const wsUrl = `wss://oqpqupn5de.execute-api.ap-south-1.amazonaws.com/prod?token=${token}`
    self.socket = new WebSocket(wsUrl)

    self.socket.onopen = function () {
      console.log("WebSocket Connected")
       self.reconnectAttempts = 0
console.log('sending subscription messages')
  self.socket.send(JSON.stringify({
    action: "subscribeNotifications"
  }))
  console.log('clg after send function')
     
      // ✅ NO send() here — backend pushes automatically on connect
    }

    self.socket.onmessage = async function (event) {
        console.log("WEBSOCKET MESSAGE RECEIVED:", event.data)
      try {
        const data = JSON.parse(event.data)
        console.log("🔔 PARSED:", data)
          await self.fetchNotifications()
        // ✅ match the command pattern like the working code

        // switch (data.command || data.type) {
        //   case "NEW_MESSAGE":
        //   case "NOTIFICATION":
        //   case "notification":
        //     await self.fetchNotifications()
        //     break
        //   default:
        //     console.log("Unhandled WS command:", data.command || data.type)
        //     break
        // }
        console.log('clg after onmessage function')
      } catch (e) {
        console.error("Failed to parse WS message", e)
      }
    }

    self.socket.onclose = function (event) {
      console.log("WebSocket Disconnected", event.code)
      if (self.isUnmounting) return
      if ([1000, 4001, 4003].includes(event.code)) return

      self.reconnectAttempts++
      const delay = Math.min(1000 * 2 ** self.reconnectAttempts, 30000)
      console.log(`Reconnecting in ${delay}ms (attempt ${self.reconnectAttempts})`)
      self.reconnectTimer = setTimeout(() => self.connectWebSocket(), delay)
    }

    self.socket.onerror = function (error) {
      console.error("WebSocket Error", error)
    }

  } catch (e) {
    console.error("WebSocket setup failed", e)
  }
},
  }
}
</script>

<style scoped>
.unread-notif {
  background: #f0f7ff;
  border-left: 3px solid #1976d2;
}
</style>