<template>
    <div class="layout-content">
        <div class="columns">
            <div class="column featured-column">
                <featured :message="lastMessage" v-if="lastMessage"></featured>
            </div>
            <div class="column is-one-quarter history-column">
                <h2 class="title">
                    {{ 'history.title'|translate }}
                </h2>
                <history :messages="messages" v-if="lastMessage"></history>

                <clock locale="en"></clock>
            </div>
        </div>
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


    .layout-content
        position: fixed
        width: 100%
        height: 100%

        .columns
            height: 100%

    .history-column
        background-color: #4fc08d
        height: 100%
        padding-top: 4vh

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
                if (!this.$store.state.message || !this.$store.state.message.id) {
                    return {
                        id: 0,
                        title: 'title',
                        subtitle: 'subtitle',
                        description: 'description',
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
