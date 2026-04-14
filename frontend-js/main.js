const Search = require('./modules/search');
const Chat = require('./modules/chat');

if (document.querySelector(".header-search-icon")) {
  new Search();
}

if (document.querySelector(".header-chat-icon")) {
  new Chat();
}