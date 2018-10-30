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

  //variables to control organization name
  $scope.org; //bound to text input, typing into text box changes orgUser
  $scope.orgUser; //holds the saved the orgization name

  //updates orgUser whenever input box data changes
  $scope.$watch('org', function(value) {
    if($scope.radio === "true") {
      $scope.orgUser = value;
    }
  });

  //switches between saved orgUser and "No Orgization" based upon radio buttons
  //also used jquery to change input box 'disabled' field based on radio buttons
  $scope.$watch('radio', function(value) {
    if(value === "false") {
      $scope.org = "No Orginization";
      //uses jquery to disable input field
      $("#orgName").attr("disabled", true);
    } else {
      $scope.org = $scope.orgUser;  //set text box to saved orginzation name
      //uses jquery to enable input field
      $("#orgName").attr("disabled", false);
    }
  });

  //passes angular bound information to the backend function
  $scope.createUserAccount = function(){
    $scope.accInfo = {
        email: $scope.email,
        username: $scope.username,
        pass: $scope.pass,
        isEventCreator: false,
        org: "No Org"
    }

    //set isEventCreator to true if radio button is on yes
      if($scope.radio === "true"){
        $scope.accInfo.isEventCreator = true;
        $scope.accInfo.org = $scope.orgUser;
      }

      //only send info if passwords match
      if($scope.pass === $scope.repeat){
        /*Passwords Match Send new account to be created*/
        createFactory.createUserAccount($scope.accInfo).then(function(response) {
          //do stuff on response
          window.alert(response.data);
        }, function(error) {
          //do stuff on error
          window.alert(error.data);
        });

      }
      else {
        //tell them to match passwords
        window.alert("Passwords do not match.");
      }
  }; //end createUserAccount

}); //end createController

/* creates the factory that will be used to handle http requests */
createApp.factory('createFactory', function($http){
  var methods = {

    //sends post request to /api/functions
    createUserAccount: function(accInfo) {
	     return $http.post('http://localhost:8080/api/functions/user', accInfo);
    }

  }; //end methods

  return methods;
}); //end createFactory
