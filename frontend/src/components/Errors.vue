<template>
    <div class="errors">
        <h2>Error</h2>
        <ul class="errorList">
        <li v-for="e in error" v-bind:key="e.id">
          {{e}}
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                error: []
            }
        },
        methods: {
            addError(message = '') {
                this.error.push(message);
            },
            clearErrors() {
                this.error = [];
            }
        }
    }
</script>
