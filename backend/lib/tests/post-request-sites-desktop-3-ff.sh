#/bin/bash
curl -H "Content-Type: application/json" --request POST --data '{ "engine": "axecore", "browser": "firefox", "a3": "false","wcagLevel": [ "wcag2", "wcag21" ], "criteria": [ "a", "aa" ], "resolution": [ "desktop" ], "urls": [{ "url": "https://primebellingham.com" },{ "url": "https://mynoise.net/" },{ "url": "https://newbedev.com/python-selenium-selenium-common-exceptions-nosuchwindowexception-message-browsing-context-has-been-discarded" }]}' http://localhost:1337/api/v1/axe/axe-runner

