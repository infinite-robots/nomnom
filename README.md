# NOMNOM!

Copy `src/settings.js.dist` to `src/settings.js` and enter your Yelp bearer token and Slack webhook URL.

`docker build -t nomnom .`

`docker run -p 8088:8088 -d nomnom`

Join our discord for more info: https://discord.gg/rUSdYxV

## Architecture 
This project has two repositories: 
1. The backend - you are here. 
2. The user-interface - https://github.com/infinite-robots/nomnom-ui 
