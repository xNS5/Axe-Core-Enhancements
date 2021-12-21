# Axe-Core-Enhancements

In a world designed for what’s considered the “average” person, people don’t stop and think about how the differently-abled will be affected by various design choices. This mentality unfortunately translates to the online world as well. Luckily there are a number of people in the world who are working hard to ensure that people of all abilities can use the internet. That’s where Axe comes in. Axe is an open source web accessibility tester which allows the user to test websites to check if they meet the Web Content Accessibility Guidelines (WCAG) -- a standardized set of rules that ensure a website is accessible to all people. Axe is a great tool, however it lacks certain abilities which would make the tool more effective.

# Project Purpose

This product is a wrapper of the Deque Labs' aXe accessibility API. Currently no existing accessibility engine has the functionality to scan multiple pages of a website at a time. Once the engine returns results, it offers no means to export data or templated responses 

This project will expand on the Axe Browser Extension's current capabilities to allow Wadke Consulting an easier way to test the accessibility of their clients webpages. The program will include the ability to test multiple pages and specify which level of criteria it meets based on Web Content Accessibility Guidelines. The results will then be exported to an interface where the user can edit or add in other violations. Each WCAG violation will have a template response. Once the user is satisfied with the results, the data can be exported to a CSV file. 


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
