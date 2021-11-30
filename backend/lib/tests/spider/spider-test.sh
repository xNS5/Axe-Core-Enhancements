#!/bin/bash

curl -H "Content-Type: application/json" --request POST --data  '[{ "url": "https://wandke.com" }, { "depth": "0"}]' http://localhost:1337/api/v1/spider/spider-runner

