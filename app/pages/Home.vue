<template>
    <div class="home">
        <div class="menu">
            <app-link href="#settings">
                <span class="icon">
                    <i class="fa fa-cog"></i>
                </span>
                {{ 'menu.settings'|translate }}
            </app-link>
        </div>
        
        <layout-loader></layout-loader>
    </div>
</template>

<style lang="sass">
    .home
        .menu
            position: fixed
            top: 2vh
            left: 2vw
            background-color: rgba(0,0,0,.5)
            padding: 10px
            border-radius: 8px
            opacity: 0
            z-index: 100

            &:hover
                opacity: 1
                transition: opacity 0.2s ease-in-out;
                background-color: rgba(0,0,0,1)

            a
                color: #ffffff

</style>

<script>
    import AppLink from '../components/Link.vue'
    import LayoutLoader from '../components/Layout.vue'
    
    export default {
        name: 'Home',
        components: {
            AppLink,
            LayoutLoader
        },
    }
</script>