const http = require('http');

const startFriendsAddress = ['127.0.0.1:5001','127.0.0.1:5002','127.0.0.1:5003'];

class Article{
  constructor(text = ''){
    this.text = text;
  }
}

class Man{
  constructor(name){
    this.name = name;
    this.friendsAddress = [];
    this.articles = [];
  }
}

class Book{
  constructor() {
    this.mans = {};
    this.i = null;
  }

  startInfo(){
    startFriendsAddress.forEach((ip) => {
      let tempMane = new Man(ip);
      tempMane.friendsAddress = startFriendsAddress;
      tempMane.articles.push(new Article('some text article'));
      tempMane.articles.push(new Article('some text article2'));
      this.mans[ip] = tempMane;
    });

    this.i = new Man;
    this.i.articles.push(new Article('my article text'));
    this.i.articles.push(new Article('some other my article'));
  }

}

function getArticles(ip, result) {
    const options = {
        hostname: ip.split(':')[0],
        port: ip.split(':')[1],
        path: '/article',
        method: 'GET'
    };

    const req = http.request(options, res => {
        res.on('data', d => {
             result.articles = JSON.parse(d.toString());
        })
    });

    req.on('error', error => {
        // console.error(error);
    });

    req.end();

}

class Agent{
  constructor(){
    this.book = new Book();
    this.book.startInfo();
  }

  updateArticle(ip){
    getArticles(ip, this.book.mans[ip]);
  }

  updateFriendsArticles(){
    Object.keys(this.book.mans).forEach((ip) => {
      this.updateArticle(ip);
    });
  }

  getMyArticles(){
    return this.book.i.articles;
  }

  getFriends(){
    return Object.values(this.book.mans);
  }
}

module.exports = Agent;
