/* Creates an angular module and controller for home.html (ng-app) */
var homeApp = angular.module('homeApplication', []);

/* creates the controller for login.html (ng-controller) */
homeApp.controller('homeController', function($scope, homeFactory){
  //check the user then bind it to the username display
  $scope.user=undefined;
  $scope.events;
  $scope.favEvents;
  $scope.DetailEvent=undefined;

  //find out who the user is
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
      //get favorites
      $scope.getFavorites();
    }
  }, function(error) {
    //do stuff on error
    console.log('could not get user');
  });

  //get a list of all the events
  homeFactory.getEvents().then(function(response) {
    //do stuff on response
    $scope.events = response.data;
  }, function(error) {
    //do stuff on error
    console.log('No events to display.');
  });

  //get all this users favorites
  $scope.getFavorites = function(){
    homeFactory.getFav().then(function(response){
      $scope.favEvents = response.data;
      $scope.toggleAllFavRows();
    }, function(error){
      window.alert(error.data);
    });
  }

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
        //toggle the favorite display for that row index
        $scope.toggleRows(fav._id);
      }, function(error){
        window.alert(error.data);
      });
    }
    else {
      window.alert("Create an account to be able to favorite events!");
    }
  } //end addFavorite

  $scope.removeFavorite = function(fav){
    if($scope.user){
      homeFactory.deleteFav(fav._id).then(function(response){
        //toggle the favorite display for that row index
        $scope.toggleRows(fav._id);
      }, function(error){
        window.alert(error.data);
      });
    }
  } //end removeFavorite

  //loop through the favorites and toggle the favorited rows
  $scope.toggleAllFavRows = function(){
    $scope.favEvents.forEach(function(item){
      $scope.toggleRows(item._id);
    });
  }

  //toggle the rows between the favorite and unfavorite display
  $scope.toggleRows = function(id){
    $("#row" + id + "-fav").toggle();
    $("#row" + id + "-unfav").toggle();
  }

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
    },
    deleteFav: function(id) {
      return $http.delete('http://localhost:8080/api/functions/favorites/' + id);
    }
  }; //end methods

  return methods;
}); //end loginFactory
