# WWU ACE Frontend

Please make sure that all dependencies are installed by running npm install in the `/frontend/` directory. The front end is currently being implemented with the Vue Javascript framework as a single page application. The files that directly affect what is displayed to the screen are the `App.vue` file and the files within the components folder. These two locations can be found in the path `/frontend/src`. `App.vue` is the parent component for the entire front end, containing component declarations and CSS. It is primarily responsible for controlling when various components are displayed during run time. In the case that a new component is added to the site it will need to be imported to `App.vue`. In the case that CSS needs to be adjusted for customization, adjustments should be made in App.vue

The files within the components folder are the components previously mentioned. `Home.vue` is the first component the user is shown. They are given a form that the user can input and run Axe from. `Loading.vue` is the next page that the user would likely see. It displays while Axe runs. Finally in most cases, the `Complete.vue` and `RestartAxe.vue` components will appear. These inform the user that Axe was run successfully and allows them to return to `Home.vue` to run a test again. In the case of an error, `Error.vue` and `RestartAxe.vue` components will appear. The details of the error should display and the user from here can return to `Home.vue` to try again.

In the case that more testing engines or testing criteria need to be added, the data given to the Axe Runner and/or Spider Runner will need to be adjusted. The variable `testForm` is the current data structure that is sent to the back end to run Axe. Any variables added to the form will need to be added here. These variables are filled in the html using input tags where the input is bound to said variable using Vue's v-model directive. Form requirements are checked in the runAxe function which runs when the "Run Axe" button is clicked. If this new variable is required for Axe to run, add a check to ensure that the variable was filled. If it was, move on the run Axe. Otherwise, push a message to the formError array to display the error to the screen.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

