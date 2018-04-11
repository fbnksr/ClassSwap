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
    location.reload();
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
  $rootScope.hasToSwap = []
  $rootScope.wantsToSwap = []

  $http({
            method: "GET",
            url: "/getClasses"
        }).then(function(res,status,headers) {
            $rootScope.students = res.data
          })

  // get info on classes that were checked and reset checkboxes
  $scope.checkedClasses = function()
  {
    $rootScope.hasToSwap = []
    $rootScope.wantsToSwap = []

    var checkboxes = document.querySelectorAll('input[name=has_checked]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
      $rootScope.hasToSwap.push(checkboxes[i].value)
      checkboxes[i].checked = false;
    }

    checkboxes = document.querySelectorAll('input[name=wants_checked]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
      $rootScope.wantsToSwap.push(checkboxes[i].value)
      checkboxes[i].checked = false;
    }

    console.log($rootScope.hasToSwap)
    console.log($rootScope.wantsToSwap)
  }

  // Function to move to swap page
  $scope.swap = function(traderName)
  {
    $scope.checkedClasses()
    $rootScope.hasToSwap = []
    $rootScope.wantsToSwap = []

    $rootScope.trader = traderName;
    $rootScope.swapped = true;
    // if($rootScope.loggedIn)
    // {
    //     $rootScope.trader = traderName;
    //     $rootScope.swapped = true;
    // }
    // else
    // {
    //     $rootScope.fromSwap = true;
    //     $rootScope.trader = traderName;
    //     $location.path("/login");
    // }
  }

  $scope.changeButton = function(student)
  {
    if($rootScope.loggedIn)
    {
      $rootScope.swapped = false;
      $rootScope.hideStudent = student;
    }
    else
    {
      $rootScope.fromSwap = true;
      $rootScope.trader = student;
      $location.path("/login");
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
                  $location.path("/");
                  $rootScope.swapped = true;
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
  $scope.accountInfo = $rootScope.students[$rootScope.user]
  console.log($scope.accountInfo)
  $scope.isRemoving = false;
  $scope.isAdding = false;

  $scope.remove = function()
  {
    $scope.isRemoving = true;
  }
  $scope.add = function()
  {
    $scope.isAdding = true;
    $scope.classesCantAdd = []
    // verify that user doesn't already have these classes before adding them
    var dummyAdd = [
      {
        "ClassName": "Fundamentals of Software Testing",
        "Course_Number": "CEN 4072",
        "Days": "Tu-Th",
        "End_Time": "7:40 PM",
        "Professor_Name": "Peter Clarke",
        "Section_Number": "U01-C",
        "Start_Time": "6:25 PM"
      },
      {
        "ClassName": "Fundamentals of Software Testing",
        "Course_Number": "CAP 4104",
        "Days": "Tu-Th",
        "End_Time": "7:40 PM",
        "Professor_Name": "Peter Clarke",
        "Section_Number": "U01-C",
        "Start_Time": "6:25 PM"
      },
      {
        "ClassName": "Fundamentals of Software Testing",
        "Course_Number": "CEN 0000",
        "Days": "Tu-Th",
        "End_Time": "7:40 PM",
        "Professor_Name": "Peter Clarke",
        "Section_Number": "U01-C",
        "Start_Time": "6:25 PM"
      }
    ]

    // iterate in reverse in order to splice
    for(i = dummyAdd.length-1; i >= 0; i--)
    {
      var cantAdd = false;
      // check has
      for(var j in $scope.accountInfo.Has)
      {
        if(dummyAdd[i].Course_Number == $scope.accountInfo.Has[j].Course_Number)
        {
          cantAdd = true
        }
      }
      // check wants
      for(var k in $scope.accountInfo.Wants)
      {
        if(dummyAdd[i].Course_Number == $scope.accountInfo.Wants[k].Course_Number)
        {          
          cantAdd = true
        }
      }
      if(cantAdd)
      {
        // remove classes user already has
        cantAdd = false
        $scope.classesCantAdd.push(dummyAdd[i].Course_Number)
        dummyAdd.splice(i, 1);
      }
    }
    console.log(dummyAdd)
    console.log($scope.classesCantAdd)
  }

  // get info on classes that were checked and reset checkboxes
  $scope.checkedClasses = function()
  {
    $rootScope.hasToRemove = []
    $rootScope.wantsToRemove = []

    var checkboxes = document.querySelectorAll('input[name=has_checked]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
      var temp = {
        "Email": "",
        "Course_Number": "",
        "Section_Number": ""
      }
      temp["Email"] = $rootScope.user
      temp["Course_Number"] = JSON.parse(checkboxes[i].value).Course_Number
      temp["Section_Number"] = JSON.parse(checkboxes[i].value).Section_Number
      $rootScope.hasToRemove.push(temp)
      checkboxes[i].checked = false;
    }

    checkboxes = document.querySelectorAll('input[name=wants_checked]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
      var temp = {
        "Email": "",
        "Course_Number": "",
        "Section_Number": ""
      }
      temp["Email"] = $rootScope.user
      temp["Course_Number"] = JSON.parse(checkboxes[i].value).Course_Number
      temp["Section_Number"] = JSON.parse(checkboxes[i].value).Section_Number
      $rootScope.wantsToRemove.push(temp)
      checkboxes[i].checked = false;
    }

    console.log($rootScope.hasToRemove)
    console.log($rootScope.wantsToRemove)

  }

  $scope.done = function()
  {
    $scope.checkedClasses()
    $scope.isRemoving = false;
    $scope.isAdding = false;
    $rootScope.hasToRemove = []
    $rootScope.wantsToRemove = []
  }

  $scope.cancel = function()
  {
    $scope.isRemoving = false;
    $scope.isAdding = false;
    $rootScope.hasToRemove = []
    $rootScope.wantsToRemove = []
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
                  $rootScope.user = email
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
