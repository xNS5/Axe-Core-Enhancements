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
      <div id="select.url" class="column">
        <div class="inputPages">
          <h2>Test Page</h2>
          <div>
            <div class="runButton">
              <button v-on:click="runAxe"> Run Axe </button>
            </div>
            <div class="spider-box">
              <input type="checkbox" id="spider-box" name="spider-checkbox" value="spider" v-model="this.spider" v-on:click="hideAddRemoveButtons">
              <label for="spider-box">Run Spider</label>
            </div>
          </div>


          <div v-for="(page, index) in testForm.urls" v-bind:key="index" class="row">
            <label for="URL@{{index}}">
              <!--                @TODO find a way to have additional url entries stacked + increase size of text box-->
              <input class="row" v-model="page.url" type="url" id="URL@{{index}}" name="URL@{{index}}" placeholder="enter url">
              <div id="increase-decrease">
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
import axios from "axios";

export default {
  title: 'WWU ACE',
  metaInfo:{
    title: 'WWU ACE',
    htmlAttrs: {
      lang: 'en'
    }
  },
  data(){
    return{
      error: [],
      spider:false,
      testForm: {
        engine:null,
        browser:null,
        wcagLevel: [],
        criteria: [],
        urls: [
          {url: ''}
        ]
      }
    }
  },
  methods: {
    // testFile() {
    //   axios({
    //     url: 'http://localhost:1337/api/v1/get-file',
    //     method: 'GET',
    //     responseType: 'blob',
    //   }).then((response) => {
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'file.txt'); //or any other extension
    //     document.body.appendChild(link);
    //     link.click();
    //   });
    // },
    createFile(name, data){
      const d = new Date();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}-${d.getDate()}${((d.getHours() + 11) % 12 + 1)}`+".csv"); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    runAxe() {
      console.log("getAxe", this.testForm);
      this.error = [];
      if(!this.testForm.engine) {
        this.error.push("Engine is required")
      }
      if(!this.testForm.browser) {
        this.error.push("Browser is required")
      }
      for(let i = 0; i < this.testForm.urls.length; i++){
        if(this.testForm.urls[i].url === '') {
          this.error.push("All urls are required")
          break
        }
        try {
          new URL(this.testForm.urls[i].url);
        } catch(e) {
          this.error.push(this.testForm.urls[i].url  + " is an invalid URL");
        }
      }
      if(this.testForm.criteria[0] === false && this.testForm.criteria[1] === false) {
        this.error.push("At least 1 WCAG level is required")
      }
      if(this.error.length === 0) {
        this.$emit('loadAxe');
        try{
          if(this.spider){
            axios.post("http://localhost:1337/api/v1/spider/spider-runner/", this.testForm.urls[0].url).then((result) => {
              this.testForm.urls = result;
              axios.post("http://localhost:1337/api/v1/axe/axe-runner", this.testForm)
                  .then((result) => {
                    this.createFile("Axe", result.data);
                    // console.log(result.data);
                  });
            })
          } else {
            axios.post("http://localhost:1337/api/v1/axe/axe-runner", this.testForm)
                .then((result) => {
                  this.createFile("Axe", result.data);
                  // console.log(result.data);
                })
          }
        }catch(e){
          alert(e.toString());
        }
      }
    },
    addTest() {
      this.testForm.urls.push({url: ''})
    },
    removeTest(index) {
      this.testForm.urls.splice(index, 1)
    },
    hideAddRemoveButtons(){
      document.getElementById("increase-decrease").style.visibility = (this.spider === true) ? "visible" : "hidden";
     for(let i = this.testForm.urls.length-1; i > 0; i--){
       this.removeTest(i);
     }
    }
  }
}
</script>