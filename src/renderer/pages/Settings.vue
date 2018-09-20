<template>
  <div class="container">
    <div class="columns">
      <div class="column is-2-desktop is-3-tablet is-3-mobile column-menu">
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
              <a @click="showTab('interface')">
                {{ 'menu.interface'|trans }}
              </a>
            </li>
            <li>
              <a @click="showTab('server')">
                {{ 'menu.server'|trans }}
              </a>
            </li>
            <li>
              <a @click="showTab('services')">
                {{ 'menu.services'|trans }}
              </a>
            </li>
            <li>
              <a @click="showTab('sound')">
                {{ 'menu.sound'|trans }}
              </a>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
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
          <div class="field">
            <label class="label">
              {{ 'settings.label.locale'|trans }}
            </label>
            <div class="control">
              <div class="select">
                <select v-model="config.locale">
                  <option value="en">English</option>
                  <option value="pt_BR">Português (Brasil)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="control is-grouped">
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

          <div class="control is-grouped">
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
              <div class="select">
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

          <div class="control is-grouped">
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

          <!--div class="field">
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
          </div-->

          <div class="control is-grouped">
            <div class="control">
              <button type="submit" class="button is-primary is-large">
                Salvar &nbsp;
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

  function load(ctx) {
    ctx.config = JSON.parse(JSON.stringify(ctx.$store.state.config));
    // defaults
    ctx.config.locale   = ctx.config.locale || 'en'
    ctx.config.services = ctx.config.services || []
    ctx.config.alert    = ctx.config.alert || audio.alertsAvailable[0]

    if (ctx.config.server) {
      ctx.$store
        .dispatch('fetchUnities')
        .then(() => {}, (error) => {
          ctx.$swal("Oops!", error, "error")
        })
      ctx.fetchUnities = false
    }

    if (ctx.fetchServices && ctx.config.unity) {
      ctx.$store.dispatch('fetchServices', ctx.config.unity)
      ctx.fetchServices = false
    }

    ctx.initialClientId = ctx.config.clientId
    ctx.initialClientSecret = ctx.config.initialClientSecret
    ctx.initialUsername = ctx.config.initialUsername
    ctx.initialPassword = ctx.config.initialPassword
  }

  export default {
    name: 'Settings',
    data() {
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
      showTab(tab) {
        this.tab = tab
      },
      changeServer() {
        this.config.unity = null
        this.fetchUnities = true
        this.fetchServices = false
      },
      loadServices() {
        this.$store.dispatch('fetchServices', this.config.unity)
      },
      save() {
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
          this.$swal("Success", "Configuration Ok", "success")
          load(this)
        }, error => {
          this.$swal("Oops!", error, "error")
        })
      },
      testAlert() {
        if (this.config.alert) {
          audio.playAlert(this.config.alert)
        }
      },
      testSpeech() {
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
      load(this)
    }
  }
</script>

<style lang="sass">
  aside
    img
      height: 60px
  .columns .column
    padding: 2rem
</style>
