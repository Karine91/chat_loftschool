let blockUsers = document.getElementById('users');
let blockMsg = document.getElementById('messages');
let inputTextMsg = document.getElementById('msg_txt');
let inputUserName = document.getElementById('msg_name');
let buttonSendMsg = document.getElementById('msg_btn');

class Chat {
    constructor(blockUsers, blockMsg, inputTextMsg, inputUserName, buttonSendMsg) {
        this.socket = io();
        this.users = blockUsers;
        this.messages = blockMsg;
        this.userName = inputUserName;
        this.button = buttonSendMsg;
        this.text = inputTextMsg;
        this
          .button
          .addEventListener('click', (e) => {
              e.preventDefault();
              this.sendMsg();
          });
        this
          .text
          .addEventListener('keyup', (e) => {
            e.preventDefault();
            this.sendMsgOnEnter(e);
        });
    }

    addMsg(name, message) {
        let template = document.createElement('TR');
        let tdName = document.createElement('TD');
        let tdMsg = document.createElement('TD');
    
        template
          .classList
          .add('msg');
        tdName
          .classList
          .add('col-md-2');
        tdName.innerHTML = name;
        tdMsg
          .classList
          .add('col-md-2');
        tdMsg.innerHTML = message;
    
        template.appendChild(tdName);
        template.appendChild(tdMsg);
    
        this
          .messages
          .insertBefore(template, this.messages.firstChild);
    }

    addUsers(data) {
        this.users.innerHTML = '';
        let template = document.createElement('UL');
        template.className = 'nav nav-list well';
    
        let templateHeader = document.createElement('LI');
        templateHeader
          .classList
          .add('nav-header');
        templateHeader.textContent = 'Пользователи в чате';
        template.appendChild(templateHeader);
    
        for (var i in data) {
          let tempLi = document.createElement('LI');
          tempLi.textContent = data[i];
          template.appendChild(tempLi);
        }
        this
          .users
          .appendChild(template);
    }

    sendMsgOnEnter(e) {
        if (e.keyCode === 13) {
          this.sendMsg();
        }
    }
    
    sendMsg() {
        if (this.text.value === '') {
          return;
        }
        if (this.userName.value === '') {
          this.userName.value = 'Аноним';
        }
        this
          .text
          .focus();
        this
          .socket
          .emit('message', {
            message: this.text.value,
            name: this.userName.value
          });
        this.text.value = '';
    }
}

let userChat = new Chat(blockUsers, blockMsg, inputTextMsg, inputUserName, buttonSendMsg);

// Первоначальное сообщение при появлении в чате.
userChat
  .socket
  .on('connect', data => {
    userChat.addMsg('<i>System message</i>', `<i> Добро пожаловать в чат. Соблюдайте правила приличия. </i>`);
});

userChat
.socket
.on('user', data => {
    userChat.addUsers(data);
});

// Когда сообщение приходит с сервера
userChat
  .socket
  .on('message', function (data) {
    userChat.addMsg(data.name, data.message);
  });

// Показать системное сообщение
userChat
  .socket
  .on('system', function (data) {
    userChat.addMsg('<i>System message</i>', `<i> ${data} </i>`);
  });

window.addEventListener('unload', () => {
  userChat
    .socket
    .disconnect();
});