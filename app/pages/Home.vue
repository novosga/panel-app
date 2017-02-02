<template>
    <div>
        <div style="display:none">
            <app-link href="#settings">
                <span class="icon">
                    <i class="fa fa-cog"></i>
                </span>
                Settings 
            </app-link>
        </div>
        
        <layout-loader></layout-loader>
    </div>
</template>

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