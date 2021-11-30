<template>
    <div class="restartButton">
        <button v-on:click="testAgain"> Test More Pages </button>
    </div>
</template>

<script>
export default {
    name: 'Restart',
    methods: {
        testAgain() {
            this.$emit('resetAxe');
        }
    }
}
</script>