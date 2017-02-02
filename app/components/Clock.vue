<template>
    <div class="clock">
        <span class="hours">
            {{ hours }}
        </span>
        <span class="separator">:</span>
        <span class="minutes">
            {{ minutes }}
        </span>
        <span class="separator">:</span>
        <span class="seconds">
            {{ seconds }}
        </span>
    </div>
</template>

<script>
    function zeroFill(value) {
        return value < 10 ? '0' + value : value;
    }
    
    export default {
        name: 'Clock',
        data() {
            return {
                date: new Date()
            }
        },
        computed: {
            hours() {
                return zeroFill(this.date.getHours());
            },
            minutes() {
                return zeroFill(this.date.getMinutes());
            },
            seconds() {
                return zeroFill(this.date.getSeconds());
            },
        },
        created() {
            setInterval(() => this.date = new Date(), 1000)
        }
    }
</script>