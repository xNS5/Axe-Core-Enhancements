#!/bin/bash
curl -H "Content-Type: application/json" --request POST --data '{ "engine": "axecore", "browser": "chrome", "a3": "false","wcagLevel": [ "wcag2", "wcag21" ], "criteria": [ "a", "aa" ], "resolution": [ "desktop", "mobile" ], "urls": [{ "url": "https://primebellingham.com" }]}' http://localhost:1337/api/v1/axe/axe-runner

