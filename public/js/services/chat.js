angular.module('mean.system')
  .factory('chat', function() {
    class Chat{
      constructor(group) {
        // declare fire base reference with link to our firebase database
        this.myFirebase = new Firebase('https://anbu-cfh-chat.firebaseio.com/');
        this.messageArray = [];
      }

      setChatGroup(group) {
        this.chatGroup = group;
      }
      postGroupMessage(userName, messageText) {
        const date = new Date();
        const messageTime = `${(date.getHours() + 1)}:${date.getMinutes()}`;
        // We do not want to send empty messages
        if (messageText !== undefined && messageText.trim().length > 0) {
          // Push message to group thread on firebase
          const messageObject = {
            senderName: userName,
            textContent: messageText,
            time: messageTime
          };
          this.myFirebase.child(this.chatGroup)
            .push(messageObject);
            console.log('userMessage: ' + messageObject.textContent);
        }
      }

      listenForMessages() {
        const thisChat = this;
        this.myFirebase.child(this.chatGroup).on('child_added', (snapshot) => {
          const message = snapshot.val();
          thisChat.messageArray.push(message);
        });
      }
    }
    const chat = new Chat();
    return chat;
  });
