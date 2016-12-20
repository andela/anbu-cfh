angular.module('mean.system')
 .factory('friends', ['$http', 'socket', 'Storage', ($http, socket, Storage) => {
    class Friends {
      /**
      * Constructor for this class
      */
      constructor() {
        // user email
        this.userEmail = '';
        // user name
        this.userName = '';
        // all registered users
        this.registeredUsers = {};
        // all my friends
        this.userFriends = {};
        // all unclicked game invites
        this.gameInvites = [];
        // Add listener for game_invite socket events
        socket.on('game_invite', (message) => {
          this.gameInviteRecieved(message);
        });
        // Add listener for invite_status events
        socket.on('invite_status', (message) => {
        // do something with the status message
        });
      }

      /**
      * Set this user Email address
      * @param{String}userName - name of the currently
      * logged in user
      * @return{undefined}
      */
      setUserName(userName) {
        this.userName = userName;
      }

      /**
      * Set this user Email address
      * @param{String}userEmail - email of the currently
      * logged in user
      * @return{undefined}
      */
      setUserEmail(userEmail) {
        this.userEmail = userEmail;
      }

      /**
      * Send pulish a join event
      * @return{Object} - Object containing
      * the content of this message
      */
      requestJoin() {
        return socket.emit('join', {
          userEmail: this.userEmail
        });
      }

      /**
      * Find a registered user
      * @param{String}userName - name of user to search for
      * @return{undefined}
      */
      findRegisteredUser(userName) {
        // we don't want to search for an empty user
        if (!userName && userName.length <= 0) {
          this.registeredUsers = {};
          return;
        }
        $http({
          method: 'GET',
          url: `/api/friends/search_users?name=${userName}&token=${Storage.get('token')}`
        }).then((successResponse) => {
          // on sucess, update all users
          this.registeredUsers = successResponse.data;
        }, (errorResponse) => {
          // error occured
        });
      }

      /**
      * method to remove repeated friends
      * in the friends list
      * @param{String} email - email to check
      * @return{Boolean} True if email is part of the users list
      * False if it is not.
      */
      checkFriendInUsers(email){
        let exists = false;
        this.userFriends.forEach((friend) => {
          if (friend.email === email) {
            exists = true;
          }
        });
        return exists;
      }

      /**
      * Fetch this user friend
      * @returns{undefined}
      */
      fetchFriends() {
        $http({
          method: 'GET',
          url: `/api/friends/get_friends?token=${Storage.get('token')}`
        }).then((successResponse) => {
          // on sucess, update all users
          console.log('User Friends ' - successResponse.data);
          this.userFriends = successResponse.data;
        }, (errorResponse) => {
          // error occured
        });
      }

      /**
      * Adds a new friend and updates the user
      * friend list.
      * @param{String} friendEmail - Email of new friend to be added
      * @returns{undefined}
      */
      addFriend(friendEmail) {
        $http.post('/api/friends/add_friend',
          {
            token: Storage.get('token'),
            friend_email: friendEmail
          })
          .then((successResponse) => {
            // update the user friends
            this.fetchFriends();
          }, (errorResponse) => {
            // error occurred when trying to add friend
          });
      }

      /**
      * Send in App game Invites to friends
      * @param{String} destinationEmail - Email of invited friend
      * @param{String} gameUrl - Url to this game
      * @return{undefined}
      */
      sendInAppGameInvite(destinationEmail, gameUrl) {
        if (destinationEmail) {
          socket.emit('game_invite', {
            senderName: this.userName,
            friendEmail: destinationEmail,
            location: gameUrl
          });
        }
      }

      /**
      * Recieve a game invite
      * @param{Object} message - Object containing the game invite data
      * @return{undefined}
      */
      gameInviteRecieved(message){
        this.gameInvites.push({
          message
        });
      }

    }
  // Initialize new friends object
   const friends = new Friends();

  // return friends object
   return friends;
  }]);
