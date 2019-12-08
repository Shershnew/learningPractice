const http = require('http');
const fs = require('fs');

class Profile{
  constructor(){
    this.name = '';
    this.surname = '';
    this.patronymic = '';
    this.photo = '';
    this.about = '';
  }
}

class Article{
  constructor(text = ''){
    this.title = '';
    this.text = text;
    this.date = '';
    this.keywords = '';
  }
}

class BookRecord{
  constructor(address){
    this.address = address;
    this.profile = new Profile();
    this.articles = [];
  }
}

class Book{
  constructor(myAddress) {
    this.myAddress = myAddress;
    this.bookRecords = {};
    this.startInfo();
  }

  startInfo(){
    this.bookRecords = {};
    let bookRecords;
    try{
      bookRecords = JSON.parse(fs.readFileSync('data/bookRecords.json').toString());
      this.bookRecords = bookRecords;
      if(!this.bookRecords) {
        this.bookRecords = {};
      }
      if(!this.bookRecords[this.myAddress]){
        this.bookRecords[this.myAddress] = new BookRecord(this.myAddress);
      }
    } catch (e) {
      console.log('cannot read bookRecords.json');
      this.bookRecords[this.myAddress] = new BookRecord(this.myAddress);
    }
  }

  saveRecords(){
    fs.writeFileSync('data/bookRecords.json', JSON.stringify(this.bookRecords));
  }

  updateArticles = (address, articles) => {
    if(this.bookRecords[address]){
      this.bookRecords[address].articles = articles;
    } else {
      this.bookRecords[address] = new BookRecord(address);
      this.bookRecords[address].articles = articles;
    }
  };

}

class Agent{
  constructor(myAddress){
    this.myAddress = myAddress;
    this.book = new Book(this.myAddress);
    this.config = JSON.parse(fs.readFileSync('data/config.json').toString());
    setInterval(this.updateFriendsArticles, 5000);
  }

  addFriend(data){
    this.book.bookRecords[data.address] = new BookRecord(data.address);
    this.book.saveRecords();
  }

  delArticle(data){
    console.log('del article', data);
    this.book.bookRecords[this.myAddress].articles = this.book.bookRecords[this.myAddress].articles.filter((article) => (article.title !== data.title));
    this.book.saveRecords();
  }

  delFriend(data){
    console.log('del friend', data);
    delete this.book.bookRecords[data.address];
    this.book.saveRecords();
  }

  editMyInfo(data){
    console.log('edit my info', data);
    const profile = this.book.bookRecords[this.myAddress].profile;
    profile.name = data.name;
    profile.surname = data.surname;
    profile.patronymic = data.patronymic;
    profile.about = data.about;
    profile.photo = data.photo;
    this.book.saveRecords();
  }

  addArticle(article){
    const newArticle = new Article('');
    newArticle.text = article.text;
    newArticle.title = article.title;
    newArticle.date = new Date();
    this.book.bookRecords[this.myAddress].articles.push(newArticle);
    this.book.saveRecords();
  }

  updateFriendsArticles = () => {
    function getArticles(ip, insertResult) {
      console.log(ip);
      const options = {
        hostname: ip.split(':')[0],
        port: ip.split(':')[1],
        path: '/articles',
        method: 'GET'
      };

      if(ip.split(':').length === 2){
        const req = http.request(options, res => {
          res.on('data', d => {
            insertResult(ip, JSON.parse(d.toString()));
          });
        });

        req.on('error', error => {});
        req.end();
      }
    }

    Object.keys(this.book.bookRecords).forEach((address) => {
      if(address !== this.myAddress){
        getArticles(address, this.book.updateArticles);
      }
    });
  };

  getMyArticles(){
    return this.book.bookRecords[this.myAddress].articles;
  }

  getFriendsArticles(){
    return Object.values(this.book.bookRecords).filter(record => (record.address !== this.myAddress));
  }

  auth(password){
    if(this.config.password === password){
      return this.config.passkey;
    } else {
      return null;
    }
  }
}

module.exports = Agent;
