<template>
    <div id="home" role="main">
        <h1>Axe-core Enhancements</h1>
        <div id="test">
            <div class="selectEngine">
                <h2>Testing Engine</h2>
                <!-- Engine choice drop down -->
                <label for="engine">Choose a testing engine:</label>
                <select name="engine" id="engine" v-model="testForm.engine">
                    <option value="axecore">Axe-Core</option>
                    <option value="crest">Crest</option>
                </select>
            </div>
            <div class="selectBrowser">
                <h2>Browser</h2>
                <!-- Browser choice drop down -->
                <label for="browser">Choose a browser to test for:</label>
                <select name="browser" id="browser" v-model="testForm.browser">
                    <option value="chrome">Google Chrome</option>
                    <option value="edge">Microsoft Edge</option>
                    <option value="firefox">Firefox</option>
                </select>
            </div>
            <div class="selectWCAG">
                <h2>WCAG Level</h2>
                <!-- Check boxes for WCAG levels -->
                <input type="checkbox" id="wcagA" name="wcagA" v-model="testForm.wcag[0]">
                <label for="wcagA">A</label>
                <input type="checkbox" id="wcagAA" name="wcagAA" v-model="testForm.wcag[1]">
                <label for="wcagAA">AA</label>
                <input type="checkbox" id="wcagAAA" name="wcagAAA" v-model="testForm.wcag[2]">
                <label for="wcagAAA">AAA</label>
            </div>  
            <div class="inputPages">
                <h2>Test Page</h2>
                <div class="addButton">
                    <button class="addTest" type="button" v-on:click="addTest">Add New Test Page</button>
                </div>
                <div v-for="(page, index) in testForm.pages" :key="page.url">
                    <input v-model="page.url" type="text" id="URL@{{index}}" name="URL@{{index}}" placeholder="enter url">
                    <label for="URL@{{index}}"></label>
                    <button class="removeTest" type="button" v-on:click="removeTest(index)" v-if="index != 0">Remove Test Page</button>
                </div>
            </div>
        </div>   
        <div class="runButton">
            <button v-on:click="runAxe">Run</button>
        </div> 
    </div>
</template>


<script>
export default {
    name:'Home',
    data(){
        return{
            testForm: {
                engine:null,
                browser:null,
                wcag:[false,false,false],
                pages: [
                    {url: ''}
                ]
            }
        }
    },
    methods: {
        runAxe() {
            console.warn("getAxe", this.testForm);
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