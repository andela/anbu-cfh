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
        // we need a test token to test our module
        // we would do this using cookies ngCookies :)
        this.userToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7ImRvbmF0aW9ucyI6ImluaXQiLCJmcmllbmRzIjoiZGVmYXVsdCIsIl9fdiI6ImluaXQiLCJhdmF0YXIiOiJpbml0IiwiaGFzaGVkX3Bhc3N3b3JkIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsIm5hbWUiOiJpbml0IiwicHJvdmlkZXIiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6eyJmcmllbmRzIjp0cnVlfSwiaW5pdCI6eyJfX3YiOnRydWUsImRvbmF0aW9ucyI6dHJ1ZSwiYXZhdGFyIjp0cnVlLCJoYXNoZWRfcGFzc3dvcmQiOnRydWUsImVtYWlsIjp0cnVlLCJuYW1lIjp0cnVlLCJwcm92aWRlciI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7ImRvbmF0aW9ucyI6W10sImZyaWVuZHMiOltdLCJfX3YiOjAsImF2YXRhciI6Ii9pbWcvY2hvc2VuL0gwMS5wbmciLCJoYXNoZWRfcGFzc3dvcmQiOiIkMmEkMTAkYXoyMHZIeUlac1gyU0ZQbW9Fd0hJLkFFMGZpNzhPR3pVMlV1MlF0c3QyWkd4YTQvcVJNUGEiLCJlbWFpbCI6InRlc3R1c2VyNEBhbmRlbGEuY29tIiwibmFtZSI6Ik9sYW5pcmFuIEFrZWVtIiwicHJvdmlkZXIiOiJsb2NhbCIsIl9pZCI6IjU4NGE5MDdjOTI1ZDAyNmFlNzhjNWFmYSJ9LCJfcHJlcyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbbnVsbCxudWxsLG51bGxdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W251bGxdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltudWxsXX0sIl9wb3N0cyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltdfSwiaWF0IjoxNDgxNTM4OTI5LCJleHAiOjE0ODE2MjUzMjl9.Qgq92MnFVq8mzdG-iZibbx76ZA9vhsIPXo6ubzxq-Ak`;
      }

      /**
      * Find a registered user
      * @param{String}userName - name of user to search for
      * returns{undefined}
      */
      findRegisteredUser(userName) {
        // we don't want to search for an empty user
        if (!userName && userName.length <= 0) {
          this.registeredUsers = {};
          return;
        }
        $http({
          method: 'GET',
          url: `/api/friends/search_users?name=${userName}&token=${this.userToken}`
        }).then((successResponse) => {
          // on sucess, update all users
          this.registeredUsers = successResponse.data;
          console.log(this.registeredUsers);
          console.log(this.userFriends);
        }, (errorResponse) => {
          // error occured
          console.log('Error Occured while trying to fetch all users from server');
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
            // break;
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
            //this.userFriends = successResponse.data;
            this.fetchFriends();
          }, (errorResponse) => {
            console.log('Error occured while trying to add a new friend');
          });
      }

      // method to send in app notifications
      sendInAppGameInvite(destinationEmail, gameUrl) {
        if (destinationEmail) {
          socket.emit('game_invite', {
            friendEmail: destinationEmail,
            location: gameUrl
          });
        }
      }

    }
  // return a new Friends objects
  const friends = new Friends();
  return friends;
}]);