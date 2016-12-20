angular.module('mean.system')
 .factory('friends', ['$http', 'socket', ($http, socket) => {
    class Friends {
      /**
      * Constructor for this class
      */
      constructor() {
        // user email
        this.userEmail = '';
        // all registered users
        this.registeredUsers = {};
        // all my friends
        this.userFriends = {};

        // all unclicked game invites
        this.gameInvites = [];

        // we need a test token to test our module
        // we would do this using cookies ngCookies :)
        this.userToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7ImRvbmF0aW9ucyI6ImluaXQiLCJmcmllbmRzIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJhdmF0YXIiOiJpbml0IiwiaGFzaGVkX3Bhc3N3b3JkIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsIm5hbWUiOiJpbml0IiwicHJvdmlkZXIiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiZnJpZW5kcyI6dHJ1ZSwiX192Ijp0cnVlLCJkb25hdGlvbnMiOnRydWUsImF2YXRhciI6dHJ1ZSwiaGFzaGVkX3Bhc3N3b3JkIjp0cnVlLCJlbWFpbCI6dHJ1ZSwibmFtZSI6dHJ1ZSwicHJvdmlkZXIiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJkb25hdGlvbnMiOltdLCJmcmllbmRzIjpbImF6ZWV6Lm9sYW5pcmFuQGFuZGVsYS5jb20iLCJvbGF3YWxlYXp5c3NAZ21haWwuY29tIiwiZnJlYWtAeWFob28uY29tIiwidGVzdHVzZXIzQGFuZGVsYS5jb20iLCJ0ZXN0dXNlcjJAYW5kZWxhLmNvbSIsInRlc3R1c2VyNEBhbmRlbGEuY29tIiwidGVzdHVzZXI1QGFuZGVsYS5jb20iLCJ0ZXN0dXNlcjFAYW5kZWxhLmNvbSIsInRlc3R1c2VyNkBhbmRlbGEuY29tIiwidGVzdHVzZXI3QGFuZGVsYS5jb20iLCJ0ZXN0dXNlcjhAYW5kZWxhLmNvbSJdLCJfX3YiOjExLCJhdmF0YXIiOiIvaW1nL2Nob3Nlbi9GMDEucG5nIiwiaGFzaGVkX3Bhc3N3b3JkIjoiJDJhJDEwJHZxT2JOWUtMc0lKMklLeXJNb3RlN2VDeG1PNHNldUlVUlNDVTZ4eWJQem5kSHowZ1N1NTBhIiwiZW1haWwiOiJ0ZXN0dXNlcjNAYW5kZWxhLmNvbSIsIm5hbWUiOiJ0ZXN0IHVzZXIgMiIsInByb3ZpZGVyIjoibG9jYWwiLCJfaWQiOiI1ODRhNTJmMTFmZWIyMzFmZjUwODE4NmYifSwiX3ByZXMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W251bGwsbnVsbCxudWxsXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltudWxsXSwiJF9fb3JpZ2luYWxfcmVtb3ZlIjpbbnVsbF19LCJfcG9zdHMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W10sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbXSwiJF9fb3JpZ2luYWxfcmVtb3ZlIjpbXX0sImlhdCI6MTQ4MjE2ODkyNiwiZXhwIjoxNDgyMjU1MzI2fQ.mrYBH04McPEwp0ToTBjcATkfwfuLHqHFeUEAPu7rfNw`;    
        // Add listener for game_invite socket events
        socket.on('game_invite', (message) => {
          this.gameInviteRecieved(message);
        });

        // Add listener for invite_status events
        socket.on('invite_status', (message) => {
          console.log(message.status);
        });
      }

      /**
      * Set this user Email address
      * @param{String}userEmail - email of the currently
      * logged in user
      * @return{undefined}
      */
      setUserEmail(userEmail) {
        this.userEmail = userEmail;
        console.log('user Email - ' + userEmail);
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
        console.log('userName - ' + userName);
        if (!userName && userName.length <= 0) {
          this.registeredUsers = {};
          return;
        }
        $http({
          method: 'GET',
          url: `/api/friends/search_users?name=${userName}&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7ImRvbmF0aW9ucyI6ImluaXQiLCJmcmllbmRzIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJhdmF0YXIiOiJpbml0IiwiaGFzaGVkX3Bhc3N3b3JkIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsIm5hbWUiOiJpbml0IiwicHJvdmlkZXIiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiZnJpZW5kcyI6dHJ1ZSwiX192Ijp0cnVlLCJkb25hdGlvbnMiOnRydWUsImF2YXRhciI6dHJ1ZSwiaGFzaGVkX3Bhc3N3b3JkIjp0cnVlLCJlbWFpbCI6dHJ1ZSwibmFtZSI6dHJ1ZSwicHJvdmlkZXIiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJkb25hdGlvbnMiOltdLCJmcmllbmRzIjpbImF6ZWV6Lm9sYW5pcmFuQGFuZGVsYS5jb20iLCJvbGF3YWxlYXp5c3NAZ21haWwuY29tIiwiZnJlYWtAeWFob28uY29tIiwidGVzdHVzZXIzQGFuZGVsYS5jb20iLCJ0ZXN0dXNlcjJAYW5kZWxhLmNvbSIsInRlc3R1c2VyNEBhbmRlbGEuY29tIiwidGVzdHVzZXI1QGFuZGVsYS5jb20iLCJ0ZXN0dXNlcjFAYW5kZWxhLmNvbSIsInRlc3R1c2VyNkBhbmRlbGEuY29tIiwidGVzdHVzZXI3QGFuZGVsYS5jb20iLCJ0ZXN0dXNlcjhAYW5kZWxhLmNvbSJdLCJfX3YiOjExLCJhdmF0YXIiOiIvaW1nL2Nob3Nlbi9GMDEucG5nIiwiaGFzaGVkX3Bhc3N3b3JkIjoiJDJhJDEwJHZxT2JOWUtMc0lKMklLeXJNb3RlN2VDeG1PNHNldUlVUlNDVTZ4eWJQem5kSHowZ1N1NTBhIiwiZW1haWwiOiJ0ZXN0dXNlcjNAYW5kZWxhLmNvbSIsIm5hbWUiOiJ0ZXN0IHVzZXIgMiIsInByb3ZpZGVyIjoibG9jYWwiLCJfaWQiOiI1ODRhNTJmMTFmZWIyMzFmZjUwODE4NmYifSwiX3ByZXMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W251bGwsbnVsbCxudWxsXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltudWxsXSwiJF9fb3JpZ2luYWxfcmVtb3ZlIjpbbnVsbF19LCJfcG9zdHMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W10sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbXSwiJF9fb3JpZ2luYWxfcmVtb3ZlIjpbXX0sImlhdCI6MTQ4MjE2ODkyNiwiZXhwIjoxNDgyMjU1MzI2fQ.mrYBH04McPEwp0ToTBjcATkfwfuLHqHFeUEAPu7rfNw`
        }).then((successResponse) => {
          // on sucess, update all users
          this.registeredUsers = successResponse.data;
          console.log('friends found = ' + successResponse.data);
        }, (errorResponse) => {
          // error occured
          console.log('Error Occured while trying to fetch all users from server\n' + errorResponse);
        });
      }

      /**
      * method to remove repeated friends
      * in the friends list
      * @param{String} email - email to check
      * return{Boolean} True if email is part of the users list
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
          url: `/api/friends/get_friends?token=${this.userToken}`
        }).then((successResponse) => {
          // on sucess, update all users
          this.userFriends = successResponse.data;
          console.log('fetchFriends() successful. length => ' + this.userFriends.length);
        }, (errorResponse) => {
          // error occured
          console.log('Error Occured while trying to fetch all users from server\n' + errorResponse);
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
            token: this.userToken,
            friend_email: friendEmail
          })
          .then((successResponse) => {
            console.log('addFriend() successful. length => ' + successResponse.data.length);
            // update the user friends
            this.fetchFriends();
          }, (errorResponse) => {
            console.log('Error occured while trying to add a new friend');
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
            senderEmail: this.userEmail,
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
        console.log('game invite received: \nFrom: ' + message.senderEmail, '\nGame Url: ', message.location);
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
