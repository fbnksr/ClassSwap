var app = angular.module("myapp",['ngRoute'])

app.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "./home.html",
     })
})

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
    var username = $scope.username;
    var pass = $scope.pass;

    var body = {
              'username': username,
              'pass': pass
    };

  //   $http({
  //             method: "POST",
  //             url: "/api/login",
  //             data: body
  //         }).then(function(res,status,headers) {
  //             console.log(username + " " + $rootScope.trader);
  //             if(res.data.error != "Error")
  //             {
  //               if(username != $rootScope.trader)
  //               {
  //                 $rootScope.loggedIn = true;
  //                 $scope.username = username;
  //                 $scope.pass = pass;
  //                 $rootScope.student = res.data[0].csp;
  //                 if($rootScope.fromSwap)
  //                 {
  //                   $location.path("/swap");
  //                 }
  //                 else
  //                 {
  //                   $location.path("/myAccount");
  //                 }
  //               }
  //               else
  //               {
  //                   $scope.sameUserAlert = true;
  //                   $scope.showAlert = false;
  //               }
  //
  //             }
  //             else
  //             {
  //               $scope.showAlert = true;
  //             }
  //
  //           })
}


});
