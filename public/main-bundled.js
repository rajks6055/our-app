/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./frontend-js/main.js"
/*!*****************************!*\
  !*** ./frontend-js/main.js ***!
  \*****************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("{const Search = __webpack_require__(/*! ./modules/search */ \"./frontend-js/modules/search.js\");\nconst Chat = __webpack_require__(/*! ./modules/chat */ \"./frontend-js/modules/chat.js\");\nif (document.querySelector(\".header-search-icon\")) {\n  new Search();\n}\nif (document.querySelector(\".header-chat-icon\")) {\n  new Chat();\n}\n\n//# sourceURL=webpack://ourapp/./frontend-js/main.js?\n}");

/***/ },

/***/ "./frontend-js/modules/chat.js"
/*!*************************************!*\
  !*** ./frontend-js/modules/chat.js ***!
  \*************************************/
(module) {

eval("{module.exports = class Chat {\n  constructor() {\n    this.openedYet = false;\n    this.myUsername = \"Guest\";\n    this.myAvatar = \"https://gravatar.com/avatar/default?s=128\"; // Default fallback\n\n    this.openIcon = document.querySelector(\".header-chat-icon\");\n    this.injectHTML();\n    this.chatWrapper = document.querySelector(\"#chat-wrapper\");\n    this.closeIcon = document.querySelector(\".chat-title-bar-close\");\n    this.chatField = document.querySelector(\"#chatField\");\n    this.chatForm = document.querySelector(\"#chatForm\");\n    this.chatLog = document.querySelector(\"#chat\");\n    this.loadLocalHistory();\n    this.events();\n  }\n  events() {\n    this.openIcon.addEventListener(\"click\", e => {\n      e.preventDefault();\n      this.showChat();\n    });\n    this.closeIcon.addEventListener(\"click\", () => this.hideChat());\n    this.chatForm.addEventListener(\"submit\", e => {\n      e.preventDefault();\n      this.sendMessageToServer();\n    });\n  }\n  sendMessageToServer() {\n    let messageText = this.chatField.value;\n    if (!messageText.trim()) return;\n\n    // Bundle our exact user data with the message\n    let senderData = {\n      username: this.myUsername,\n      avatar: this.myAvatar\n    };\n    this.displayMessage(messageText, \"self\", senderData);\n    this.saveLocalHistory(messageText, \"self\", senderData);\n    this.socket.emit('chatMessageFromBrowser', {\n      message: messageText\n    });\n    this.chatLog.scrollTop = this.chatLog.scrollHeight;\n    this.chatField.value = '';\n    this.chatField.focus();\n  }\n  displayMessage(text, type, senderData) {\n    if (type === 'self') {\n      // UPGRADED SELF MESSAGE: Now includes your username and clickable profile!\n      this.chatLog.insertAdjacentHTML('beforeend', `\n        <div class=\"flex items-start mb-3 justify-end\">\n          <div class=\"bg-blue-600 text-white rounded-2xl px-3 py-1 mr-2 text-sm max-w-[75%] break-words shadow-sm flex flex-col items-end\">\n            <a href=\"/profile/${senderData.username}\" class=\"font-bold text-xs text-blue-200 hover:text-white hover:underline block mb-1 transition-colors\">\n              ${senderData.username}\n            </a>\n            <div class=\"chat-message-inner text-left w-full\">${text}</div>\n          </div>\n          <a href=\"/profile/${senderData.username}\">\n            <img class=\"w-6 h-6 rounded-full mt-1 hover:opacity-80 transition-opacity\" src=\"${senderData.avatar}\" alt=\"${senderData.username}\">\n          </a>\n        </div>\n      `);\n    } else if (type === 'other') {\n      // UPGRADED OTHER MESSAGE: Clickable profile links\n      this.chatLog.insertAdjacentHTML('beforeend', `\n        <div class=\"flex items-start mb-3 justify-start\">\n          <a href=\"/profile/${senderData.username}\">\n            <img class=\"w-6 h-6 rounded-full mr-2 mt-1 hover:opacity-80 transition-opacity\" src=\"${senderData.avatar}\" alt=\"${senderData.username}\">\n          </a>\n          <div class=\"bg-gray-100 text-gray-800 border border-gray-200 rounded-2xl px-3 py-1 text-sm max-w-[75%] break-words shadow-sm\">\n            <a href=\"/profile/${senderData.username}\" class=\"font-bold text-xs text-blue-600 hover:underline block mb-1\">\n              ${senderData.username}\n            </a>\n            <div class=\"chat-message-inner\">${text}</div>\n          </div>\n        </div>\n      `);\n    }\n  }\n  saveLocalHistory(text, type, senderData) {\n    let history = JSON.parse(localStorage.getItem(\"ourapp_chat\")) || [];\n    // FIX: Now we are saving the senderData (username & avatar) into the hard drive!\n    history.push({\n      text: text,\n      type: type,\n      senderData: senderData,\n      time: Date.now()\n    });\n    localStorage.setItem(\"ourapp_chat\", JSON.stringify(history));\n  }\n  loadLocalHistory() {\n    let history = JSON.parse(localStorage.getItem(\"ourapp_chat\")) || [];\n    let now = Date.now();\n    let timeLimit = 1000 * 60 * 60;\n    let freshHistory = history.filter(msg => now - msg.time < timeLimit);\n    freshHistory.forEach(msg => {\n      // Safe fallback just in case old broken messages are still saved\n      let sender = msg.senderData || {\n        username: \"Guest\",\n        avatar: \"https://gravatar.com/avatar/default?s=128\"\n      };\n      this.displayMessage(msg.text, msg.type, sender);\n    });\n    localStorage.setItem(\"ourapp_chat\", JSON.stringify(freshHistory));\n    if (freshHistory.length > 0) {\n      setTimeout(() => this.chatLog.scrollTop = this.chatLog.scrollHeight, 50);\n    }\n  }\n  showChat() {\n    if (!this.openedYet) {\n      this.openConnection();\n    }\n    this.openedYet = true;\n    this.chatWrapper.classList.remove(\"translate-y-full\", \"opacity-0\");\n    this.chatWrapper.classList.add(\"translate-y-0\", \"opacity-100\");\n    this.chatField.focus();\n  }\n  hideChat() {\n    this.chatWrapper.classList.remove(\"translate-y-0\", \"opacity-100\");\n    this.chatWrapper.classList.add(\"translate-y-full\", \"opacity-0\");\n  }\n  openConnection() {\n    if (!this.socket) {\n      this.socket = io();\n\n      // FIX: Catch the welcome event from the server to grab your exact profile data!\n      this.socket.on('welcome', data => {\n        this.myUsername = data.username;\n        this.myAvatar = data.avatar;\n      });\n      this.socket.on('chatMessageFromServer', data => {\n        this.displayMessage(data.message, \"other\", {\n          username: data.username,\n          avatar: data.avatar\n        });\n        this.saveLocalHistory(data.message, \"other\", {\n          username: data.username,\n          avatar: data.avatar\n        });\n        this.chatLog.scrollTop = this.chatLog.scrollHeight;\n      });\n    }\n  }\n  injectHTML() {\n    document.body.insertAdjacentHTML('beforeend', `\n      <div id=\"chat-wrapper\" class=\"fixed z-50 bottom-0 right-4 w-[290px] h-[350px] bg-white flex flex-col translate-y-full transition-transform duration-300 ease-out opacity-0 text-gray-800 shadow-xl border border-gray-300 rounded-t-lg\">\n        <div class=\"bg-gray-900 text-white px-3 py-2 flex justify-between items-center text-sm font-bold rounded-t-lg\">\n          Chat \n          <span class=\"chat-title-bar-close cursor-pointer hover:text-red-400 transition-colors\"><i class=\"fas fa-times-circle\"></i></span>\n        </div>\n        <div id=\"chat\" class=\"p-2 flex-1 overflow-y-auto text-sm bg-white\"></div>\n        <form id=\"chatForm\" class=\"p-2 bg-gray-100 border-t border-gray-300 rounded-b-lg flex gap-2 items-center\">\n          <input type=\"text\" class=\"flex-1 box-border px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500\" id=\"chatField\" placeholder=\"Type a message…\" autocomplete=\"off\">\n          <button type=\"submit\" class=\"bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm flex items-center justify-center\">\n            <i class=\"fas fa-paper-plane\"></i>\n          </button>\n        </form>\n      </div>\n    `);\n  }\n};\n\n//# sourceURL=webpack://ourapp/./frontend-js/modules/chat.js?\n}");

/***/ },

/***/ "./frontend-js/modules/search.js"
/*!***************************************!*\
  !*** ./frontend-js/modules/search.js ***!
  \***************************************/
(module) {

eval("{module.exports = class Search {\n  constructor() {\n    this.injectHTML();\n    this.headerSearchIcon = document.querySelector(\".header-search-icon\");\n    this.overlay = document.querySelector(\".search-overlay\");\n    this.closeIcon = document.querySelector(\".close-live-search\");\n    this.inputField = document.querySelector(\"#live-search-field\");\n    this.events();\n  }\n  events() {\n    this.headerSearchIcon.addEventListener(\"click\", e => {\n      e.preventDefault();\n      this.openOverlay();\n    });\n    this.closeIcon.addEventListener(\"click\", () => this.closeOverlay());\n  }\n  openOverlay() {\n    this.overlay.classList.add(\"search-overlay--visible\");\n    setTimeout(() => this.inputField.focus(), 50);\n  }\n  closeOverlay() {\n    this.overlay.classList.remove(\"search-overlay--visible\");\n  }\n  injectHTML() {\n    document.body.insertAdjacentHTML('beforeend', `\n      <div class=\"search-overlay\">\n        <div class=\"search-overlay-top shadow-sm\">\n          <div class=\"container container--narrow\">\n            <label for=\"live-search-field\" class=\"search-overlay-icon\"><i class=\"fas fa-search\"></i></label>\n            <input type=\"text\" id=\"live-search-field\" class=\"live-search-field\" placeholder=\"What are you interested in?\">\n            <span class=\"close-live-search\"><i class=\"fas fa-times-circle\"></i></span>\n          </div>\n        </div>\n        <div class=\"search-overlay-bottom\">\n          <div class=\"container container--narrow py-3\">\n            <div class=\"circle-loader\"></div>\n            <div class=\"live-search-results\"></div>\n          </div>\n        </div>\n      </div>\n    `);\n  }\n};\n\n//# sourceURL=webpack://ourapp/./frontend-js/modules/search.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./frontend-js/main.js");
/******/ 	
/******/ })()
;