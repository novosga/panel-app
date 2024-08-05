<template>
  <div class="history">
    <div v-if="messages.length===0" class="empty">
      <p :style="{ 'color': fontColorNormal }">
        {{ 'history.empty'|trans }}
      </p>
    </div>
    <div v-for="message in messages" class="message" :key="message.id">
      <span class="title" v-if="showMessageTitle" :style="{ 'color': fontColor(message) }">
        {{ message.title }}
      </span>
      <span class="subtitle" v-if="showMessageSubtitle" :style="{ 'color': fontColor(message) }">
        {{ message.subtitle }}
      </span>
      <span class="description" v-if="showMessageDescription" :style="{ 'color': fontColor(message) }">
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
    fontColorNormal: {
      type: String,
      default: '#000000'
    },
    fontColorPriority: {
      type: String,
      default: '#FF0000'
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
  },
  methods: {
    fontColor (message) {
      const peso = message.$data ? message.$data.peso : 0
      return peso > 0 ? this.fontColorPriority : this.fontColorNormal
    }
  }
}
</script>
