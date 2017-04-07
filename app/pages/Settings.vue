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
                            Settings
                        </h1>
                        <h2 class="subtitle">
                            Panel settings
                        </h2>
                    </div>

                    <form @submit.prevent="save" v-if="tab==='server'">
                        <label class="label">Server</label>
                        <p class="control">
                            <input class="input is-medium" type="url" placeholder="https://" v-model="config.server">
                        </p>

                        <label class="label">Username</label>
                        <p class="control">
                            <input class="input is-medium" type="text" placeholder="" v-model="config.username">
                        </p>

                        <label class="label">Password</label>
                        <p class="control">
                            <input class="input is-medium" type="password" placeholder="Text input" v-model="config.password">
                        </p>

                        <label class="label">Client ID</label>
                        <p class="control">
                            <input class="input is-medium" type="text" placeholder="" v-model="config.clientId">
                        </p>

                        <label class="label">Client Secret</label>
                        <p class="control">
                            <input class="input is-medium" type="password" placeholder="" v-model="config.clientSecret">
                        </p>
                        
                        <div class="control is-grouped">
                            <p class="control">
                                <button type="submit" class="button is-primary is-large">
                                    Salvar &nbsp;
                                    <span class="icon is-small">
                                        <i class="fa fa-save"></i>
                                    </span>
                                </button>
                            </p>
                        </div>
                    </form>

                    <form @submit.prevent="save" v-if="tab==='services'">
                        <label class="label">Unity</label>
                        <p class="control">
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
                        </p>

                        <label class="label">Services</label>
                        <p class="control" v-for="service in services">
                            <label class="checkbox">
                                <input type="checkbox" :value="service.servico.id" v-model="config.services">
                                {{service.servico.nome}}
                            </label>
                        </p>

                        <div class="control is-grouped">
                            <p class="control">
                                <button type="submit" class="button is-primary is-large">
                                    Salvar &nbsp;
                                    <span class="icon is-small">
                                        <i class="fa fa-save"></i>
                                    </span>
                                </button>
                            </p>
                        </div>
                    </form>

                    <form @submit.prevent="save" v-if="tab==='sound'">
                        <label class="label">Alert</label>
                        <p class="control has-addons">
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
                        </p>

                        <div class="control is-grouped">
                            <p class="control">
                                <button type="submit" class="button is-primary is-large">
                                    Salvar &nbsp;
                                    <span class="icon is-small">
                                        <i class="fa fa-save"></i>
                                    </span>
                                </button>
                            </p>
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
    
    function load(store) {
        store.dispatch('loadConfig')
        store.dispatch('fetchUnities')
        store.dispatch('fetchServices', store.state.config.unity)
    }

    export default {
        name: 'Settings',
        components: {
            AppLink
        },
        data() {
            return {
                tab: 'server',
            }
        },
        computed: {
            unities () {
                return this.$store.state.unities
            },
            services () {
                return this.$store.state.services
            },
            config () {
                const config = this.$store.state.config
                config.services = config.services || []
                
                return config
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
                load(this.$store)
            },
            testAlert() {
                if (this.config.alert) {
                    audio.playAlert(this.config.alert)
                }
            }
        },
        beforeMount () {
            load(this.$store)
        }
    }
</script>