/* Creates an angular module and controller for Create.html (ng-app) */
var createApp = angular.module('createEventApplication', []);

/* creates the controller for create.html (ng-controller) */
createApp.controller('createEventController', function($scope, createEventFactory){

  //who is the user
  $scope.owner;
  createEventFactory.getUser().then(function(response) {
    //do stuff on response
    $scope.owner = response.data;

    //check who the user is and hide event creator stuff if they arent one
    if(!$scope.owner.isEventCreator){
      $("#orgEvents").hide();
    }
    else{
      //get a list of their events
      $scope.getEvents();
    }


  }, function(error) {
    //do stuff on error
    console.log('Could not get user');
  });

  //get the events made by this user
  $scope.events;
  $scope.getEvents = function(){
    createEventFactory.getEvents().then(function(response) {
      $scope.events = response.data;
    }, function(error) {
      console.log('Could not retreive user\'s events');
    });
  }

  //get their favorites
  $scope.favs;
  $scope.getFavs = function(){
    createEventFactory.getFavs().then(function(response) {
      $scope.favs = response.data;
    }, function(err) {
      window.alert("Could not get favorites.");
    });
  }
  $scope.getFavs();

  //delete a favorite
  $scope.deleteFav = function(fav){
    $scope.favID = fav._id;
    createEventFactory.deleteFav($scope.favID).then(function(response) {
      //deleted the favorite, get new favorites
      $scope.getFavs();
    }, function(err) {
      window.alert(err.data);
    });
  }

  //destroys detailed information rows that repeat data
  $scope.shouldRowExist = function(key){
    if(key == "room" || key == "food" || key == "description"){
      return true;
    }
    else {
      return false;
    }
  }
  //toggle detailed information rows
  $scope.getDetails = function(id){
    $(".detailedInfo.row" + id + "-details").toggle(300, "linear");
  };

  //destroys detailed information rows that repeat data
  $scope.shouldRowExist2 = function(key){
    if(key == "address" || key == "room" || key == "food" || key == "description"){
      return true;
    }
    else {
      return false;
    }
  }
  //toggle detailed information rows
  $scope.getDetails2 = function(id){
    $scope.owner.username = "adam";
    $(".detailedInfo2.row" + id + "-details2").toggle(300, "linear");
  };

  //be able to open the create event form
  $scope.toggleTable = function(){
    $scope.name= "";
    $scope.address = "";
    $scope.room = "";
    $scope.date = "";
    $scope.time="";
    $scope.food="";
    $scope.description="";
    $scope.updateID = "";
    $scope.updating = false;
    $("#eventForm").toggle();
    $("#userFavs").toggle();
    $("#orgEvents").toggle();
    $("#headerBtns").toggle();
  }

  $scope.updateOrCreate = function(){
    if($scope.updating)
      $scope.updateEvent();
    else
      $scope.createEventType();
  }
  /* variables bound to form inputs */
  $scope.name= "";
  $scope.address = "";
  $scope.room = "";
  $scope.date = "";
  $scope.time="";
  $scope.food="";
  $scope.description="";

  /* variables to decide what event to update and also whether to update or create */
  $scope.updateID = "";
  $scope.updating = false;

  //passes angular bound information to the backend function
  $scope.createEventType = function(){
    $scope.evntinfo = {
        name: $scope.name,
        address: $scope.address,
        room: $scope.room,
        owner: $scope.owner.org,
        date: $scope.date,
        time: $scope.time,
        food: $scope.food,
        description: $scope.description
    }


      //check input box data for correct minimum requirements
      //check for @ufl.edu email address
      if($scope.name.length === 0){
        window.alert('You must provide an Event Name');
      }
      //check if username is entered
      else if($scope.address.length === 0){
        window.alert('You must provide an Address.');
      }
      //check if password is entered
      else if($scope.room.length === 0 ){
        window.alert('You must provide a Room Number');
      }
      else if($scope.time.length  === 0 ){
        window.alert('You must provide a Time');
      }
      else if($scope.food.length === 0 ){
        window.alert('You must provide a Type of Food');
      }
      else if($scope.description.length === 0 ){
        window.alert('You must provide Additional information');
      }

      //check if there is a form element that is too long (>128) (arbitrary max size)
      else if($scope.name.length > 300 || $scope.address.length > 300 || $scope.room.length > 300 ||
      $scope.food.length > 300 || $scope.description.length > 300){
        let errorString = 'One or more input fields exceeds the maximum length of 300 characters:';

        if($scope.name.length > 300)
          errorString += '\nEvent name';
        if($scope.address.length > 300)
          errorString += '\nAddress';
        if($scope.room.length > 300)
          errorString += '\nEvent Room';
        if($scope.food.length > 300)
          errorString += '\nEvent Food';
        if($scope.description.length > 300)
          errorString += '\nAdditional information';

        window.alert(errorString);

      }
      //Every form element has been checked and is okay, send form to create account
      else {

        //parse out the date into MM/DD/YYYY format
        var string = $scope.evntinfo.date + '';
        var date = string.split(" ");
        $scope.evntinfo.date = "";

        //parse out the month
        if(date[1] === "Jan")
          $scope.evntinfo.date += "01/"
        else if(date[1] === "Feb")
          $scope.evntinfo.date += "02/"
        else if(date[1] === "Mar")
          $scope.evntinfo.date += "03/"
        else if(date[1] === "Apr")
          $scope.evntinfo.date += "04/"
        else if(date[1] === "May")
          $scope.evntinfo.date += "05/"
        else if(date[1] === "Jun")
          $scope.evntinfo.date += "06/"
        else if(date[1] === "Jul")
          $scope.evntinfo.date += "07/"
        else if(date[1] === "Aug")
          $scope.evntinfo.date += "08/"
        else if(date[1] === "Sep")
          $scope.evntinfo.date += "09/"
        else if(date[1] === "Oct")
          $scope.evntinfo.date += "10/"
        else if(date[1] === "Nov")
          $scope.evntinfo.date += "11/"
        else
          $scope.evntinfo.date += "12/"

        //include the day and year as well
        $scope.evntinfo.date += date[2] + "/" + date[3];

        //parse out the time
        string = $scope.evntinfo.time + '';
        var time = string.split(" ");
        $scope.evntinfo.time = time[4].substring(0,5);

        createEventFactory.createEvent($scope.evntinfo).then(function(response) {
          //on response get the new events list
          $scope.getEvents();
          $scope.toggleTable();
        }, function(error) {
          //do stuff on error
          window.alert(error.data);
        });
      }
  }; //end createEventType

  $scope.setupUpdateEvent = function(event){
    $scope.toggleTable();
    $scope.name= event.name;
    $scope.address = event.address;
    $scope.room = event.room;
    $scope.date = "";
    $scope.time = "";
    $scope.food= event.food;
    $scope.description = event.description;
    $scope.updating = true;
    $scope.updateID = event._id;
  }; //end setupUpdateEvent

  $scope.updateEvent = function(){
    $scope.evntinfo = {
        name: $scope.name,
        address: $scope.address,
        room: $scope.room,
        owner: $scope.owner.org,
        date: $scope.date,
        time: $scope.time,
        food: $scope.food,
        description: $scope.description
    }


      //check input box data for correct minimum requirements
      //check for @ufl.edu email address
      if($scope.name.length === 0){
        window.alert('You must provide an Event Name');
      }
      //check if username is entered
      else if($scope.address.length === 0){
        window.alert('You must provide an Address.');
      }
      //check if password is entered
      else if($scope.room.length === 0 ){
        window.alert('You must provide a Room Number');
      }
      else if($scope.time.length  === 0 ){
        window.alert('You must provide a Time');
      }
      else if($scope.food.length === 0 ){
        window.alert('You must provide a Type of Food');
      }
      else if($scope.description.length === 0 ){
        window.alert('You must provide Additional information');
      }

      //check if there is a form element that is too long (>128) (arbitrary max size)
      else if($scope.name.length > 300 || $scope.address.length > 300 || $scope.room.length > 300 ||
      $scope.food.length > 300 || $scope.description.length > 300){
        let errorString = 'One or more input fields exceeds the maximum length of 300 characters:';

        if($scope.name.length > 300)
          errorString += '\nEvent name';
        if($scope.address.length > 300)
          errorString += '\nAddress';
        if($scope.room.length > 300)
          errorString += '\nEvent Room';
        if($scope.food.length > 300)
          errorString += '\nEvent Food';
        if($scope.description.length > 300)
          errorString += '\nAdditional information';

        window.alert(errorString);

      }
      //Every form element has been checked and is okay, send form to create account
      else {

        //parse out the date into MM/DD/YYYY format
        var string = $scope.evntinfo.date + '';
        var date = string.split(" ");
        $scope.evntinfo.date = "";

        //parse out the month
        if(date[1] === "Jan")
          $scope.evntinfo.date += "01/"
        else if(date[1] === "Feb")
          $scope.evntinfo.date += "02/"
        else if(date[1] === "Mar")
          $scope.evntinfo.date += "03/"
        else if(date[1] === "Apr")
          $scope.evntinfo.date += "04/"
        else if(date[1] === "May")
          $scope.evntinfo.date += "05/"
        else if(date[1] === "Jun")
          $scope.evntinfo.date += "06/"
        else if(date[1] === "Jul")
          $scope.evntinfo.date += "07/"
        else if(date[1] === "Aug")
          $scope.evntinfo.date += "08/"
        else if(date[1] === "Sep")
          $scope.evntinfo.date += "09/"
        else if(date[1] === "Oct")
          $scope.evntinfo.date += "10/"
        else if(date[1] === "Nov")
          $scope.evntinfo.date += "11/"
        else
          $scope.evntinfo.date += "12/"

        //include the day and year as well
        $scope.evntinfo.date += date[2] + "/" + date[3];

        //parse out the time
        string = $scope.evntinfo.time + '';
        var time = string.split(" ");
        $scope.evntinfo.time = time[4].substring(0,5);

        createEventFactory.updateEvent($scope.updateID, $scope.evntinfo).then(function(response) {
          //on response get the new events list
          $scope.getEvents();
          $scope.getFavs();
          $scope.toggleTable();

          //reset the updating variables
          $scope.updating = false;
          $scope.updateID = "";
        }, function(error) {
          //do stuff on error
          window.alert(error.data);
        });
      }
  };  //end updateEvent

  $scope.deleteEvent = function(event){
    var eventID = event._id;
    createEventFactory.deleteEvent(eventID).then(function(response){
      //event successfully deleted get new events
      $scope.getEvents();
      $scope.getFavs();
    }, function(error) {
      window.alert(error.data);
    });
  }

}); //end createEventController

/* creates the factory that will be used to handle http requests */
createApp.factory('createEventFactory', function($http){
  var methods = {

    //sends post request to /api/functions
    createEvent: function(evntinfo) {
	     return $http.post('http://localhost:8080/api/functions/event', evntinfo);
    },
    getUser: function() {
	     return $http.get('http://localhost:8080/api/functions/login');
    },
    getEvents: function() {
      return $http.get('http://localhost:8080/api/functions/event/org');
    },
    deleteEvent: function(id) {
      return $http.delete('http://localhost:8080/api/functions/event/' + id)
    },
    updateEvent: function(id, update) {
      return $http.post('http://localhost:8080/api/functions/event/' + id, update);
    },
    getFavs: function() {
      return $http.get('http://localhost:8080/api/functions/favorites');
    },
    deleteFav: function(id) {
      return $http.delete('http://localhost:8080/api/functions/favorites/' + id);
    }
  }; //end methods

  return methods;
}); //end createFactory
