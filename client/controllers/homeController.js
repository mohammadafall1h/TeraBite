/* Creates an angular module and controller for home.html (ng-app) */
var homeApp = angular.module('homeApplication', []);

/* creates the controller for login.html (ng-controller) */
homeApp.controller('homeController', function($scope, homeFactory){
  //check the user then bind it to the username display
  $scope.user=undefined;
  $scope.events;
  $scope.favEvents;
  $scope.DetailEvent=undefined;

  homeFactory.getUser().then(function(response) {
    //do stuff on response
    if(response.data === "No User"){
      //no user get events without checking against favorites
    }
    else {
      $scope.user = response.data;
      //user logged in turn off login/signin buttons
      //turn on account page and logout
      $("#user").show();
      $("#logout").show();
      $("#login").hide();
      $("#signup").hide();
      //get favorites then get all events
    }
  }, function(error) {
    //do stuff on error
    console.log('could not get user');
  });


  homeFactory.getEvents().then(function(response) {
    //do stuff on response
    $scope.events = response.data;
  }, function(error) {
    //do stuff on error
    console.log('No events to display.');
  });

  $scope.getDetails = function(event){
    $scope.DetailEvent= event;
  };

  $scope.addFavorite = function(fav){
    if($scope.user){
      var favorite = {
        userID: $scope.user._id,
        eventID: fav._id
      }

      homeFactory.createFav(favorite).then(function(response){
        //favorite created
      }, function(error){
        window.alert(error.data);
      });
    }
  } //end addFavorite

}); //end homeController

/* creates the factory that will be used to handle http requests */
homeApp.factory('homeFactory', function($http){
  var methods = {

    //sends get request to check if there is currently a user logged in
    getUser: function() {
	     return $http.get('http://localhost:8080/api/functions/login');
    },
    getEvents: function() {
      return $http.get('http://localhost:8080/api/functions/event');
    },
    getDetails: function() {
      return $http.get('http://localhost:8080/api/functions/event');
    },
    createFav: function(fav) {
      return $http.post('http://localhost:8080/api/functions/favorites', fav);
    },
    getFav: function() {
      return $http.get('http://localhost:8080/api/functions/favorites');
    }
  }; //end methods

  return methods;
}); //end loginFactory
