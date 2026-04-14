module.exports = class Chat {
  constructor() {
    this.openedYet = false;
    this.myUsername = "Guest";
    this.myAvatar = "https://gravatar.com/avatar/default?s=128"; // Default fallback
    
    this.openIcon = document.querySelector(".header-chat-icon");
    this.injectHTML();
    
    this.chatWrapper = document.querySelector("#chat-wrapper");
    this.closeIcon = document.querySelector(".chat-title-bar-close");
    this.chatField = document.querySelector("#chatField");
    this.chatForm = document.querySelector("#chatForm");
    this.chatLog = document.querySelector("#chat");
    
    this.loadLocalHistory();
    this.events();
  }

  events() {
    this.openIcon.addEventListener("click", (e) => {
      e.preventDefault();
      this.showChat();
    });
    this.closeIcon.addEventListener("click", () => this.hideChat());
    
    this.chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendMessageToServer();
    });
  }

  sendMessageToServer() {
    let messageText = this.chatField.value;
    if (!messageText.trim()) return; 

    // Bundle our exact user data with the message
    let senderData = { username: this.myUsername, avatar: this.myAvatar };

    this.displayMessage(messageText, "self", senderData);
    this.saveLocalHistory(messageText, "self", senderData);
    
    this.socket.emit('chatMessageFromBrowser', { message: messageText });
    
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
    this.chatField.value = '';
    this.chatField.focus();
  }

  displayMessage(text, type, senderData) {
    if (type === 'self') {
      // UPGRADED SELF MESSAGE: Now includes your username and clickable profile!
      this.chatLog.insertAdjacentHTML('beforeend', `
        <div class="flex items-start mb-3 justify-end">
          <div class="bg-blue-600 text-white rounded-2xl px-3 py-1 mr-2 text-sm max-w-[75%] break-words shadow-sm flex flex-col items-end">
            <a href="/profile/${senderData.username}" class="font-bold text-xs text-blue-200 hover:text-white hover:underline block mb-1 transition-colors">
              ${senderData.username}
            </a>
            <div class="chat-message-inner text-left w-full">${text}</div>
          </div>
          <a href="/profile/${senderData.username}">
            <img class="w-6 h-6 rounded-full mt-1 hover:opacity-80 transition-opacity" src="${senderData.avatar}" alt="${senderData.username}">
          </a>
        </div>
      `);
    } else if (type === 'other') {
      // UPGRADED OTHER MESSAGE: Clickable profile links
      this.chatLog.insertAdjacentHTML('beforeend', `
        <div class="flex items-start mb-3 justify-start">
          <a href="/profile/${senderData.username}">
            <img class="w-6 h-6 rounded-full mr-2 mt-1 hover:opacity-80 transition-opacity" src="${senderData.avatar}" alt="${senderData.username}">
          </a>
          <div class="bg-gray-100 text-gray-800 border border-gray-200 rounded-2xl px-3 py-1 text-sm max-w-[75%] break-words shadow-sm">
            <a href="/profile/${senderData.username}" class="font-bold text-xs text-blue-600 hover:underline block mb-1">
              ${senderData.username}
            </a>
            <div class="chat-message-inner">${text}</div>
          </div>
        </div>
      `);
    }
  }

  saveLocalHistory(text, type, senderData) {
    let history = JSON.parse(localStorage.getItem("ourapp_chat")) || [];
    // FIX: Now we are saving the senderData (username & avatar) into the hard drive!
    history.push({ text: text, type: type, senderData: senderData, time: Date.now() });
    localStorage.setItem("ourapp_chat", JSON.stringify(history));
  }

  loadLocalHistory() {
    let history = JSON.parse(localStorage.getItem("ourapp_chat")) || [];
    let now = Date.now();
    let timeLimit = 1000 * 60 * 60; 

    let freshHistory = history.filter(msg => (now - msg.time) < timeLimit);

    freshHistory.forEach(msg => {
      // Safe fallback just in case old broken messages are still saved
      let sender = msg.senderData || { username: "Guest", avatar: "https://gravatar.com/avatar/default?s=128" };
      this.displayMessage(msg.text, msg.type, sender);
    });

    localStorage.setItem("ourapp_chat", JSON.stringify(freshHistory));

    if (freshHistory.length > 0) {
      setTimeout(() => this.chatLog.scrollTop = this.chatLog.scrollHeight, 50);
    }
  }

  showChat() {
    if (!this.openedYet) {
      this.openConnection();
    }
    this.openedYet = true;
    this.chatWrapper.classList.remove("translate-y-full", "opacity-0");
    this.chatWrapper.classList.add("translate-y-0", "opacity-100");
    this.chatField.focus();
  }

  hideChat() {
    this.chatWrapper.classList.remove("translate-y-0", "opacity-100");
    this.chatWrapper.classList.add("translate-y-full", "opacity-0");
  }

  openConnection() {
    if (!this.socket) {
      this.socket = io(); 
      
      // FIX: Catch the welcome event from the server to grab your exact profile data!
      this.socket.on('welcome', (data) => {
        this.myUsername = data.username;
        this.myAvatar = data.avatar;
      });
      
      this.socket.on('chatMessageFromServer', (data) => {
        this.displayMessage(data.message, "other", { 
          username: data.username, 
          avatar: data.avatar 
        });
        this.saveLocalHistory(data.message, "other", { 
          username: data.username, 
          avatar: data.avatar 
        });
        this.chatLog.scrollTop = this.chatLog.scrollHeight;
      });
    }
  }

  injectHTML() {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="chat-wrapper" class="fixed z-50 bottom-0 right-4 w-[290px] h-[350px] bg-white flex flex-col translate-y-full transition-transform duration-300 ease-out opacity-0 text-gray-800 shadow-xl border border-gray-300 rounded-t-lg">
        <div class="bg-gray-900 text-white px-3 py-2 flex justify-between items-center text-sm font-bold rounded-t-lg">
          Chat 
          <span class="chat-title-bar-close cursor-pointer hover:text-red-400 transition-colors"><i class="fas fa-times-circle"></i></span>
        </div>
        <div id="chat" class="p-2 flex-1 overflow-y-auto text-sm bg-white"></div>
        <form id="chatForm" class="p-2 bg-gray-100 border-t border-gray-300 rounded-b-lg flex gap-2 items-center">
          <input type="text" class="flex-1 box-border px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" id="chatField" placeholder="Type a message…" autocomplete="off">
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm flex items-center justify-center">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    `);
  }
}