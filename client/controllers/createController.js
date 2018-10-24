/* Creates an angular module and controller for Create.html (ng-app) */
var createApp = angular.module('createApplication', []);

/* creates the controller for create.html (ng-controller) */
createApp.controller('createController', function($scope, createFactory){

  /* variables bound to form inputs */
  $scope.email;
  $scope.username;
  $scope.pass;
  $scope.repeat;
  $scope.radio = "false"; //defaults to not an event creator

  //passes angular bound information to the backend function
  $scope.createUserAccount = function(){
    $scope.accInfo = {
        email: $scope.email,
        username: $scope.username,
        pass: $scope.pass,
        isEventCreator: false
      }

      //set isEventCreator to true if radio button is on yes
      if($scope.radio === "true")
        $scope.accInfo.isEventCreator = true;

      //only send info in passwords match
      if($scope.pass === $scope.repeat){
        /*Passwords Match Send new account to be created*/
        createFactory.createUserAccount($scope.accInfo).then(function(response) {
          //do stuff on response
        }, function(error) {
          //do stuff on error
          console.log('Unable to create new account:', error);
        });

        //reset form data
        $scope.email = "";
        $scope.username = "";
        $scope.pass = "";
        $scope.repeat = "";
        $scope.radio = "false";
      }
      else {
        //tell them to match passwords
      }
  }; //end createUserAccount

}); //end createController

/* creates the factory that will be used to handle http requests */
createApp.factory('createFactory', function($http){
  var methods = {

    //sends post request to /api/functions
    createUserAccount: function(accInfo) {
       console.log("Here");
	     return $http.post('https://localhost:8080/api/functions', accInfo);
    }

  }; //end methods

  return methods;
}); //end createFactory
