<template>
    <a v-bind:href="href" v-on:click="click">
        <slot>
            Link
        </slot>
    </a>
</template>

<script>
    export default {
        name: 'Link',
        props: {
            href: {
                type: String,
                required: true
            }
        },
        methods: {
            click(evt) {
                const href = evt.target.href || '',
                        routeName = href.substring(href.indexOf('#') + 1)
                        
                this.$root.goto(routeName);
            }
        }
    }
</script>
