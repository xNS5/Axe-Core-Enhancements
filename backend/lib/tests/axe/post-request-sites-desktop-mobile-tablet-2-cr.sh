#/bin/bash
curl -H "Content-Type: application/json" --request POST --data '{ "engine": "axecore", "browser": "chrome", "a3": "false","wcagLevel": [ "wcag2", "wcag21" ], "criteria": [ "a", "aa" ], "resolution": [ "desktop", "mobile", "tablet" ], "urls": [{ "url": "https://primebellingham.com" },{ "url": "https://bellingham.com" }]}' http://localhost:1337/api/v1/axe/axe-runner

