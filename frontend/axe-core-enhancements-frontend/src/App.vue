<template>
  <div id="App">
    <Home v-show="run" v-on:loadAxe="startLoading()" v-on:doneLoading="doneRunning()" v-on:resetAxe="reset()"/>
    <Loading v-show="load"/>
    <Complete v-show="complete" v-on:resetAxe="reset()"/>
  </div>
</template>

<script>
import Home from './components/Home'
import Loading from './components/Loading'
import Complete from './components/Complete'

export default {

  name: 'App',
  components: {
    Home,
    Loading,
    Complete
  },
  data() {
    return {
      run: true,
      load: false,
      complete: false
    }
  },
  methods: {
    startLoading() {
      this.run = false;
      this.load = true;
      this.complete = false;
    },
    doneRunning() {
      this.run = false;
      this.load = false;
      this.complete = true;
    }, 
    reset() {
      this.run = true;
      this.load = false;
      this.complete = false;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1{
  font-size: 40px;
}

h2{
  font-size: 30px;
}

label{
  font-size: 24px;
  padding: 2px;
}

input[type=checkbox]{
  -ms-transform: scale(1.5); /* IE */
  -moz-transform: scale(1.5); /* FF */
  -webkit-transform: scale(2); /* Safari and Chrome */
  -o-transform: scale(2); /* Opera */
  transform: scale(1.5);
  padding: 12px;
  vertical-align: center;
  position: relative;
  top: -4px;
}

.url{
  align-items: center;
  font-size: 20px;
  margin-top: 15px;
  grid-column: 1/3;
  grid-row: 1;
  float: left;
}

.depthInput{
  visibility: hidden;
  margin-top: 15px;
}

input[type=number]{
  width: 100px;
}

/*
TODO: Make a button somewhere which credits both of these artists? The icons are free to use as long as we credit them.
Trash Icon by <a href="https://freeicons.io/profile/3">freeicons</a> on <a href="https://freeicons.io">freeicons.io</a>
Add Icon by <a href="https://freeicons.io/profile/723">DotFix Technologies</a> on <a href="https://freeicons.io">freeicons.io</a>*/
.addTest span.icon{
  background: url("assets/icons/add.png") no-repeat center;
  float: left;
  width: 20px;
  height: 20px;
  background-size: 100% 100%;
  padding: 5px;
}

.removeTest span.icon{
  background: url("assets/icons/trash.png") no-repeat center;
  float: left;
  width: 20px;
  height: 20px;
  background-size: 140% 140%;
  padding: 5px;
}

.addTest{
  float: left;
  margin: 5px;
  border-radius: 5px;
  vertical-align: center;
  position: relative;
  padding: 0;
  top: 6px;
}

.removeTest{
  float: right;
  margin: 5px;
  border-radius: 5px;
  vertical-align: center;
  position: relative;
  padding: 0;
  top: 6px;
}

.runButton button, .restartButton button{
  font-size: 24px;
}

.spider-box {
  padding-left: 10px;
  padding-right: 20px;
}

/* For the Run Axe and Spider buttons/tickboxes */
.testbuttons div{
  display: inline;
}

select{
  font-size: 20px;
}

.column{
  display: inline-table;
  padding-right: 5%;
  padding-left: 5%;
  padding-top: 2%;
}

.row:after {
  content: "";
  display: table;
  clear: both;
}

.errorList{
  list-style-type: none; 
  padding: 0; 
  margin: 0; 
  font-size: 24px;
  padding: 2px;
}

/*.add div{*/
/*
/*}*/

/*.remove div{*/
/*
/*}*/

/*
    TODO: See how a border around the Test Engine, Browser selection, and criteria divs look. Maybe do something along the same lines for the Test Page div
*/
/*.div .selectBrowser .selectEngine .selectTest{*/
/*  border-style: solid;*/
/*  border-color: #001c20;*/
/*  border-width: 3px;*/
/*}*/

</style>
