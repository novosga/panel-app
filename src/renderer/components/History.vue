<template>
  <div class="history">
    <div v-if="messages.length===0" class="empty">
      <p :style="{ 'color': fontColor }">
        {{ 'history.empty'|trans }}
      </p>
    </div>
    <div v-for="message in messages" class="message" :key="message.id">
      <span class="title" v-if="showMessageTitle" :style="{ 'color': fontColor }">
        {{ message.title }}
      </span>
      <span class="subtitle" v-if="showMessageSubtitle" :style="{ 'color': fontColor }">
        {{ message.subtitle }}
      </span>
      <span class="description" v-if="showMessageDescription" :style="{ 'color': fontColor }">
        {{ message.description }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'History',
  props: {
    messages: {
      required: true
    },
    fontColor: {
      type: String,
      default: '#000000'
    },
    showMessageTitle: {
      type: Boolean,
      default: true
    },
    showMessageSubtitle: {
      type: Boolean,
      default: true
    },
    showMessageDescription: {
      type: Boolean,
      default: false
    }
  }
}
</script>
