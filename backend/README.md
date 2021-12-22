# WWU ACE Backend

The backend server uses SailsJS to run. To run the application, run the command sails lift. Alternatively, one can use the node package Nodemon to run the application by entering the command nodemon app.js in the backend directory. Before running, please make sure to install all dependencies by running npm install in the /backend/ directory.

**WARNING**: Currently the AxeController lacks the ability to rate limit how many browsers are run at a given time. If one were to run a crawl of a website and it returns 20+ URLs, the AxeController will attempt to run them all at the same time. This may result in a computer crashing if the user isn’t careful.


## AxeController.js

The axe controller takes the following parameters as input using a POST request:
1. Engine -- a string representing which accessibility engine is being used
2. Browser -- a string representing which browser the user wishes to use (Firefox or Chrome)
3. A3 -- a boolean value indicating the user wishes to ‘test’ for WCAG AAA violations
4. wcagLevel -- A JSON object indicating which WCAG version to use. 
5. Criteria -- A JSON object indicating which other criterion to use (e.g. Deque Best Practices, Section508, etc.)
6. Resolutions -- A JSON object indicating which screen resolutions the user wishes to test for (Mobile, Tablet, Desktop)
7. URLS -- the urls the user wishes to scan using Axe.

Returning:
CSV formatted accessibility scan data.

The controller will then parse the inputs, determine which browser to use based on the string input, and open n - n*\3 browser sessions in parallel for each URL and screen resolution chosen in an asynchronous Promise. After each URL is loaded using Selenium webdriver, it will adjust the screen size to match the desired screen resolution. Once the screen is adjusted, it will analyze the screen and close once finished -- returning a list of AxeResult objects. The documentation of the result objects can be found on the Deque Labs Axe API documentation website. 

If the user requested that level AAA checks be run on a page, the information will be pulled from the node package [wcag-reference-cjs](https://www.npmjs.com/package/wcag-reference-cjs) and will manually be added to each URL scanned. Axe itself tests for very few AAA-level WCAG violations, and the means to detect a violation in that category varies per system to the point where it would have to be reviewed by a human anyway Adding AAA violations to the Incomplete array in the AxeResult object will ultimately make it easier on a QA tester so they won’t have to reference W3C every time.

## SpiderController.js

The Spider controller takes in 2 parameters in a POST request:
1. URL -- Specifying a single page for the spider to scan for other related pages
2. Depth -- the number of levels the spider should inspect before returning URLS

Returning: 
A list of 2 arrays: 1 containing valid URLs, the other containing invalid.


The controller uses the node package python-shell to run a Scrapy python script located in `/lib/sitecrawler/`. To account for different users with different computers, two python virtual environments were created with Scrapy installed -- these virtual environments are referenced when running each web crawl. The Spider was a request made by the client to recursively search for URLs in `<a href=””/>` tags, and scan those. Once the Spider has found URLs, it prints to stdout which gets captured by the controller, and is subsequently returned to the frontend. The virtual environments are located in `/backend/lib/nixenv/` for unix-based operating systems and `/backend/lib/winenv` for windows operating systems.


## aceResult.js

This is a class that creates objects for each result. It takes in the following as parameters:
1. Title -- this is the title of the page that was scanned
2. Url -- the url of the page that was scanned
3. Dimensions -- the resolution of the web browser used for the accessibility scan
4. Violations -- an array containing the violations of an accessibility scan
5. Incomplete -- an array containing incomplete accessibility scans, i.e. a check that usually requires a human to complete, such as checking for color contrast.

Returning:
An AceResult object containing the aforementioned attributes

The aceResult.js file is located in /api/models/. Each attribute has corresponding getter functions. This class also parses the WCAG tags that come with each violation/incomplete node. The tag formats can be found on the Deque Labs Axe-Core Github API page. The rest of the tags are currently discarded, however one can uncomment sections of the code that relate to the rest of the accessibility tags if they’re deemed necessary.

## Python Virtual Environment Directories
The spider relies on the host machine having Python installed and added as an environment variable, and either Python virtual environment directories. These directories are located in /lib/.  For Unix-based environments, it needs to be added to the .bashrc or .zshrc files. Please refer to [this page](https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/) for Unix environment variables and [this page](https://docs.oracle.com/en/database/oracle/machine-learning/oml4r/1.5.1/oread/creating-and-modifying-environment-variables-on-windows.html#GUID-DD6F9982-60D5-48F6-8270-A27EC53807D0) for Windows environment variables. Both directories have the Scrapy library already installed using pip.
If one wanted to add more functionality to both virtual environments, you’d need both a Unix machine and a Windows machine. To activate the Unix virtual environment, in the /lib/ directory, run the command `. nixenv/bin/activate`, and install the desired packages using pip. For a Windows environment, run in Powershell `. winenv/Scripts/activate`, and install the desired packages using pip. 


### For Windows 10 Computers

 Python for Windows is missing a few files which prevent the spider from running properly or installing Scrapy. Please follow these instructions to install them:
1. Check your installed python version. Powershell: `python --version`.
2. Determine what kind of CPU you have (Intel vs AMD)
3. Go to this [link and download](https://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml) the corresponding lxml file to your CPU architecture and python version.
4. Install the corresponding .whl file: `pip install [lxml file].whl`

# Sails.js Configuration

## Controllers

For creating SailsJS controllers, please refer to the official [SailsJS Documentation](https://sailsjs.com/documentation/concepts/actions-and-controllers). Each controller must have a corresponding action function. Each action function must describe what inputs it expects, and the status responses.

## API Routes

API Route configuration is located in `/backend/config/routes.js`. Each API route needs to be configured as follows:

    '[HTTP Request] [API path]': {controller: [Controller Name], action: [Controller Action] }
    
For Example: 

    'POST /api/v1/axe/axe-runner': {controller: 'AxeController', action: 'runAxe'}
    
More information on SailsJS Routes can be viewed in the official [Sails.js Documentation](https://sailsjs.com/documentation/concepts/routes). 

