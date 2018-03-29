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

  $scope.myAccount = function()
  {
    $location.path("/myAccount");
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
  $scope.students = [
    "Student_1",
    "Student_2",
    "Student_3",
    "Student_4",
    "Student_5"
  ]
  // Function to move to swap page
  $scope.swap = function(traderName)
  {
    if($rootScope.loggedIn)
    {
        $rootScope.trader = traderName;
        $rootScope.swapped = true;
    }
    else {
      {
        $rootScope.fromSwap = true;
        $rootScope.trader = traderName;
        $location.path("/login");
      }
    }
  }

  $scope.changeButton = function(student)
  {
    $rootScope.swapped = false;
    $rootScope.hideStudent = student;
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
    $http({
              method: "POST",
              url: "/createUser",
              data: body
          }).then(function(res,status,headers) {
              if(res.data.error != "Email already exists.")
              {
                $rootScope.loggedIn = true;
                $scope.email = email;
                $scope.pass = pass;
                // $rootScope.student = res.data[0].csp;
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
                $scope.showAlert = true;
              }
            })


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

    $http({
              method: "POST",
              url: "/login",
              data: body
          }).then(function(res,status,headers) {
              console.log(res.data.error)
              if(res.data.error != "Username or password incorrect.")
              {
                if(email != $rootScope.trader)
                {
                  $rootScope.loggedIn = true;
                  $scope.email = email;
                  $scope.pass = pass;
                  // $rootScope.student = res.data[0].csp;
                  if($rootScope.fromSwap)
                  {
                    $location.path("/");
                    $rootScope.swapped = true;
                    $rootScope.fromSwap = false;
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
