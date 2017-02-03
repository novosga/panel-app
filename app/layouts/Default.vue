<template>
    <div>
        <div class="columns">
            <div class="column">
                <featured :message="lastMessage" @blink="playAudio" v-if="lastMessage"></featured>
            </div>
            <div class="column is-one-quarter">
                <h2>History</h2>
                <history :messages="messages" v-if="messages"></history>
            </div>
        </div>

        <clock></clock>
    </div>
</template>

<style lang="sass">
    .featured-message
        text-align: center

        .title
            font-size: 40vh
            font-weight: bold

        .subtitle
            font-size: 10vh

        .description
            font-size: 10vh

    .history
        .message
            .title
                font-size: 8vh
                font-weight: bold

            .subtitle
                font-size: 4vh
                font-style: italic

    .clock
        position: fixed
        bottom: 5%
        right: 5%

        span
            font-size: 8vh

        span.hours
            font-weight: bold

        span.seconds
            font-style: italic
</style>

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
                return this.$store.state.history
            },
            lastMessage() {
                if (!this.$store.state.message.id) {
                    return {
                        id: 0,
                        message: '0000',
                        text: '-'
                    };
                }

                return this.$store.state.message
            }
        },
        methods: {
            playAudio() {
                audio.playAlert(this.$store.state.config.alert)
            }
        }
    }
</script>
