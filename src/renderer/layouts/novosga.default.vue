<template>
  <div class="novosga-default layout-content" :style="{ 'background-color': color('pageBgColor'), 'color': color('pageFontColor') }">
    <div class="columns is-gapless">
      <div class="column is-multiline featured-column">
        <header class="column">
          <featured :message="lastMessage" v-if="lastMessage" @blink="playAudio" :fontColor="color('featuredFontColor', 'pageFontColor')"></featured>
        </header>
        <footer class="column" :style="{ 'background-color': color('footerBgColor'), 'color': color('footerFontColor') }">
          <img :src="logoUrl" class="is-pulled-left">
          <h1 class="is-pulled-left" v-if="config.themeOptions.footerText" :style="{ 'color': color('footerFontColor') }">
            {{ config.themeOptions.footerText }}
          </h1>
        </footer>
      </div>
      <div class="column is-one-quarter history-column" :style="{ 'background-color': color('sidebarBgColor'), 'color': color('sidebarFontColor') }">
        <header>
          <h2 class="title" :style="{ 'color': color('sidebarFontColor') }">
            {{ 'history.title'|trans }}
          </h2>
          <history
            v-if="lastMessage"
            :messages="messages"
            :fontColorNormal="config.historyFontColorNormal || config.sidebarFontColorNormal"
            :fontColorPriority="config.historyFontColorPriority || config.sidebarFontColorPriority">
          </history>
        </header>
        <footer :style="{ 'background-color': color('clockBgColor'), 'color': color('clockFontColor') }">
          <clock :locale="config.locale" :dateFormat="'date_format'|trans" :fontColor="color('clockFontColor')"></clock>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import Clock from '@/components/Clock.vue'
  import Featured from '@/components/Featured.vue'
  import History from '@/components/History.vue'
  import audio from '@/services/audio'

  export default {
    name: 'Default',
    components: {
      Clock,
      Featured,
      History
    },
    computed: {
      messages () {
        return this.$store.getters.history
      },
      lastMessage () {
        return this.$store.getters.message
      },
      config () {
        return this.$store.state.config
      },
      logoUrl () {
        return this.config.themeOptions.logo || 'static/images/logo.png'
      }
    },
    methods: {
      playAudio () {
        audio.playAlert(this.config.alert)
      },
      color (prefix, fallback) {
        const peso = this.lastMessage.$data ? this.lastMessage.$data.peso : 0
        const suffix = peso > 0 ? 'Priority' : 'Normal'
        return this.config[prefix + suffix] || this.config[fallback + suffix]
      }
    }
  }
</script>

<style lang="sass">
  .novosga-default
    .layout-content
      position: fixed
      width: 100%
      height: 100%
      .columns
        height: 100%

    .clock
      .time
        span
          font-size: 4vw
        span.hours
          font-weight: bold
        span.seconds
          font-style: italic
      .date
        text-align: center
        span
          font-size: 2vw
          font-weight: bold

    .featured-column
        >header
          height: 80vh
        >footer
          height: 20vh
          padding: 5vh
          img
            height: 10vh
          h1
            font-size: 5vh
            padding: 2vh 0 0 5vh
        .featured-message
          text-align: center
          .title
            font-size: 30vh
            font-weight: bold
          .subtitle
            font-size: 10vh
          .description
            font-size: 10vh

    .history-column
      height: 100vh
      >header
        height: 80vh
        padding: 1rem 0
      >footer
        height: 20vh
        padding: 1rem 0
        text-align: center
        background: rgba(0,0,0,.1)
      *
        color: #2c3e50
      .title
        text-align: center
        font-weight: bold
      .message
        background-color: transparent
        border-left: 8px solid rgba(0,0,0,.3)
        padding-left: 2rem
        margin-bottom: 1rem
      .empty
        p
          font-style: italic
          text-align: center
      .history
        .message
          span
            text-align: left
            display: block
          .title
            font-size: 8vh
            font-weight: bold
          .subtitle
            font-size: 4vh
            font-style: italic
</style>
