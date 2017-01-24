<template>
    <span class="time">{{time}}</span>
</template>

<script>
    import moment from 'moment';

    export default {
        props: {
            data: {required: true}
        },
        computed: {
            time(){
                if (this.data) {
                    let _moment = moment(this.data);
                    return _moment.format(`${_moment.year() !== moment().year() ? 'YYYY.' : ''}MM.DD HH:mm`);
                }
                else
                    return '';
            }
        }
    }
</script>