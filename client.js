const http = require('http');
const express = require('express');
const path = require('path');
const opn = require('opn');
const Agent = require('./agent');

const recvPort = process.argv[2];

if(!process.argv[2]){
    console.log('need port first arg');
    process.exit(-1);
}

const myAgent = new Agent();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.all('/myPage', (request, response) => {
    console.log(myAgent.getMyArticles());
    response.render('home', {
        myArticles: myAgent.getMyArticles(),
        friends: myAgent.getFriends()
    });
});

app.all('/article', (request, response) => {
   response.send(myAgent.getMyArticles());
});

app.listen(recvPort, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${recvPort}`)
});

opn('http://127.0.0.1:'+recvPort+'/myPage');

setInterval(() => {myAgent.updateFriendsArticles();}, 5000);
