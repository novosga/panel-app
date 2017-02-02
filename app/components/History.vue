<template>
    <div class="history">
        <div v-for="message in history" class="message">
            <span class="title">
                {{ message.title }}
            </span>
            <span class="subtitle">
                {{ message.subtitle }}
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
            }
        },
        computed: {
            history() {
                return this.messages.reverse().slice(0, 5)
            }
        }
    }
</script>