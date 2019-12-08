const http = require('http');
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const opn = require('opn');
const Agent = require('./agent');

const recvPort = process.argv[2] | 5000;

// if(!process.argv[2]){
//     console.log('args: (port)');
//     process.exit(-1);
// }

const app = express();
const mainAgent = new Agent(`127.0.0.1:${recvPort}`);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/articles', (request, response) => {
   response.send(mainAgent.getMyArticles());
});

app.get('/login', (request, response) => {
    response.render('pages/login');
    response.end();
});

app.get('/admin', (request, response) => {
    response.render('pages/admin', {
        myArticles: mainAgent.getMyArticles(),
        friendsAddresses: Object.keys(mainAgent.book.bookRecords),
        friends: mainAgent.getFriendsArticles(),
        book: mainAgent.book,
        myAddress: mainAgent.myAddress
    });
});

app.get('/add-article', (request, response) => {
    response.render('pages/add-article');
});

app.get('/public', (request, response) => {
    response.render('pages/public', {
        myArticles: mainAgent.getMyArticles(),
        friends: mainAgent.getFriendsArticles(),
        book: mainAgent.book,
        myAddress: mainAgent.myAddress
    });
});

app.get('/edit-my-info', (request, response) => {
    response.render('pages/edit-my-info', {
        profile: mainAgent.book.bookRecords[mainAgent.myAddress].profile
    });
});

app.get('/edit-my-info-request', (request, response) => {
    mainAgent.editMyInfo(url.parse(request.url, true).query);
    response.redirect('/admin');
});

app.get('/add-article-request', (request, response) => {
    mainAgent.addArticle(url.parse(request.url, true).query);
    response.redirect('/admin');
});

app.get('/delete-article-request', (request, response) => {
    mainAgent.delArticle(url.parse(request.url, true).query);
    response.redirect('/admin');
});

app.get('/delete-friend-request', (request, response) => {
    mainAgent.delFriend(url.parse(request.url, true).query);
    response.redirect('/admin');
});

app.get('/add-friend', (request, response) => {
    mainAgent.addFriend(url.parse(request.url, true).query);
});

app.post('/auth', (request, response) => {
    response.send(JSON.stringify({authkey: mainAgent.auth(request.body.password)}));
    response.end();
});

app.listen(recvPort, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${recvPort}`);
});

// opn('http://127.0.0.1:'+recvPort+'/');
