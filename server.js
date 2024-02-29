// Based on code from: https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let clients = [];
let facts = [{msg: 'Connected'}];



function eventsHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
     

    const data = `data: ${JSON.stringify(facts)}\n\n`;
  
    
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
  }

  // ...

function sendEventsToAll(newFact) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
  }
  
  async function addFact(request, respsonse, next) {
    const newFact = request.body;
    facts.push(newFact);
    respsonse.json(newFact)
    return sendEventsToAll(newFact);
  }
  

  app.get('/status', (request, response) => response.json({clients: clients.length}));
  app.post('/fact', addFact);  
  app.get('/events', eventsHandler);



const PORTSTATIC = 3001;
const appStatic = express();
appStatic.use(express.static('wwwroot'));

appStatic.listen(PORTSTATIC, () => {
    console.log(`Static files service listening at http://localhost:${PORTSTATIC}`)
});

const PORT = 3000;



app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})