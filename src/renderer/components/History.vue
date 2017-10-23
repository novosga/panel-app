<template>
    <div class="history">
        <div v-if="history.length===0" class="empty">
            <p>{{ 'history.empty'|translate }}</p>
        </div>
        <div v-for="message in history" class="message">
            <span class="title" v-if="showMessageTitle">
                {{ message.title }}
            </span>
            <span class="subtitle" v-if="showMessageSubtitle">
                {{ message.subtitle }}
            </span>
            <span class="description" v-if="showMessageDescription">
                {{ message.description }}
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
            },
            showMessageTitle: {
                type: Boolean,
                default: true
            },
            showMessageSubtitle: {
                type: Boolean,
                default: true
            },
            showMessageDescription: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            history() {
                return this.messages//.reverse().slice(0, 5)
            }
        }
    }
</script>
