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
          <select name="engine" id="engine" v-model="testForm[0].engine">
            <option value="axecore"> Axe </option>
            <!--<option value="crest">Crest</option> Crest has not yet been released. Alternate engines can be added-->
          </select>
        </div>
        <div class="selectBrowser">
          <h2>Browser</h2>
          <!-- Browser choice drop down -->
          <label for="browser">Select a Web Browser: </label>
          <select name="browser" id="browser" v-model="testForm[0].browser">
            <option value="chrome">Google Chrome</option>
            <!--<option value="edge">Microsoft Edge</option> Can be added at a later time, not natively supported through Puppeteer -->
            <option value="firefox">Firefox</option>
          </select>
        </div>
        <div class="selectTest">
          <h2>Testing Criteria</h2>
          <!-- Check boxes for WCAG levels -->
          <div class="selectTEST.child.wcag">
            <h3>WCAG</h3>
            <input type="checkbox" id="wcagA" name="wcagA" v-model="testForm[0].criteria[0]">
            <label for="wcagA" class="container"> A </label>
            <input type="checkbox" id="wcagAA" name="wcagAA" v-model="testForm[0].criteria[1]">
            <label for="wcagAA"> AA </label>
<!--            <input type="checkbox" id="wcagAAA" name="wcagAAA" v-model="testForm[0].criteria[2]">-->
<!--            <label for="wcagAAA"> AAA </label>-->
<!--            TODO: implement features that search for WCAG SC for AAA-->
          </div>
          <div class="selectTEST.child.other">
            <h3>Other Criteria</h3>
            <input type="checkbox" id="best-practices" name="best-practices" v-model="testForm[0].criteria[3]">
            <label for="best-practices"> Best Practices </label>
            <input type="checkbox" id="section508" name="section508" v-model="testForm[0].criteria[4]">
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
          <div v-for="(page, index) in testForm[0].pages" v-bind:key="index" class="row">
            <label for="URL@{{index}}">
              <div class="addButton">
<!--              @TODO find a way to have additional url entries stacked + increase size of text box-->
                <input v-model="page.url" type="url" id="URL@{{index}}" name="URL@{{index}}" placeholder="enter url">
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
  </div>
</template>

<script>
export default {
  name:'Home',
  data(){
    return{
      error: [],
      testForm: [{
        engine:null,
        browser:null,
        // @TODO change testing criteria to a list of strings instead
        criteria:[false,false,false,false,false],
        pages: [
          {url: ''}
        ]
      }]
    }
  },
  methods: {
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
    },
    addTest() {
      this.testForm[0].pages.push({url: ''})
    },
    removeTest(index) {
      this.testForm[0].pages.splice(index, 1)
    }
  }
}
</script>