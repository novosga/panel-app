<template>
    <div class="layout-content">
        <div class="columns is-gapless">
            <div class="column is-multiline featured-column">
                <header class="column">
                    <featured :message="lastMessage" v-if="lastMessage" @blink="playAudio"></featured>
                </header>
                <footer class="column">
                    <img src="static/images/logo.png">
                </footer>
            </div>
            <div class="column is-one-quarter history-column">
                <div>
                    <h2 class="title">
                        {{ 'history.title'|translate }}
                    </h2>
                    <history :messages="messages" v-if="lastMessage"></history>

                    <clock locale="en"></clock>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Clock from '../components/Clock.vue'
    import Featured from '../components/Featured.vue'
    import History from '../components/History.vue'
    import audio from '../services/audio'

    export default {
        name: 'Default',
        components: {
            Clock,
            Featured,
            History
        },
        computed: {
            messages() {
                return this.$store.getters.history
            },
            lastMessage() {
                return this.$store.getters.message
            }
        },
        methods: {
            playAudio() {
                audio.playAlert(this.$store.state.config.alert)
            }
        }
    }
</script>

<style lang="sass">
    .layout-content
        position: fixed
        width: 100%
        height: 100%

        .columns
            height: 100%

    .clock
        position: fixed
        bottom: 4vh
        right: 3vw

        .time
            span
                font-size: 4vw

            span.hours
                font-weight: bold

            span.seconds
                font-style: italic

        .date
            text-align: right

            span
                font-size: 2vw
                font-weight: bold


    .featured-column
        header
            height: 80vh

        footer
            height: 20vh
            background-color: #f1f1f1
            padding: 5vh

            img
                height: 10vh

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
        background-color: #4fc08d
        height: 100vh

        >div
            padding: 4vh

        *
            color: #2c3e50

        .title
            text-align: center
            font-weight: bold

        .message
            background-color: transparent

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
