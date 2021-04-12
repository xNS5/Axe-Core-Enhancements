# Axe-Core-Enhancements

In a world designed for what’s considered the “average” person, people don’t stop and think about how the differently-abled will be affected by various design choices. This mentality unfortunately translates to the online world as well. Luckily there are a number of people in the world who are working hard to ensure that people of all abilities can use the internet. That’s where Axe comes in. Axe is an open source web accessibility tester which allows the user to test websites to check if they meet the Web Content Accessibility Guidelines (WCAG) -- a standardized set of rules that ensure a website is accessible to all people. Axe is a great tool, however it lacks certain abilities which would make the tool more effective.

This product is a wrapper of the axe-core accessibility tester. Currently no existing accessibility engine has the functionality to scan multiple pages of a website at a time. Once the engine returns results, it offers no means to export data or templated responses 

This project will expand on Axe-Core’s current capabilities to allow Wadke Consulting an easier way to test the accessibility of their clients webpages. The program will include the ability to test multiple pages and specify which level of criteria it meets based on Web Content Accessibility Guidelines. The results will then be exported to an interface where the user can edit or add in other violations. Each WCAG violation will have a template response. Once the user is satisfied with the results, the data can be exported to different formats like a PDF or CSV file.

As a stretch goal, the program will have the ability to test web pages with different accessibility engines. Another accessibility tester called “Crest” is being developed by VMware which offers some features that Axe-Core lacks. Crest has not yet been made public, so integration with this project will be on hold until it has been released.


# Features
* Spider the current website. (FE-01, 02, 03) 
* Export results to a GUI. (FE-06, 07)
* User friendly and accessible interface. (FE-07)
* Option to select WCAG levels. (FE-04)
* Option to manually enter results. (FE-07)
* Includes WCAG violations that require human testing (FE-05, 06)
* Option to export to a PDF or CSV (FE-08)
* Hosted in a cloud platform (FE-09, 11)

# Future Features
* Ensure the program is accessibility engine agnostic (FE-10)
