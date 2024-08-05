<template>
  <div class="container">
    <div class="columns is-mobile">
      <div class="column is-2-desktop is-3-tablet is-3-mobile">
        <aside class="menu">
          <img src="static/images/logo.png">

          <hr>

          <router-link to="/">
            <span class="icon">
              <i class="fa fa-chevron-left"></i>
            </span>
            {{ 'menu.go_back'|trans }}
          </router-link>

          <p class="menu-label">
            {{ 'menu.general'|trans }}
          </p>

          <ul class="menu-list">
            <li>
              <a @click="showTab('interface')" :class="{ 'is-active': (tab==='interface') }">
                {{ 'menu.interface'|trans }}
              </a>
            </li>
            <li>
              <a @click="showTab('server')" :class="{ 'is-active': (tab==='server') }">
                {{ 'menu.server'|trans }}
              </a>
            </li>
            <li>
              <a @click="showTab('services')" :class="{ 'is-active': (tab==='services') }" v-if="unities.length">
                {{ 'menu.services'|trans }}
              </a>
            </li>
            <li>
              <a @click="showTab('sound')" :class="{ 'is-active': (tab==='sound') }">
                {{ 'menu.sound'|trans }}
              </a>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column is-10-desktop is-9-tablet is-9-mobile">
        <div class="heading">
          <h1 class="title">
            {{ 'settings.title'|trans }}
          </h1>
          <h2 class="subtitle">
            {{ 'settings.subtitle'|trans }}
          </h2>
        </div>

        <hr>

        <form @submit.prevent="save" v-if="tab==='interface'">
          <div class="columns">
            <div class="column is-4">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.locale'|trans }}
                </label>
                <div class="control is-expanded has-icons-left">
                  <span class="select is-fullwidth">
                    <select v-model="config.locale">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="pt_BR">Português (Brasil)</option>
                    </select>
                  </span>
                  <span class="icon is-left">
                    <i class="fa fa-globe"></i>
                  </span>
                </div>
              </div>
            </div>
            <div class="column is-4">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.theme'|trans }}
                </label>
                <div class="control is-expanded has-icons-left">
                  <span class="select is-fullwidth">
                    <select v-model="config.theme" @change="changeTheme">
                      <option :value="theme.id" v-for="theme in themes" :key="theme.id">
                        {{ theme.name }}
                      </option>
                    </select>
                  </span>
                  <span class="icon is-left">
                    <i class="fa fa-paint-brush"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h3 class="title" v-if="selectedTheme && selectedTheme.options.length">{{ 'settings.interface.theme_options'| trans }}</h3>

          <div class="columns" v-if="selectedTheme && selectedTheme.options.length">
            <div class="column">
              <div class="field" v-for="option in selectedTheme.options" :key="option.name">
                <label class="label">
                  {{ option.label }}
                </label>
                <div class="control is-expanded">
                  <input :type="option.type" :placeholder="option.placeholder" v-model="config.themeOptions[option.name]" class="input is-medium">
                </div>
              </div>
            </div>
          </div>

          <h3 class="title">{{ 'settings.interface.colors'| trans }}</h3>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.page_bg_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.pageBgColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.page_font_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.pageFontColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.page_bg_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.pageBgColorPriority">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.page_font_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.pageFontColorPriority">
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.featured_font_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.featuredFontColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.featured_font_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.featuredFontColorPriority">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.history_font_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.historyFontColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.history_font_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.historyFontColorPriority">
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.sidebar_bg_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.sidebarBgColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.sidebar_font_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.sidebarFontColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.sidebar_bg_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.sidebarBgColorPriority">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.sidebar_font_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.sidebarFontColorPriority">
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.footer_bg_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.footerBgColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.footer_font_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.footerFontColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.footer_bg_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.footerBgColorPriority">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.footer_font_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.footerFontColorPriority">
                </div>
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.clock_bg_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.clockBgColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.clock_font_color_normal'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.clockFontColorNormal">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.clock_bg_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.clockBgColorPriority">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">
                  {{ 'settings.label.clock_font_color_priority'|trans }}
                </label>
                <div class="control">
                  <input class="input is-medium" type="text" placeholder="#000000" v-model="config.clockFontColorPriority">
                </div>
              </div>
            </div>
          </div>

          <hr>

          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <button type="submit" class="button is-primary is-large">
                {{ 'settings.btn.save'|trans }} &nbsp;
                <span class="icon is-small">
                  <i class="fa fa-save"></i>
                </span>
              </button>
            </div>
          </div>
        </form>

        <form @submit.prevent="save" v-if="tab==='server'">
          <div class="field">
            <label class="label">
              {{ 'settings.label.server'|trans }}
            </label>
            <div class="control">
              <input class="input is-medium" type="url" placeholder="https://" v-model="config.server" @change="changeServer">
            </div>
          </div>

          <div class="field">
            <label class="label">
              {{ 'settings.label.username'|trans }}
            </label>
            <div class="control">
              <input class="input is-medium" type="text" placeholder="" v-model="config.username">
            </div>
          </div>

          <div class="field">
            <label class="label">
              {{ 'settings.label.password'|trans }}
            </label>
            <div class="control">
              <input class="input is-medium" type="password" placeholder="" v-model="config.password">
            </div>
          </div>

          <div class="field">
            <label class="label">
              {{ 'settings.label.client_id'|trans }}
            </label>
            <div class="control">
              <input class="input is-medium" type="text" placeholder="" v-model="config.clientId">
            </div>
          </div>

          <div class="field">
            <label class="label">
              {{ 'settings.label.client_secret'|trans }}
            </label>
            <div class="control">
              <input class="input is-medium" type="password" placeholder="" v-model="config.clientSecret">
            </div>
          </div>

          <div class="field">
            <label class="label">
              {{ 'settings.label.retries'|trans }}
            </label>
            <div class="control">
              <input class="input is-medium" type="text" placeholder="" v-model="config.retries">
            </div>
          </div>

          <hr>

          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <button type="submit" class="button is-primary is-large">
                {{ 'settings.btn.save'|trans }} &nbsp;
                <span class="icon is-small">
                  <i class="fa fa-save"></i>
                </span>
              </button>
            </div>
          </div>
        </form>

        <form @submit.prevent="save" v-if="tab==='services'">
          <div class="field">
            <label class="label">
              {{ 'settings.label.unity'|trans }}
            </label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="config.unity" @change="loadServices">
                  <option></option>
                  <option v-for="unity in unities" :value="unity.id" :key="unity.id">
                    {{ unity.nome }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">
              {{ 'settings.label.services'|trans }}
            </label>
            <div class="control" v-for="service in services" :key="service.servico.id">
              <label class="checkbox">
                <input type="checkbox" :value="service.servico.id" v-model="config.services">
                {{service.sigla}} - {{service.servico.nome}}
              </label>
            </div>
            <div class="control" v-if="!services || !services.length">
              {{ 'settings.services.empty'|trans }}
            </div>
          </div>

          <hr>

          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <button type="submit" class="button is-primary is-large">
                {{ 'settings.btn.save'|trans }} &nbsp;
                <span class="icon is-small">
                  <i class="fa fa-save"></i>
                </span>
              </button>
            </div>
          </div>
        </form>

        <form @submit.prevent="save" v-if="tab==='sound'">
          <div class="field">
            <label class="label">
              {{ 'settings.label.alert'|trans }}
            </label>
            <div class="control has-addons">
              <div class="select">
                <select v-model="config.alert">
                  <option v-for="(i, alert) in alerts" :value="i" :key="i">
                    {{ alert }}
                  </option>
                </select>
              </div>
              <a class="button" title="Play">
                <span class="icon is-small" @click.prevent="testAlert">
                  <i class="fa fa-play"></i>
                </span>
              </a>
            </div>
          </div>
          <!--
          <div class="field">
            <div class="control has-addons">
              <label class="checkbox">
                <input type="checkbox" v-model="config.services">
                {{ 'settings.label.speech_enabled'|trans }}
              </label>
              <a class="button" title="Play">
                <span class="icon is-small" @click.prevent="testSpeech">
                  <i class="fa fa-play"></i>
                </span>
              </a>
            </div>
          </div>
          -->
          <hr>

          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <button type="submit" class="button is-primary is-large">
                {{ 'settings.btn.save'|trans }} &nbsp;
                <span class="icon is-small">
                  <i class="fa fa-save"></i>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import audio from '@/services/audio'
  import speech from '@/services/speech'
  import { log } from '@/util/functions'

  function load (ctx, isInit) {
    ctx.config = JSON.parse(JSON.stringify(ctx.$store.state.config))
    // defaults
    ctx.config.locale = ctx.config.locale || 'en'
    ctx.config.retries = ctx.config.retries || 5
    ctx.config.theme = ctx.config.theme || ctx.themes[0].id
    ctx.config.themeOptions = ctx.config.themeOptions || {}
    ctx.config.services = ctx.config.services || []
    ctx.config.alert = ctx.config.alert || audio.alertsAvailable.Default

    ctx.config.pageBgColorNormal = ctx.config.pageBgColorNormal || '#FFFFFF'
    ctx.config.pageFontColorNormal = ctx.config.pageFontColorNormal || '#000000'
    ctx.config.pageBgColorPriority = ctx.config.pageBgColorPriority || '#FFFFFF'
    ctx.config.pageFontColorPriority = ctx.config.pageFontColorPriority || '#FF0000'
    ctx.config.featuredFontColorNormal = ctx.config.featuredFontColorNormal || '#000000'
    ctx.config.featuredFontColorPriority = ctx.config.featuredFontColorPriority || '#FF0000'
    ctx.config.historyFontColorNormal = ctx.config.historyFontColorNormal || '#000000'
    ctx.config.historyFontColorPriority = ctx.config.historyFontColorPriority || '#FF0000'
    ctx.config.sidebarBgColorNormal = ctx.config.sidebarBgColorNormal || '#4FC08D'
    ctx.config.sidebarFontColorNormal = ctx.config.sidebarFontColorNormal || '#000000'
    ctx.config.sidebarBgColorPriority = ctx.config.sidebarBgColorPriority || '#4FC08D'
    ctx.config.sidebarFontColorPriority = ctx.config.sidebarFontColorPriority || '#000000'
    ctx.config.footerBgColorNormal = ctx.config.footerBgColorNormal || '#F1F1F1'
    ctx.config.footerFontColorNormal = ctx.config.footerFontColorNormal || '#000000'
    ctx.config.footerBgColorPriority = ctx.config.footerBgColorPriority || '#F1F1F1'
    ctx.config.footerFontColorPriority = ctx.config.footerFontColorPriority || '#000000'
    ctx.config.clockBgColorNormal = ctx.config.clockBgColorNormal || '#44A075'
    ctx.config.clockFontColorNormal = ctx.config.clockFontColorNormal || '#000000'
    ctx.config.clockBgColorPriority = ctx.config.clockBgColorPriority || '#44A075'
    ctx.config.clockFontColorPriority = ctx.config.clockFontColorPriority || '#000000'

    if (ctx.$store.getters.isAuthenticated) {
      const forceLoad = (
        isInit ||
        !ctx.unities ||
        ctx.unities.length === 0
      )

      ctx.fetchUnities = forceLoad
      ctx.fetchServices = forceLoad

      if (ctx.$store.getters.isExpired) {
        log('token expired, trying to refresh')

        ctx.$store.dispatch('token').then(() => {
          log('token refreshed successfully!')
          ctx.loadData()
        }, () => {
          log('error on refresh token')
        })
      } else {
        ctx.loadData()
      }
    }

    ctx.initialClientId = ctx.config.clientId
    ctx.initialClientSecret = ctx.config.initialClientSecret
    ctx.initialUsername = ctx.config.initialUsername
    ctx.initialPassword = ctx.config.initialPassword
  }

  export default {
    name: 'Settings',
    data () {
      return {
        tab: 'interface',
        config: {},
        initialClientId: null,
        initialClientSecret: null,
        initialUsername: null,
        initialPassword: null,
        fetchUnities: !this.unities,
        fetchServices: !this.services
      }
    },
    computed: {
      unities () {
        return this.$store.state.settings.unities
      },
      services () {
        return this.$store.state.settings.services
      },
      themes () {
        return this.$store.state.settings.availableThemes
      },
      selectedTheme () {
        return this.$store.getters.getTheme(this.config.theme)
      },
      alerts () {
        return audio.alertsAvailable
      },
      isCredentialChanged () {
        return (
          this.initialClientId !== this.config.clientId ||
          this.initialClientSecret !== this.config.initialClientSecret ||
          this.initialUsername !== this.config.initialUsername ||
          this.initialPassword !== this.config.initialPassword
        )
      }
    },
    methods: {
      showTab (tab) {
        this.tab = tab
      },
      changeTheme () {
        this.config.themeOptions = {}
      },
      changeServer () {
        this.config.unity = null
        this.fetchUnities = true
        this.fetchServices = false
      },
      loadData () {
        if (this.fetchUnities && this.config.server) {
          this.$store
            .dispatch('fetchUnities')
            .then(() => {}, (error) => {
              this.$swal('Oops!', error, 'error')
            })
          this.fetchUnities = false
        }

        if (this.fetchServices && this.config.unity) {
          this.$store.dispatch('fetchServices', this.config.unity)
          this.fetchServices = false
        }
      },
      loadServices () {
        this.$store.dispatch('fetchServices', this.config.unity)
      },
      save () {
        this.$store.dispatch('saveConfig', this.config)

        const token = (
          !this.$store.getters.isAuthenticated ||
          this.$store.getters.isExpired ||
          this.isCredentialChanged
        )

        let promise

        if (token) {
          promise = this.$store.dispatch('token')
        } else {
          promise = Promise.resolve()
        }

        promise.then(() => {
          this.$swal('Success', 'Configuration Ok', 'success')
          load(this, false)
        }, error => {
          this.$swal('Oops!', error, 'error')
        })
      },
      testAlert () {
        if (this.config.alert) {
          audio.playAlert(this.config.alert)
        }
      },
      testSpeech () {
        const lang = this.config.locale || 'pt-BR'
        log('Testing speech lang', lang)

        speech.speechAll([
          'Senha',
          '21',
          'mesa',
          '5'
        ], lang).then(() => {
          log('Testing end')
        }, (e) => {
          log('Testing error', e)
        })
      }
    },
    beforeMount () {
      load(this, true)
    }
  }
</script>

<style lang="sass">
  aside
    img
      width: 100%
      max-height: 60px
  .columns .column
    padding: 2rem
</style>
