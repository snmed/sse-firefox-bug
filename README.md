# SSE Firefox Bug Example

Firefox will not reconnect to server, if it looses connection to server. Steps to reproduce:

1. Restore all npm packages with `npm install` 
2. Start server with `npm start`
3. Open a Firefox and a Chrome browser and navigate to `http://localhost:3001`
4. Send some messages
5. Stop server with `Ctrl+C`
6. Wait until following message in the Firefox browser has been printed:
```bash
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:3000/events. (Reason: CORS request did not succeed). Status code: (null).

Firefox can’t establish a connection to the server at http://localhost:3000/events. localhost:3001:90:24
```
7. Now start server again
8. Chrome will print message `connected`, but Firefox doesn't.

