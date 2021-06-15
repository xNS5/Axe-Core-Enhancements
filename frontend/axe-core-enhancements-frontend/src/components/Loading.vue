<template>
    <div class="loading">
        <h1>Loading</h1>
        <div class="loadButton">
            <button v-on:click="doneLoading"> Done Loading </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    methods: {
        doneLoading() {
            this.$emit('doneLoading');
        }
    }
}
</script>
