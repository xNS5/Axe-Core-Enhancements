<!-- TODO: 
  Add css for errors
  Put Run button bellow the rest of the form, centered on the page
  Put errors bellow the run button 
  Make the layout a grid box 
-->

<template>
  <div id="home" role="main">
    <h1>WWU Axe-Core Enhancements</h1>
    <div id="errors" v-if="error.length">
      <h2>Please correct the following errors</h2>
      <ul>
        <li v-for="e in error" v-bind:key="e.id">
          {{e}}
        </li>
      </ul>
    </div>
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
<<<<<<< HEAD
            <button v-on:click="runAxe"> Run Axe </button>
          </div>
          <div class="runButton">
            <button v-on:click="testFile"> Test File Download </button>
=======
          <button v-on:click="runAxe"> Run </button>
>>>>>>> afd0fb11b0dc412c726d544430c7bb01771ced90
          </div>
          <div v-for="(page, index) in testForm.urls" v-bind:key="index" class="row">
            <label for="URL@{{index}}">
              <div class="addButton">
<<<<<<< HEAD
<!--                @TODO find a way to have additional url entries stacked + increase size of text box-->
                <input class="row" v-model="page.url" type="text" id="URL@{{index}}" name="URL@{{index}}" placeholder="enter url">

                <button class="addTest" type="button" aria-label="add-icon" v-on:click="addTest">
                  <span class="icon"></span>
                </button>
              <button class="removeTest" type="button" v-on:click="removeTest(index)" v-if="index !== 0">
                <span class="icon"></span>
              </button>
=======
<!--              @TODO find a way to have additional url entries stacked + increase size of text box-->
                <input v-model="page.url" type="url" id="URL@{{index}}" name="URL@{{index}}" placeholder="enter url">
                <button class="addTest" type="button" aria-label="add-icon" v-on:click="addTest">
                  <span class="icon"></span>
                </button>
                <button class="removeTest" type="button" v-on:click="removeTest(index)" v-if="index !== 0">
                  <span class="icon"></span>
                </button>
>>>>>>> afd0fb11b0dc412c726d544430c7bb01771ced90
              </div>
            </label>
          </div>
        </div>
<<<<<<< HEAD
=======
      </div>
    </div>
  </div>
>>>>>>> afd0fb11b0dc412c726d544430c7bb01771ced90
</template>

<script>
import axios from "axios";

export default {
  name: 'WWU ACE',
  data(){
    return{
<<<<<<< HEAD
      testForm: {
=======
      error: [],
      testForm: [{
>>>>>>> afd0fb11b0dc412c726d544430c7bb01771ced90
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
<<<<<<< HEAD
    runAxe: function() {
      console.log(this.testForm);
      try{
        axios.post("http://localhost:1337/api/v1/axe-runner", this.testForm)
            .then((result) => console.log(result));
      }catch(e){
        alert(e.toString());
      }
    },
    testFile(){
      axios({
        url: 'http://localhost:1337/api/v1/get-file',
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.txt'); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
=======
    runAxe() {
      console.log("getAxe", this.testForm);
      this.error = [];
      if(!this.testForm[0].engine) {
        this.error.push("Engine is required")
      }
      if(!this.testForm[0].browser) {
        this.error.push("Browser is required")
      }
      var i;
      for(i = 0; i < this.testForm[0].pages.length; i++){
        if(this.testForm[0].pages[i].url == '') {
          this.error.push("All urls are required")
          break
        }
        try {
          new URL(this.testForm[0].pages[i].url);
        } catch(e) {
          this.error.push(this.testForm[0].pages[i].url  + " is an invalid URL");
        }
      }
      if(this.testForm[0].criteria[0] == false && this.testForm[0].criteria[1] == false) {
        this.error.push("At least 1 WCAG level is required")
      }
      if(this.error.length == 0) {
        this.$emit('loadAxe');
      }
>>>>>>> afd0fb11b0dc412c726d544430c7bb01771ced90
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