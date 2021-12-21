# Axe-Core-Enhancements

In a world designed for what’s considered the “average” person, people don’t stop and think about how the differently-abled will be affected by various design choices. This mentality unfortunately translates to the online world as well. Luckily there are a number of people in the world who are working hard to ensure that people of all abilities can use the internet. That’s where Axe comes in. Axe is an open source web accessibility tester which allows the user to test websites to check if they meet the Web Content Accessibility Guidelines (WCAG) -- a standardized set of rules that ensure a website is accessible to all people. Axe is a great tool, however it lacks certain abilities which would make the tool more effective.

# Project Purpose

This product is a wrapper of the Deque Labs' aXe accessibility API. Currently no existing accessibility engine has the functionality to scan multiple pages of a website at a time. Once the engine returns results, it offers no means to export data or templated responses 

This project will expand on the Axe Browser Extension's current capabilities to allow Wadke Consulting an easier way to test the accessibility of their clients webpages. The program will include the ability to test multiple pages and specify which level of criteria it meets based on Web Content Accessibility Guidelines. The results will then be exported to an interface where the user can edit or add in other violations. Each WCAG violation will have a template response. Once the user is satisfied with the results, the data can be exported to a CSV file. 

# System Requirements

* Node.js: >16.0
* Python: >3.9
* Firefox: v94
* Chrome: v96
* Optional: [Nodemon](https://www.npmjs.com/package/nodemon)

## Python Virtual Environment Directories
The spider relies on the host machine having Python installed and added as an environment variable, and either Python virtual environment directories. These directories are located in /lib/.  For Unix-based environments, it needs to be added to the .bashrc or .zshrc files. Please refer to [this page](https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/) for Unix environment variables and [this page](https://docs.oracle.com/en/database/oracle/machine-learning/oml4r/1.5.1/oread/creating-and-modifying-environment-variables-on-windows.html#GUID-DD6F9982-60D5-48F6-8270-A27EC53807D0) for Windows environment variables. Both directories have the Scrapy library already installed using pip.
If one wanted to add more functionality to both virtual environments, you’d need both a Unix machine and a Windows machine. To activate the Unix virtual environment, in the /lib/ directory, run the command `. nixenv/bin/activate`, and install the desired packages using pip. For a Windows environment, run in Powershell `. winenv/Scripts/activate`, and install the desired packages using pip. 


## For Windows 10 Computers

 Python for Windows is missing a few files which prevent the spider from running properly or installing Scrapy. Please follow these instructions to install them:
1. Check your installed python version. Powershell: `python --version`.
2. Determine what kind of CPU you have (Intel vs AMD)
3. Go to this [link and download](https://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml) the corresponding lxml file to your CPU architecture and python version.
4. Install the corresponding .whl file: `pip install [lxml file].whl`


# Features
* Spider the current website
* User friendly and accessible interface.
* Option to select WCAG levels.
* Includes WCAG violations that require human testing (e.g. color contrast, WCAG AAA violations)
* Export reuslts as a CSV


# Future Features
* Export results to a GUI
* Hosted in a cloud platform
* Ensure the program is accessibility engine agnostic
* Integrate more testing engines

# Usage

[Backend Usage](https://github.com/xNS5/Axe-Core-Enhancements/blob/main/backend/README.md)

[Frontend Usage](https://github.com/xNS5/Axe-Core-Enhancements/blob/main/frontend/README.md)
