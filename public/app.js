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
  $http({
            method: "GET",
            url: "/listClasses"
        }).then(function(res,status,headers) {
            $rootScope.allClasses = res.data
            console.log($rootScope.allClasses)

          })

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
    // comment out first 3 JSONs to see successful message
    $scope.dummyAdd = [
      // {
      //   "ClassName": "Fundamentals of Software Testing",
      //   "Course_Number": "CEN 4072",
      //   "Days": "Tu-Th",
      //   "End_Time": "7:40 PM",
      //   "Professor_Name": "Peter Clarke",
      //   "Section_Number": "U01-C",
      //   "Start_Time": "6:25 PM"
      // },
      // {
      //   "ClassName": "Fundamentals of Software Testing",
      //   "Course_Number": "CAP 4104",
      //   "Days": "Tu-Th",
      //   "End_Time": "7:40 PM",
      //   "Professor_Name": "Peter Clarke",
      //   "Section_Number": "U01-C",
      //   "Start_Time": "6:25 PM"
      // },
      // {
      //   "ClassName": "Fundamentals of Software Testing",
      //   "Course_Number": "COP 4338",
      //   "Days": "Tu-Th",
      //   "End_Time": "7:40 PM",
      //   "Professor_Name": "Peter Clarke",
      //   "Section_Number": "U01-C",
      //   "Start_Time": "6:25 PM"
      // },
      {
        "ClassName": "Fundamentals of Software Testing",
        "Course_Number": "CEN 0000",
        "Days": "Tu-Th",
        "End_Time": "7:40 PM",
        "Professor_Name": "Peter Clarke",
        "Section_Number": "U01-C",
        "Start_Time": "6:25 PM"
      },
      {
        "ClassName": "Fundamentals of Software Testing",
        "Course_Number": "CEN 1111",
        "Days": "Tu-Th",
        "End_Time": "7:40 PM",
        "Professor_Name": "Peter Clarke",
        "Section_Number": "U01-C",
        "Start_Time": "6:25 PM"
      }
    ]

    // iterate in reverse in order to splice
    for(i = $scope.dummyAdd.length-1; i >= 0; i--)
    {
      var cantAdd = false;
      // check has
      for(var j in $scope.accountInfo.Has)
      {
        if($scope.dummyAdd[i].Course_Number == $scope.accountInfo.Has[j].Course_Number)
        {
          cantAdd = true
        }
      }
      // check wants
      for(var k in $scope.accountInfo.Wants)
      {
        if($scope.dummyAdd[i].Course_Number == $scope.accountInfo.Wants[k].Course_Number)
        {
          cantAdd = true
        }
      }
      if(cantAdd)
      {
        // remove classes user already has but keep them in another array
        cantAdd = false
        $scope.classesCantAdd.push($scope.dummyAdd[i].Course_Number)
        $scope.dummyAdd.splice(i, 1);
      }
    }
    console.log($scope.dummyAdd)
    console.log($scope.classesCantAdd)
    // set flag to show alert
    if($scope.classesCantAdd.length > 0)
    {
      $scope.cantAddFlag = true
    }
    else
    {
      $scope.canAddFlag = true
    }
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

    // console.log($rootScope.hasToRemove)
    // console.log($rootScope.wantsToRemove)

  }

  $scope.done = function()
  {
    $scope.checkedClasses()
    if($scope.isRemoving)
    {
      if($rootScope.hasToRemove.length != 0)
      {
        $http({
                  method: "POST",
                  url: "/remHasClasses",
                  data: $rootScope.hasToRemove
              }).then(function(res,status,headers) {
                for(var i in $rootScope.hasToRemove)
                {
                  console.log("here1")
                  for(var j = $scope.accountInfo.Has.length-1; j >= 0; j--)
                  {
                    console.log("here2")
                    if($rootScope.hasToRemove[i].Course_Number == $scope.accountInfo.Has[j].Course_Number)
                    {
                      console.log("here3")
                      $scope.accountInfo.Has.splice(j, 1)
                    }
                  }
                }
                $rootScope.hasToRemove = []
              })
      }
      if($rootScope.wantsToRemove.length != 0)
      {
        $http({
                  method: "POST",
                  url: "/remWantsClasses",
                  data: $rootScope.wantsToRemove
              }).then(function(res,status,headers) {
                for(var i in $rootScope.wantsToRemove)
                {
                  for(var j = $scope.accountInfo.Wants.length-1; j >= 0; j--)
                  {
                    if($rootScope.wantsToRemove[i].Course_Number == $scope.accountInfo.Wants[j].Course_Number)
                    {
                      $scope.accountInfo.Wants.splice(j, 1)
                    }
                  }
                }
                $rootScope.wantsToRemove = []
              })
      }
    }

    // if($scope.isAdding)
    // {
    //   if($scope.dummyAdd.length != 0)
    //   {
    //     $http({
    //               method: "POST",
    //               url: "/remHasClasses",
    //               data: $rootScope.hasToRemove
    //           }).then(function(res,status,headers) {
    //             for(var i in $rootScope.hasToRemove)
    //             {
    //               console.log("here1")
    //               for(var j = $scope.accountInfo.Has.length-1; j >= 0; j--)
    //               {
    //                 console.log("here2")
    //                 if($rootScope.hasToRemove[i].Course_Number == $scope.accountInfo.Has[j].Course_Number)
    //                 {
    //                   console.log("here3")
    //                   $scope.accountInfo.Has.splice(j, 1)
    //                 }
    //               }
    //             }
    //             $rootScope.hasToRemove = []
    //           })
    //   }
    // }

    $scope.isRemoving = false
    $scope.isAdding = false
    $scope.cantAddFlag = false
    $scope.canAddFlag = false
  }

  $scope.cancel = function()
  {
    $scope.isRemoving = false
    $scope.isAdding = false
    $scope.cantAddFlag = false
    $scope.canAddFlag = false
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

app.controller('modalCtrl', function($scope, $location, $rootScope, $http, $timeout){
  // $('#framework').multiselect({
  //  nonSelectedText: 'Select Classes',
  //  enableFiltering: true,
  //  enableCaseInsensitiveFiltering: true,
  //  buttonWidth:'400px'
  // });

  $rootScope.addClassesSelected = []
  $timeout(function() {

      $('#select-dropdown').multiselect({
        maxHeight: 400,
        includeSelectAllOption: true,
        selectAllText: 'Select All',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: 'Search'
      });
  }, 2, false);

  $scope.getOptionId = function(option) {
      return option.id;
  };

  // $scope.isOptionSelected = function(option) {
  //     var selected;
  //     if (option.selected) {
  //       selected = "selected"
  //     }
  //     return selected;
  // };

  $scope.addClasses = function()
  {
    $rootScope.addClassesSelected = $('#select-dropdown').val();
    console.log($rootScope.addClassesSelected)
    $("#select-dropdown").multiselect("clearSelection");
    $rootScope.addClassesSelected = $('#select-dropdown').val();
  }

  $scope.close = function()
  {
    $("#select-dropdown").multiselect("clearSelection");
  }

});
