/* Creates an angular module and controller for login.html (ng-app) */
var loginApp = angular.module('loginApplication', []);

/* creates the controller for login.html (ng-controller) */
loginApp.controller('loginController', function($scope, loginFactory){

  /* variables bound to form inputs */
  $scope.username = "";
  $scope.pass = "";

  //passes angular bound information to the backend function
  $scope.loginAccount = function(){
    $scope.login = {
        username: $scope.username,
        password: $scope.pass
    }


      //check if username is entered
      if($scope.username.length === 0){
        window.alert('You must provide a Username.');
      }
      //check if password is entered
      else if($scope.pass.length < 8){
        window.alert('Your password must be at least 8 characters long.');
      }

      //check if there is a form element that is too long (>128) (arbitrary max size)
      else if($scope.username.length > 128 || $scope.pass.length > 128){
        let errorString = 'One or more input fields exceeds the maximum length of 128 characters:';
        if($scope.username.length > 128)
          errorString += '\nUsername';
        if($scope.pass.length > 128)
          errorString += '\nPassword';
        window.alert(errorString);
      }
      //Every form element has been checked and is okay, send form to loginAccount
      else {
        loginFactory.loginAccount($scope.login).then(function(response) {
          //will be redirected to home on success
          if(response.data==='incorrect_login'){
              window.alert("You've entered a wrong password or username.");
          }
          else{
            //re-route to sign-in
            window.location = '/';
          }
        }, function(err) {
          //tell them what was wrong on failure
          window.alert(err.data);
        });
      }
  }; //end loginAccount

}); //end loginController

/* creates the factory that will be used to handle http requests */
loginApp.factory('loginFactory', function($http){
  var methods = {

    //sends post request to /api/functions
    loginAccount: function(login) {
	     return $http.post('http://terabite.herokuapp.com/api/functions/login', login);
    }

  }; //end methods

  return methods;
}); //end loginFactory
