angular.module('mean.system')
  .factory('chat', function() {
    class Chat {
      /**
      * Constructor to create a new instance of this class
      */
      constructor() {
        // declare fire base reference with link to our firebase database
        this.myFirebase = new Firebase('https://anbu-cfh-chat.firebaseio.com/');
        this.messageArray = [];
        this.enableListener = true;
        this.showChatWindow = false;
        this.unreadMessageCount = 0;
      }

      /**
      * Method to set the chat group to post
      * our messages to.
      * @param{String} group - Name of the group
      * @return{undefined}
      */
      setChatGroup(group) {
        this.chatGroup = group;
      }

      /**
      * Method to set the current chat user name
      * @param{String} name - name of the user
      * @return{undefined}
      */
      setChatUsername(name) {
        this.userName = name;
      }

      /**
      * Method to post user message to firebase
      * database.
      * @param{String} messageText - message
      * @return{undefined}
      */
      postGroupMessage(messageText) {
        const date = new Date();
        const messageTime = date.toTimeString().substr(0, 5);
        // We do not want to send empty messages
        if (messageText !== undefined && messageText.trim().length > 0) {
          // Push message to group thread on firebase
          const messageObject = {
            senderName: this.userName,
            textContent: messageText,
            time: messageTime
          };
          this.myFirebase.child(this.chatGroup)
            .push(messageObject);
        }
      }

      /**
      * Method to setup  eventlistener
      * for firebase
      * @return{undefined}
      */
      listenForMessages() {
        if(!this.enableListener){
          return;
        }
        this.myFirebase.child(this.chatGroup).off();
        this.enableListener = false;
        this.myFirebase.child(this.chatGroup).on('child_added', (snapshot) => {
          const message = snapshot.val();
          this.messageArray.push(message);
          this.updateUnreadMessageCount();
        });
      }

      /**
      * Method to update the uread messages count
      */
      updateUnreadMessageCount(){
        if(!this.showChatWindow){
          this.unreadMessageCount += 1;
        }
      }
    }
    const chat = new Chat();
    return chat;
  });
