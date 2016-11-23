angular.module('mean.system')
  .factory('chat', function() {
    class Chat{
      constructor(group) {
        // declare fire base reference with link to our firebase database
        this.myFirebase = new Firebase('https://anbu-cfh-chat.firebaseio.com/');
        this.messageArray = [];
      }

      setChatGroup(group){
        this.chatGroup = group;
      }
      postGroupMessage(userName, userMessage){
        const date = new Date;
        const messageTime = `${(date.getHours() + 1)}:${date.getMinutes()}`;
        // We do not want to send empty messages
        if(userMessage !== undefined && userMessage.trim().length > 0){
          // Push message to group thread on firebase
          this.myFirebase.child(this.chatGroup).push({user: userName, message: userMessage, time: messageTime});
          console.log(`user: ${userName} | message: ${userMessage} | group: ${this.chatGroup}`);
        }
      };

      listenForMessages(){
        const thisChat = this ;
        this.myFirebase.child(this.chatGroup).on('child_added', function(snapshot) {
          const message = snapshot.val();
          thisChat.messageArray.push(message);
        });
      };
    }
    const chat = new Chat();
    return chat;
});