<template>
    <div class="clock">
        <div class="date" v-if="showDate">
            <span>{{formattedDate}}</span>
        </div>
        <div class="time">
            <span class="hours" v-if="showHours">
                {{ hours }}
            </span>
            <span class="separator" v-if="showMinutes">:</span>
            <span class="minutes" v-if="showMinutes">
                {{ minutes }}
            </span>
            <span class="separator" v-if="showSeconds">:</span>
            <span class="seconds" v-if="showSeconds">
                {{ seconds }}
            </span>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    
    export default {
        name: 'Clock',
        data() {
            return {
                date: new Date()
            }
        },
        props: {
            showHours: {
                type: Boolean,
                default: true,
            },
            showMinutes: {
                type: Boolean,
                default: true,
            },
            showSeconds: {
                type: Boolean,
                default: true,
            },
            showDate: {
                type: Boolean,
                default: true,  
            },
            dateFormat: {
                type: String,
                default: 'MMMM Do YYYY',  
            },
            locale: {
                type: String,
                default: 'en'
            }
        },
        computed: {
            hours() {
                return moment(this.date).format('HH')
            },
            minutes() {return moment(this.date).format('mm')
            },
            seconds() {
                return moment(this.date).format('ss')
            },
            formattedDate() {
                return moment(this.date).format(this.dateFormat)
            }
        },
        created() {
            moment.locale(this.locale)
            setInterval(() => this.date = new Date(), 1000)
        }
    }
</script>