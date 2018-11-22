<template>
  <div class="clock">
    <div class="date" v-if="showDate">
      <span :style="{ 'color': fontColor }">{{formattedDate}}</span>
    </div>
    <div class="time">
      <span class="hours" v-if="showHours" :style="{ 'color': fontColor }">
        {{ hours }}
      </span>
      <span class="separator" v-if="showMinutes" :style="{ 'color': fontColor }">:</span>
      <span class="minutes" v-if="showMinutes" :style="{ 'color': fontColor }">
        {{ minutes }}
      </span>
      <span class="separator" v-if="showSeconds" :style="{ 'color': fontColor }">:</span>
      <span class="seconds" v-if="showSeconds" :style="{ 'color': fontColor }">
        {{ seconds }}
      </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Clock',
  data () {
    return {
      date: new Date()
    }
  },
  props: {
    showHours: {
      type: Boolean,
      default: true
    },
    showMinutes: {
      type: Boolean,
      default: true
    },
    showSeconds: {
      type: Boolean,
      default: true
    },
    showDate: {
      type: Boolean,
      default: true
    },
    dateFormat: {
      type: String,
      default: 'MMMM Do YYYY'
    },
    locale: {
      type: String,
      default: 'en'
    },
    fontColor: {
      type: String,
      default: '#000000'
    }
  },
  computed: {
    hours () {
      return moment(this.date).format('HH')
    },
    minutes () {
      return moment(this.date).format('mm')
    },
    seconds () {
      return moment(this.date).format('ss')
    },
    formattedDate () {
      return moment(this.date).format(this.dateFormat)
    }
  },
  created () {
    moment.locale(this.locale)
    setInterval(() => { this.date = new Date() }, 1000)
  }
}
</script>
