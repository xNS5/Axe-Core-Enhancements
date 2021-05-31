<template>
  <div id="home" role="main">
    <h1>WWU Axe-Core Enhancements</h1>
    <div id="mainContainer" class="row">
      <div id="testSelection" class="column">
        <div class="selectEngine">
          <h2>Testing Engine</h2>
          <!-- Engine choice drop down -->
          <label for="engine">Accessibility Testing Engine: </label>
          <select name="engine" id="engine" v-model="testForm.engine">
            <option value="axecore"> Axe </option>
            <!--<option value="crest">Crest</option> Crest has not yet been released. Alternate engines can be added-->
          </select>
        </div>
        <div class="selectBrowser" id="select-browser">
          <h2>Browser</h2>
          <!-- Browser choice drop down -->
          <label for="browser">Select a Web Browser: </label>
          <select name="browser" id="browser" v-model="testForm.browser">
            <option value="chrome">Google Chrome</option>
            <!--<option value="edge">Microsoft Edge</option> Can be added at a later time, not natively supported through Puppeteer -->
            <option value="firefox">Firefox</option>
          </select>
        </div>
        <div class="selectTest">
          <h2>Testing Criteria</h2>
          <!-- Check boxes for WCAG levels -->
          <div class="selectTest.child.wcag" id="selectTest.child.wcag" >
            <div class="selectTest.child.wcag.version" id="selectTest.child.wcag.version">
              <h3>WCAG Version</h3>
<!--              TODO: Set up ability to add wcag2 and wcag21 to string output in model-->
                <input type="checkbox" id="wcag2" name="wcag2" value="wcag2" v-model="testForm.wcagLevel">
                <label for="wcag2" class="container"> WCAG 2.0 </label>
                <input type="checkbox" id="wcag21" name="wcag2" value="wcag21" v-model="testForm.wcagLevel">
                <label for="wcag21" class="container"> WCAG 2.1 </label>
              </div>
            </div>
            <h3>WCAG Levels</h3>
            <input type="checkbox" id="wcagA" name="wcagA" value="a" v-model="testForm.criteria">
            <label for="wcagA" class="container"> A </label>
            <input type="checkbox" id="wcagAA" name="wcagAA" value="aa" v-model="testForm.criteria">
            <label for="wcagAA"> AA </label>
<!--            <input type="checkbox" id="wcagAAA" name="wcagAAA" value="aaa" v-model="testForm[0].criteria[2]">-->
<!--            <label for="wcagAAA"> AAA </label>-->
<!--            TODO: implement features that search for WCAG SC for AAA                                         -->
          </div>
          <div class="selectTest.child.other" id="selectTest.child.other" >
            <h3>Other Criteria</h3>
            <input type="checkbox" id="best-practices" name="best-practices" value="best-practices" v-model="testForm.criteria">
            <label for="best-practices"> Best Practices </label>
            <input type="checkbox" id="section508" name="section508" value="section508" v-model="testForm.criteria">
            <label for="section508"> Section 508 </label>
          </div>
        </div>
      </div>
      <div id="selectURL" class="column">
        <div class="inputPages">
          <h2>Test Page</h2>
          <div class="runButton">
            <button v-on:click="runAxe"> Run </button>
          </div>
          <div v-for="(page, index) in testForm.urls" v-bind:key="index" class="row">
            <label for="URL@{{index}}">
              <div class="addButton">
<!--                @TODO find a way to have additional url entries stacked + increase size of text box-->
                <input class="row" v-model="page.url" type="text" id="URL@{{index}}" name="URL@{{index}}" placeholder="enter url">

                <button class="addTest" type="button" aria-label="add-icon" v-on:click="addTest">
                  <span class="icon"></span>
                </button>
              <button class="removeTest" type="button" v-on:click="removeTest(index)" v-if="index !== 0">
                <span class="icon"></span>
              </button>
              </div>
            </label>
            </div>

            </div>
          </div>
        </div>
</template>

<style>
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
}

input{
  vertical-align: center;
  position: relative;
  top: -4px;
}


/*
TODO: Make a button somewhere which credits both of these artists? The icons are free to use as long as we credit them.
Trash Icon by <a href="https://freeicons.io/profile/3">freeicons</a> on <a href="https://freeicons.io">freeicons.io</a>
Add Icon by <a href="https://freeicons.io/profile/723">DotFix Technologies</a> on <a href="https://freeicons.io">freeicons.io</a>*/
.addTest span.icon{
  background: url("../assets/icons/add.png") no-repeat center;
  vertical-align: middle;
  float: left;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background-size: 100% 100%;
}

.removeTest span.icon{
  background: url("../assets/icons/trash.png") no-repeat center;
  vertical-align: middle;
  float: left;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background-size: 140% 140%;
}

select{
  font-size: 20px;
}

.column {
  float: left;
  width: 50%;
}

.row:after {
  display: table;
}

/*TODO: See how a border around the Test Engine, Browser selection, and criteria divs look.
    Maybe do something along the same lines for the Test Page div*/
/*.div .selectBrowser .selectEngine .selectTest{*/
/*  border-style: solid;*/
/*  border-color: #001c20;*/
/*  border-width: 3px;*/
/*}*/

</style>


<script>
import axios from "axios";

export default {
  name: 'WWU ACE',
  data(){
    return{
      testForm: {
        engine:null,
        browser:null,
        // @TODO change testing criteria to a list of strings instead
        // wcagLevels:[false,false],
        // criteria:[false,false,false,false,false],
        wcagLevel: [],
        criteria: [],
        urls: [
          {url: ''}
        ]
      }
    }
  },
  methods: {
    runAxe: function() {
      console.log(this.testForm);
      try{
        axios.post("http://localhost:1337/api/v1/axe-runner", this.testForm)
            .then((result) => console.log(result));
      }catch(e){
        alert(e.toString());
      }
    },
    addTest() {
      this.testForm.pages.push({url: ''})
    },
    removeTest(index) {
      this.testForm.pages.splice(index, 1)
    }
  }
}
</script>