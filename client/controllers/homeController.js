/* Creates an angular module and controller for home.html (ng-app) */
var homeApp = angular.module('homeApplication', []);

/* creates the controller for login.html (ng-controller) */
homeApp.controller('homeController', function($scope, homeFactory){
  //check the user then bind it to the username display
  $scope.username = "";

  homeFactory.getUser().then(function(response) {
    //do stuff on response
    if(response.data === "No User"){
      $scope.username = response.data;
    }
    else {
      $scope.username = response.data.username;
    }
  }, function(error) {
    //do stuff on error
    console.log('could not get user');
  });

}); //end homeController

/* creates the factory that will be used to handle http requests */
homeApp.factory('homeFactory', function($http){
  var methods = {

    //sends get request to check if there is currently a user logged in
    getUser: function() {
	     return $http.get('http://localhost:8080/api/functions/login');
    }

  }; //end methods

  return methods;
}); //end loginFactory
