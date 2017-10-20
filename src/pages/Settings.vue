<template>
    <section class="section">
        <div class="container is-fluid">
            <div class="columns">
                <div class="column is-2-desktop is-3-tablet is-3-mobile">
                    <aside class="menu">
                        <app-link href="#">
                            <span class="icon">
                                <i class="fa fa-chevron-left"></i>
                            </span>
                            {{ 'menu.go_back'|translate }}
                        </app-link>

                        <p class="menu-label">
                            {{ 'menu.general'|translate }}
                        </p>

                        <ul class="menu-list">
                            <li>
                                <a @click="showTab('server')">
                                    {{ 'menu.server'|translate }}
                                </a>
                            </li>
                            <li>
                                <a @click="showTab('services')">
                                    {{ 'menu.services'|translate }}
                                </a>
                            </li>
                            <li>
                                <a @click="showTab('sound')">
                                    {{ 'menu.sound'|translate }}
                                </a>
                            </li>
                        </ul>
                    </aside>
                </div>
                <div class="column">
                    <div class="heading">
                        <h1 class="title">
                            {{ 'settings.title'|translate }}
                        </h1>
                        <h2 class="subtitle">
                            {{ 'settings.subtitle'|translate }}
                        </h2>
                    </div>

                    <form @submit.prevent="save" v-if="tab==='server'">
                        <div class="field">
                            <label class="label">
                                {{ 'settings.label.server'|translate }}
                            </label>
                            <div class="control">
                                <input class="input is-medium" type="url" placeholder="https://" v-model="config.server">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">
                                {{ 'settings.label.username'|translate }}
                            </label>
                            <div class="control">
                                <input class="input is-medium" type="text" placeholder="" v-model="config.username">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">
                                {{ 'settings.label.password'|translate }}
                            </label>
                            <div class="control">
                                <input class="input is-medium" type="password" placeholder="" v-model="config.password">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">
                                {{ 'settings.label.client_id'|translate }}
                            </label>
                            <div class="control">
                                <input class="input is-medium" type="text" placeholder="" v-model="config.clientId">
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">
                                {{ 'settings.label.client_secret'|translate }}
                            </label>
                            <div class="control">
                                <input class="input is-medium" type="password" placeholder="" v-model="config.clientSecret">
                            </div>
                        </div>

                        <div class="control is-grouped">
                            <div class="control">
                                <button type="submit" class="button is-primary is-large">
                                    {{ 'settings.btn.save'|translate }} &nbsp;
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
                                {{ 'settings.label.unity'|translate }}
                            </label>
                            <div class="control">
                                <div class="select">
                                    <select
                                        v-model="config.unity"
                                        @change="loadServices">
                                        <option></option>
                                        <option
                                            v-for="unity in unities"
                                            :value="unity.id">
                                            {{ unity.nome }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">
                                {{ 'settings.label.services'|translate }}
                            </label>
                            <div class="control" v-for="service in services">
                                <label class="checkbox">
                                    <input type="checkbox" :value="service.servico.id" v-model="config.services">
                                    {{service.servico.nome}}
                                </label>
                            </div>
                            <div class="control" v-if="!services || !services.length">
                                {{ 'settings.services.empty'|translate }}
                            </div>
                        </div>

                        <div class="control is-grouped">
                            <div class="control">
                                <button type="submit" class="button is-primary is-large">
                                    {{ 'settings.btn.save'|translate }} &nbsp;
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
                                {{ 'settings.label.alert'|translate }}
                            </label>
                            <div class="control has-addons">
                                <div class="select">
                                    <select
                                        v-model="config.alert">
                                        <option
                                            v-for="(i, alert) in alerts"
                                            :value="i">
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

                        <div class="field">
                            <div class="control has-addons">
                                <label class="checkbox">
                                    <input type="checkbox" v-model="config.services">
                                    {{ 'settings.label.speech_enabled'|translate }}
                                </label>
                                <a class="button" title="Play">
                                    <span class="icon is-small" @click.prevent="testSpeech">
                                        <i class="fa fa-play"></i>
                                    </span>
                                </a>
                            </div>
                        </div>

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
    </section>
</template>

<script>
    import AppLink from '../components/Link.vue'
    import audio from '../services/audio'
    import speech from '../services/speech'
    import { mapState } from 'vuex'

    function load(ctx) {
        ctx.config = JSON.parse(JSON.stringify(ctx.$store.state.config));
        // defaults
        ctx.config.services = ctx.config.services || []
        ctx.config.alert = ctx.config.alert || audio.alertsAvailable[0]

        ctx.$store.dispatch('fetchUnities')
            .then(() => {}, (e) => {
                let error = 'Unknown error'
                if (e) {
                    if (e.error_description) {
                        error = e.error_description
                    } else {
                        error = e
                    }
                }
                ctx.$swal("Oops!", error, "error")
            })

        if (ctx.config.unity) {
            ctx.$store.dispatch('fetchServices', ctx.config.unity)
        }
    }

    export default {
        name: 'Settings',
        components: {
            AppLink
        },
        data() {
            return {
                tab: 'server',
                config: {},
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
            }
        },
        methods: {
            showTab(tab) {
                this.tab = tab
            },
            loadServices() {
                this.$store.dispatch('fetchServices', this.config.unity)
            },
            save() {
                this.$store.dispatch('saveConfig', this.config)
                this.$store.dispatch('token').then(() => {
                    this.$swal("Success", "Configuration Ok", "success")
                    load(this)
                })
            },
            testAlert() {
                if (this.config.alert) {
                    audio.playAlert(this.config.alert)
                }
            },
            testSpeech() {
                const lang = this.config.locale || 'pt-BR'
                console.log('Testing speech lang', lang)

                speech.speechAll([
                    'Senha',
                    '21',
                    'mesa',
                    '5'
                ], lang).then(() => {
                    console.log('Testing end')
                }, (e) => {
                    console.log('Testing error', e)
                })
            }
        },
        beforeMount () {
            load(this)
        }
    }
</script>
