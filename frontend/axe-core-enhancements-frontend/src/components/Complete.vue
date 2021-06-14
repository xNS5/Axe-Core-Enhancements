<template>
    <div class="complete">
        <h1>Run Complete</h1>
        <div class="restartButton">
            <button v-on:click="testAgain"> Test More Pages </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Complete',
    methods: {
        testAgain() {
            this.$emit('resetAxe');
        }
    }
}
</script>
