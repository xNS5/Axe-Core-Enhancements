<template>
  <div id="home" role="main">
    <div id="errors" v-if="formError.length">
      <h2>Please correct the following errors</h2>
      <ul class="errorList">
        <li v-for="e in formError" v-bind:key="e.id">
          {{e}}
        </li>
      </ul>
    </div>
    <div class="row">
      <div class="column">
        <div class="selectEngine">
          <h2>Testing Engine</h2>
          <!-- Engine choice drop down -->
          <label>Accessibility Testing Engine: </label>
          <select name="engine" id="engine" v-model="testForm.engine">
            <option value="axecore"> Axe </option>
            <!--<option value="crest">Crest</option> Crest has not yet been released. Alternate engines can be added-->
          </select>
        </div>
        <div class="selectBrowser">
          <h2>Browser</h2>
          <!-- Browser choice drop down -->
          <label>Select a Web Browser: </label>
          <select id="browser" v-model="testForm.browser">
            <option value="chrome">Google Chrome</option>
            <!--<option value="edge">Microsoft Edge</option> Can be added at a later time, not natively supported through Puppeteer -->
            <option value="firefox">Firefox</option>
          </select>
        </div>
        <div class="selectTest">
          <h2>Testing Criteria</h2>
          <!-- Check boxes for WCAG levels -->
            <span>
              <h3>WCAG Version</h3>
              <input type="checkbox" id="wcag2" name="wcag2" value="wcag2" v-model="testForm.wcagLevel">
              <label for="wcag2" class="container"> 2.0 </label>
              <input type="checkbox" id="wcag21" name="wcag2" value="wcag21" v-model="testForm.wcagLevel">
              <label for="wcag21" class="container"> 2.1 </label>
            </span>
          <h3>WCAG Levels</h3>
            <span>
              <input type="checkbox" id="wcagA" name="wcagA" value="a" v-model="testForm.criteria">
              <label for="wcagA" class="container"> A </label>
              <input type="checkbox" id="wcagAA" name="wcagAA" value="aa" v-model="testForm.criteria">
              <label for="wcagAA"> AA </label>
              <input type="checkbox" id="wcagAAA" name="wcagAAA" value="aaa" v-model="testForm.a3">
              <label for="wcagAAA"> AAA </label>
            </span>
        </div>
        <h3>Other Criteria</h3>
        <input type="checkbox" id="best-practices" name="best-practices" value="best-practices" v-model="testForm.criteria">
        <label for="best-practices"> Best Practices </label>
        <input type="checkbox" id="section508" name="section508" value="section508" v-model="testForm.criteria">
        <label for="section508"> Section 508 </label>
      </div>
      <div class="column urlWrapper">
        <div class="resolution">
          <h2>Resolutions</h2>
          <h3>Default: Desktop</h3>
          <input type="checkbox" id="mobile" value="mobile" v-model="testForm.resolution">
          <label for="mobile"> Mobile </label>
          <input type="checkbox" id="tablet" value="tablet" v-model="testForm.resolution">
          <label for="tablet"> Tablet </label>
          <input type="checkbox" id="desktop" value="desktop" v-model="testForm.resolution">
          <label for="desktop"> Desktop </label>
        </div>
        <h2>Test Page</h2>
        <div class="testbuttons">
          <span class="runButton">
            <button v-on:click="runAxe"> Run Ace </button>
          </span>
          <div class="spider-box">
            <input type="checkbox" id="spider-box" name="spider-checkbox" value="spider" v-model="this.spider" v-on:click="hideAddRemoveButtons">
            <label for="spider-box">Run Spider</label>
          </div>
        </div>
        <span class="row" v-for="(page, index) in testForm.urls" v-bind:key="index">
          <label :for="index">
            <input class="url" v-model="page.url" type="url" :id="index" :name="index" placeholder="https://www.example.com">
            <button class="addTest" id="addTest" type="button" aria-label="add-icon" v-on:click="addTest"><span class="icon"></span></button>
            <button class="removeTest" type="button" v-on:click="removeTest(index)" v-if="index !== 0"><span class="icon"></span></button>
          </label>
        </span>
        <div class="depthInput" id="depthInput">
          <label>Spider Depth: </label>
          <input class="spiderDepth" type="number" v-model="this.spiderDepth.depth" min="0" max="10" placeholder="1">
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
      formError: [],
      spider:false,
      spiderDepth: {
            depth: 10
      },
      testForm: {
        engine:null,
        browser:null,
        a3: false,
        wcagLevel: [],
        criteria: [],
        resolution: [],
        urls: [
          {url: ''}
        ]
      },
      timeout:300000, // # minute * 60 seconds/minute * 1000 milliseconds/second = Timeout Length 
                      // This length is currently set to 5 minutes
      timeoutID:0,
      runComplete:false,
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
      console.log("data", data);
      const d = new Date();
      const url = window.URL.createObjectURL(new Blob([data.map(e => e.join(","))], {type: 'text/csv;charset=utf-8;'}));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}-${d.getDate()}${((d.getUTCSeconds() + 11) % 12 + 1)}`+".csv"); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    runAxe() {
      this.runComplete = false;
      console.log("getAxe", this.testForm);
      this.formError = [];
      if(!this.testForm.engine) {
        this.formError.push("Engine is required")
      }
      if(!this.testForm.browser) {
        this.formError.push("Browser is required")
      }
      for(let i = 0; i < this.testForm.urls.length; i++){
        if(this.testForm.urls[i].url === '') {
          this.formError.push("All urls are required")
          break
        }
        try {
          new URL(this.testForm.urls[i].url);
        } catch(e) {
          this.formError.push(this.testForm.urls[i].url  + " is an invalid URL");
        }
      }
      if(this.testForm.wcagLevel.length === 0) {
        this.formError.push("At least 1 WCAG level is required")
      }
      if(this.spider && this.testForm.spiderDepth < 1) {
        this.formError.push("Spider Depth must be greater than 0");
      }
      if(this.formError.length === 0) {
        if(this.testForm.resolution.length === 0) {
          this.testForm.resolution.push("desktop");
        }
        this.$emit('loadAxe');
        try{
          if(this.spider){
            axios.post("http://localhost:1337/api/v1/spider/spider-runner/", [this.testForm.urls[0], this.spiderDepth]).then((result) => {
              this.testForm.urls = result.data['valid'];
            })
          }
          this.postAxe();
        }
        catch(e){
          this.$emit('doneLoading');
          this.$emit('resetAxe');
          this.$emit('displayError', e.toString());
          this.formError.push(e.toString());
        }
      }
    },
    postAxe(){
      axios.post("http://localhost:1337/api/v1/axe/axe-runner", this.testForm)
          .then((result) => {
            this.setRunComplete(true);
            this.timeoutID = setTimeout(this.setRunComplete, this.timeout);
            this.createFile("Axe", result.data);
            if(this.runComplete) {
              clearTimeout(this.timeoutID);
              this.$emit('doneLoading');
            }
            else {
              this.$emit('displayError', ["CSV creation request has timed out."]);
            }
            if(result.data['invalid'].length > 0){
              this.formError.push(`Invalid URLS: ${result.data['invalid']}`)
            }
          });
    },
    setRunComplete(){
      if(arguments.length === 0)
        this.runComplete = false;
      else  
        this.runComplete = arguments[0];
    },
    addTest() {
      this.testForm.urls.push({url: ''})
    },
    removeTest(index) {
      this.testForm.urls.splice(index, 1)
    },
    hideAddRemoveButtons(){
      document.getElementById("addTest").style.visibility = (this.spider === true) ? "visible" : "hidden";
      document.getElementById("depthInput").style.visibility = (this.spider === true) ? "hidden" : "visible";
      for(let i = this.testForm.urls.length-1; i > 0; i--){
        this.removeTest(i);
      }
    }
  }
}
</script>
