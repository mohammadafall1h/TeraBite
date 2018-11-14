/* Creates an angular module and controller for Create.html (ng-app) */
var createApp = angular.module('createApplication', []);

/* creates the controller for create.html (ng-controller) */
createApp.controller('createController', function($scope, createFactory){

  /* variables bound to form inputs */
  $scope.email = "";
  $scope.username = "";
  $scope.pass = "";
  $scope.repeat = "";
  $scope.radio = "false"; //defaults to not an event creator

  //variables to control organization name
  $scope.org = ""; //bound to text input, typing into text box changes orgUser
  $scope.orgUser = ""; //holds the saved the orgization name

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

      //check input box data for correct minimum requirements
      //check for @ufl.edu email address
      if($scope.email.indexOf('@ufl.edu') === -1){
        window.alert('You must provide a valid University of Florida email for this service.');
      }
      //check if username is entered
      else if($scope.username.length === 0){
        window.alert('You must provide a Username.');
      }
      //check if password is entered
      else if($scope.pass.length < 8){
        window.alert('Your password must be at least 8 characters long.');
      }
      //check if Org is entered if they are an event creator
      else if($scope.accInfo.isEventCreator && $scope.orgUser.length === 0){
        window.alert('You must provide an organization name.');
      }
      //check if the passwords match
      else if($scope.pass !== $scope.repeat){
        window.alert("Passwords do not match.");
      }
      //check if there is a form element that is too long (>128) (arbitrary max size)
      else if($scope.email.length > 128 || $scope.username.length > 128 || $scope.pass.length > 128 ||
      $scope.accInfo.org.length > 128){
        let errorString = 'One or more input fields exceeds the maximum length of 128 characters:';

        if($scope.email.length > 128)
          errorString += '\nEmail';
        if($scope.username.length > 128)
          errorString += '\nUsername';
        if($scope.pass.length > 128)
          errorString += '\nPassword';
        if($scope.accInfo.org.length > 128)
          errorString += '\nOrginization Name';

        window.alert(errorString);
      }
      //Every form element has been checked and is okay, send form to create account
      else {
        createFactory.createUserAccount($scope.accInfo).then(function(response) {
          //do stuff on response
          window.location = '/signin';
        }, function(error) {
          //do stuff on error
          window.alert(error.data);
        });
      }
  }; //end createUserAccount

}); //end createController

/* creates the factory that will be used to handle http requests */
createApp.factory('createFactory', function($http){
  var methods = {

    //sends post request to /api/functions
    createUserAccount: function(accInfo) {
	     return $http.post('http://terabite.herokuapp.com/api/functions/user', accInfo);
    }

  }; //end methods

  return methods;
}); //end createFactory
