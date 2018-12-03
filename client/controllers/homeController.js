/* Creates an angular module and controller for home.html (ng-app) */
var homeApp = angular.module('homeApplication', []);

/* creates the controller for login.html (ng-controller) */
homeApp.controller('homeController', function($scope, homeFactory){

  $scope.searchText = "";
  $scope.user = undefined;
  $scope.favEvents = undefined;
  $scope.events;

  //dummy object to loop once
  $scope.dummy = [{pointless: 42}]

  //returns whether the search filter is found in one of the event properties
  $scope.filterFound = function(event){
    if(event.name.indexOf($scope.searchText) == -1 && event.address.indexOf($scope.searchText) == -1 && event.room.indexOf($scope.searchText) == -1 &&
       event.owner.indexOf($scope.searchText) == -1 && event.date.indexOf($scope.searchText) == -1 && event.time.indexOf($scope.searchText) == -1 &&
       event.food.indexOf($scope.searchText) == -1 && event.description.indexOf($scope.searchText) == -1){
         return false;
    }
    else {
      return true;
    }
  }

  //find out who the user is
  homeFactory.getUser().then(function(response) {
    //do stuff on response
    if(response.data === "No User"){
      //no user get events without getting favorites
    }
    else {
      $scope.user = response.data;
      //user logged in turn off login/signin buttons
      //turn on account page and logout
      $("#user").show();
      $("#logout").show();
      $("#login").hide();
      $("#signup").hide();
      $scope.getFavorites();
    }
  }, function(error) {
    //do stuff on error
    console.log('could not get user');
  });

  //get a list of all the events
  $scope.getEvents = function(){
    homeFactory.getEvents().then(function(response) {
      //do stuff on response
      $scope.events = response.data;
    }, function(error) {
      //do stuff on error
      console.log('No events to display.');
    });
  }
  $scope.getEvents();

  //get all this users favorites
  $scope.getFavorites = function(){
    homeFactory.getFav().then(function(response){
      $scope.favEvents = response.data;
      $scope.toggleAllFavRows();
    }, function(error){
      window.alert(error.data);
    });
  }


  //destroys detailed information rows that repeat data
  $scope.shouldRowExist = function(key){
    if(key == "address" || key == "room" || key == "food" || key == "description"){
      return true;
    }
    else {
      return false;
    }
  }
  //toggle detailed information rows
  $scope.getDetails = function(id){
    $(".detailedInfo.row" + id + "-details").toggle();
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


  //loop through the events and favorites and toggle the favorited rows
  $scope.toggleAllFavRows = function(){
    if($scope.favEvents){
      $scope.favEvents.forEach(function(item){
        $(".row" + item._id + "-fav").toggle();
        $(".row" + item._id + "-unfav").toggle();
      });
    }
  } //end toggleAllFavRows

  //toggle the rows between the favorite and unfavorite display
  $scope.toggleRows = function(id){
    $(".row" + id + "-fav").toggle();
    $(".row" + id + "-unfav").toggle();
  }
})
.controller('MapCtrl', function ($scope) {

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    }

    for (i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
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

var cities = [
    {
        city : 'Toronto',
        desc : 'This is the best city in the world!',
        lat : 43.7000,
        long : -79.4000
    },
    {
        city : 'New York',
        desc : 'This city is aiiiiite!',
        lat : 40.6700,
        long : -73.9400
    },
    {
        city : 'Chicago',
        desc : 'This is the second best city in the world!',
        lat : 41.8819,
        long : -87.6278
    },
    {
        city : 'Los Angeles',
        desc : 'This city is live!',
        lat : 34.0500,
        long : -118.2500
    },
    {
        city : 'Las Vegas',
        desc : 'Sin City...\'nuff said!',
        lat : 36.0800,
        long : -115.1522
    }
];
