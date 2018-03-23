// create angular module and attach html to it
var app = angular.module("myapp",['ngRoute'])

// router for home page; tells node what html to load up
app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "./home.html"
     })
     .when("/register", {
       templateUrl: "./register.html"
     })
     .when("/login", {
       templateUrl: "./login.html"
     })
     .when("/myAccount", {
       templateUrl: "./myAccount.html"
     })
     .when("/swap", {
       templateUrl: "./swap.html"
     })
});

// Controller for navbar
app.controller('navCtrl', function($scope, $location, $rootScope, $http){

  $scope.login = function()
  {
    $location.path("/login");
  }

  $scope.logoClick = function()
  {
    $location.path("/");
  }

  $scope.logout = function()
  {
    $rootScope.loggedIn = false;
    $location.path("/");
  }

});

//Controller for swap page
app.controller('swapCtrl', function($scope, $location, $rootScope, $http){

  //Function called to swap
  $scope.swap = function(traderName)
  {
    if($rootScope.loggedIn)
    {
        $rootScope.trader = traderName;
        $location.path("/swap");
    }
    else {
      {
        $location.path("/login");
      }
    }
  }

  //Function to confirm swap
  $scope.confirmSwap = function()
  {
    //hides button and displays message of confirmation
    var div = document.getElementById('swap_button').style.display = 'none';
    $scope.confirmed = true;
  }

});


//Controller for home page
app.controller('homeCtrl', function($scope, $location, $rootScope, $http){

  // Function to move to swap page
  $scope.swap = function(traderName)
  {
    if($rootScope.loggedIn)
    {
        //passes in info of person you want to trade with
        //goes straight to swap
        $rootScope.trader = traderName;
        $location.path("/swap");
    }
    else {
      {
        //passes in info of person you want to trade with
        //must sign in first
        $rootScope.fromSwap = true;
        $rootScope.trader = traderName;
        $location.path("/login");
      }
    }
  }

});


app.controller('registerCtrl', function($scope, $location, $rootScope, $http){

  $scope.submit = function()
  {
    var fname = $scope.fName;
    var lname = $scope.lName;
    var email = $scope.email;
    var pass = $scope.pass;
    var body = {'fname': fname,
                'lname': lname,
                'email': email,
                'password': pass};
    console.log(body);
    //TODO: HTTP BACKEND CALL TO REGISTER.


  }

});


//Controller for my account page
app.controller('myAccountCtrl', function($scope, $location, $rootScope, $http){

  //Conditionals to control the adding ang deleting buttons
  $scope.isRemoving = false;
  $scope.isAdding = false;
  $scope.remove = function()
  {
    $scope.isRemoving = true;
  }
  $scope.add = function()
  {
    $scope.isAdding = true;
  }

  $scope.done = function()
  {
    $scope.isRemoving = false;
    $scope.isAdding = false;

  }

  //Function to move you to my account
  $scope.myAccount = function()
  {
    $location.path("/myAccount");
  }


});


//Controller for Login/Register page
app.controller('loginCtrl', function($scope, $location, $rootScope, $http){

  //Function to go back to home is user tries to swap with themselves
  $scope.goBack = function()
  {
    $location.path("/");
  }

  //Function to move to register if you don't have account
  $scope.register = function()
  {
    $location.path("/register");
  }

  //Function from log in button
  $scope.submitLogIn = function()
  {
    var email = $scope.email;
    var pass = $scope.pass;
    var body = {'email': email,
                'password': pass};
    console.log(body);

    $http({
              method: "POST",
              url: "/login",
              data: body
          }).then(function(res,status,headers) {
              if(res.data.error != "Error")
              {
                if(email != $rootScope.trader)
                {
                  $rootScope.loggedIn = true;
                  $scope.email = email;
                  $scope.pass = pass;
                  $rootScope.student = res.data[0].csp;
                  if($rootScope.fromSwap)
                  {
                    $location.path("/swap");
                  }
                  else
                  {
                    $location.path("/myAccount");
                  }
                }
                else
                {
                    $scope.sameUserAlert = true;
                    $scope.showAlert = false;
                }
              }
              else
              {
                $scope.showAlert = true;
              }
            })
    }
});
