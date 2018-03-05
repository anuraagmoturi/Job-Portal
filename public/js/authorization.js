var app = angular.module('myapp');

app.factory('authService',function ($http,$location,$routeParams,$q) {
   return{

       // isLoggedIn: function () {
       //
       //     if(sessionStorage.getItem('currentUser')){
       //         return true;
       //     }
       //     else {
       //
       //         $location.path('/');
       //     }
       //     return false;
       //
       // }

       isLoggedIn: function () {


           console.log($routeParams.uname);
           //$scope.uname = $routeParams.uname;
           var promise = $q.defer();
           $http.get('http://127.0.0.1:2000/getLogged').then(function (data) {
                console.log(data.data);
                if(data.data.flag == "success"){
                    console.log("Inside resolve");
                    // return true;
                    promise.resolve();
                }
                else{

                    //return false;
                    console.log("inside reject");
                    promise.reject();
                    $location.path('/');
                }

           });
           return promise.promise;
       },

       logOut: function ($scope) {
           $http.get('http://127.0.0.1:2000/logOut/'+$scope.username).then(function (data) {
               //console.log(data);
               $location.path('/');
           });
       }

   };
});
