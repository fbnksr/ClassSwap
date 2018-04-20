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
  $rootScope.accountInfo = $rootScope.students[$rootScope.user]
  console.log($rootScope.accountInfo)
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
                  for(var j = $rootScope.accountInfo.Has.length-1; j >= 0; j--)
                  {
                    if($rootScope.hasToRemove[i].Course_Number == $rootScope.accountInfo.Has[j].Course_Number)
                    {
                      $rootScope.accountInfo.Has.splice(j, 1)
                    }
                  }
                }
                $rootScope.hasToRemove = []
              })
      }
      if($rootScope.wantsToRemove.length != 0)
      {
        console.log($rootScope.wantsToRemove)
        $http({
                  method: "POST",
                  url: "/remWantsClasses",
                  data: $rootScope.wantsToRemove
              }).then(function(res,status,headers) {
                for(var i in $rootScope.wantsToRemove)
                {
                  for(var j = $rootScope.accountInfo.Wants.length-1; j >= 0; j--)
                  {
                    if($rootScope.wantsToRemove[i].Course_Number == $rootScope.accountInfo.Wants[j].Course_Number)
                    {
                      $rootScope.accountInfo.Wants.splice(j, 1)
                    }
                  }
                }
                $rootScope.wantsToRemove = []
              })
      }
    }

    $scope.isRemoving = false
    $scope.isAdding = false
  }

  $scope.cancel = function()
  {
    $scope.isRemoving = false
    $scope.isAdding = false
    $rootScope.cantAddFlag = false
    $rootScope.canAddFlag = false
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
  $http({
            method: "GET",
            url: "/listClasses"
        }).then(function(res,status,headers) {
            $rootScope.allClasses = res.data
          })

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

  $timeout(function() {

      $('#select-has-dropdown').multiselect({
        maxHeight: 400,
        includeSelectAllOption: true,
        selectAllText: 'Select All',
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: 'Search'
      });
  }, 2, false);
  $timeout(function() {

      $('#select-wants-dropdown').multiselect({
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
    $rootScope.cantAddFlag = false
    $rootScope.canAddFlag = false
    $rootScope.tempHas = []
    $rootScope.tempWants = []
    $rootScope.hasClassesCantAdd = []
    $rootScope.wantsClassesCantAdd = []
    $rootScope.classesCantAdd = []
    $rootScope.classesCanAdd = []
    $rootScope.hasClassesSelected = $('#select-has-dropdown').val();
    $rootScope.wantsClassesSelected = $('#select-wants-dropdown').val();

    // convert selected values to json object and transfer over to temp (won't work without transfer)
    for(var i in $rootScope.hasClassesSelected)
    {
      $rootScope.hasClassesSelected[i] = JSON.parse($rootScope.hasClassesSelected[i])
      $rootScope.tempHas.push({"Course_Number": $rootScope.hasClassesSelected[i].Course_Number})
    }
    for(var i in $rootScope.wantsClassesSelected)
    {
      $rootScope.wantsClassesSelected[i] = JSON.parse($rootScope.wantsClassesSelected[i])
      $rootScope.tempWants.push({"Course_Number": $rootScope.wantsClassesSelected[i].Course_Number})
    }

    // NOTE: adjust format of dicts
    // var temp = {
    //   "Email": "",
    //   "Course_Number": "",
    //   "Section_Number": ""
    // }


    // verify that user doesn't already have these classes before adding them
    // comment out first 3 JSONs to see successful message


    // iterate in reverse in order to splice
    for(i = $rootScope.hasClassesSelected.length-1; i >= 0; i--)
    {
      var cantAdd = false;
      // check has
      for(var j in $rootScope.accountInfo.Has)
      {
        if($rootScope.hasClassesSelected[i].Course_Number == $rootScope.accountInfo.Has[j].Course_Number)
        {
          cantAdd = true
        }
      }
      // check wants
      for(var k in $rootScope.accountInfo.Wants)
      {
        if($rootScope.hasClassesSelected[i].Course_Number == $rootScope.accountInfo.Wants[k].Course_Number)
        {
          cantAdd = true
        }
      }
      if(cantAdd)
      {
        // remove classes user already has but keep them in another array
        cantAdd = false
        $rootScope.hasClassesCantAdd.push($rootScope.hasClassesSelected[i].Course_Number)
        $rootScope.hasClassesSelected.splice(i, 1);
      }
    }
    for(i = $rootScope.wantsClassesSelected.length-1; i >= 0; i--)
    {
      var cantAdd = false;
      // check has
      for(var j in $rootScope.accountInfo.Has)
      {
        if($rootScope.wantsClassesSelected[i].Course_Number == $rootScope.accountInfo.Has[j].Course_Number)
        {
          cantAdd = true
        }
      }
      // check wants
      for(var k in $rootScope.accountInfo.Wants)
      {
        if($rootScope.wantsClassesSelected[i].Course_Number == $rootScope.accountInfo.Wants[k].Course_Number)
        {
          cantAdd = true
        }
      }
      if(cantAdd)
      {
        // remove classes user already has but keep them in another array
        cantAdd = false
        $rootScope.wantsClassesCantAdd.push($rootScope.wantsClassesSelected[i].Course_Number)
        $rootScope.wantsClassesSelected.splice(i, 1);
      }
    }

    // set flag to show alert
    if($rootScope.hasClassesCantAdd.length > 0 || $rootScope.wantsClassesCantAdd.length > 0)
    {
      $rootScope.cantAddFlag = true
      $rootScope.classesCantAdd = $rootScope.hasClassesCantAdd.concat($rootScope.wantsClassesCantAdd);
    }
    else
    {
      $rootScope.canAddFlag = true
      $rootScope.classesCanAdd = $rootScope.hasClassesSelected.concat($rootScope.wantsClassesSelected)
      if($rootScope.hasClassesSelected.length != 0)
      {
        $http({
                  method: "POST",
                  url: "/appendHasClasses",
                  data: $rootScope.hasClassesSelected
              }).then(function(res,status,headers) {
                for(var i in $rootScope.hasToRemove)
                {
                  for(var j = $rootScope.accountInfo.Has.length-1; j >= 0; j--)
                  {
                    if($rootScope.hasToRemove[i].Course_Number == $rootScope.accountInfo.Has[j].Course_Number)
                    {
                      $rootScope.accountInfo.Has.splice(j, 1)
                    }
                  }
                }
                $rootScope.hasToRemove = []
              })
      }
      // if($rootScope.wantsClassesSelected.length != 0)
      // {
      //   $http({
      //             method: "POST",
      //             url: "/appendWantsClasses",
      //             data: $rootScope.hasClassesSelected
      //         }).then(function(res,status,headers) {
      //           for(var i in $rootScope.hasToRemove)
      //           {
      //             for(var j = $rootScope.accountInfo.Has.length-1; j >= 0; j--)
      //             {
      //               if($rootScope.hasToRemove[i].Course_Number == $rootScope.accountInfo.Has[j].Course_Number)
      //               {
      //                 $rootScope.accountInfo.Has.splice(j, 1)
      //               }
      //             }
      //           }
      //           $rootScope.hasToRemove = []
      //         })
      // }
    }

    $("#select-has-dropdown").multiselect("clearSelection");
    $rootScope.hasClassesSelected = $('#select-has-dropdown').val();
    $("#select-wants-dropdown").multiselect("clearSelection");
    $rootScope.wantsClassesSelected = $('#select-wants-dropdown').val();
  }

  $scope.close = function()
  {
    $rootScope.cantAddFlag = false
    $rootScope.canAddFlag = false
    $("#select-has-dropdown").multiselect("clearSelection");
    $("#select-wants-dropdown").multiselect("clearSelection");
  }

});
