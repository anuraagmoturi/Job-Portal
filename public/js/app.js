var app = angular.module('myapp',['ngRoute']);


app.config(function($routeProvider) {
    $routeProvider.when('/', {
        template:'<h1>Welcome to my website!!!</h1>'
    })
        .when('/', {
            templateUrl : 'views/logIn.html',
            controller : 'logInCntrl'
        })
        .when('/reg', {
            templateUrl : 'views/registration.html',
            controller: 'regCntrl'
        })
        .when('/jobSeeker/:uname',{
            templateUrl: 'views/jobSeeker.html',
            controller: 'jobSeekerCntrl',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })
        .when('/company/:uname',{
            templateUrl: 'views/company.html',
            controller: 'companyCntrl',
            // resolve: ['authService', function (authService) {
            //     return authService.isLoggedIn();
            // }]
    });
});

app.controller('regCntrl',['$scope','$http','$location',function ($scope,$http,$location) {


    $scope.temp=1;
    console.log($scope.temp);


    $scope.usertypes = [{userType:"job seeker"},{userType:"company"}];


    $scope.registerFn = function () {
        console.log("inside register fn");
        $scope.user.userType = $scope.selected.userType;
        $http.post('http://127.0.0.1:2000/regUser',$scope.user).then(function (data) {
            console.log(data);

        });
        $scope.user = null;

    }

    $scope.logback = function () {
        $location.path('/');
    }


}]);

app.controller('logInCntrl',['$scope','$http','$location',function ($scope,$http,$location) {
    $scope.logIn=null;
    $scope.flag = false;
    $scope.uname = JSON.parse(sessionStorage.getItem('currentUser'));

    $scope.logInFn = function () {
        $http.post('http://127.0.0.1:2000/logInCheck',$scope.logIn).then(function (data) {
            console.log(data);


             $scope.userType = data.data.userType;
            $scope.currentUser = data.data.username;

            if(data.data.flag == undefined){
                $http.get('http://127.0.0.1:2000/setLog/'+$scope.currentUser).then(function (dat) {
                    if(dat.data.flag == "success"){
                        if($scope.userType == 'Job seeker'){
                            $location.path('/jobSeeker/'+data.data.username);
                        }
                        else{
                            $location.path('/company/'+data.data.username);
                        }
                    }
                    else{
                        console.log("log in failed in setLog");
                    }

                });


            }
            else{
                console.log("log in failed");
            }


        });
    }



}]);

app.controller('jobSeekerCntrl',['$scope','$routeParams','$http','$location','authService',function ($scope,$routeParams,$http,$location,authService) {
    $scope.username = $routeParams.uname;

    $http.get('http://127.0.0.1:2000/getJobs').then(function (data) {
        console.log(data.data);
        $scope.jobs = data.data;

    });

    // $scope.logOut = function () {
    //     sessionStorage.clear();
    //     $location.path('/');
    // }

    // $http.get('http://127.0.0.1:2000/getLogged/'+$scope.username).then(function (data) {
    //     console.log(data);
    // });

   // $scope.loggedin = authService.isLoggedIn($scope);
    $scope.searchFn = function () {
        console.log($scope.searchObj);




        $http.post('http://127.0.0.1:2000/search',$scope.searchObj).then(function (data) {
            //console.log(data.data);
            if(data.data.flag == undefined) {
                $scope.jobs = data.data;
                $scope.searchObj=null;
            }
            else{
                $('#myTable').hide();
                //$scope.cancelFn();
                $scope.searchObj=null;
            }
        });
    }

    $scope.cancelFn = function () {
        $http.get('http://127.0.0.1:2000/getJobs').then(function (data) {
            $('#myTable').show();
            //console.log(data.data);
            $scope.jobs = data.data;

        });
    }

    $scope.searchObj = {

    }


    $scope.logOut = function () {
        authService.logOut($scope);
    }


}]);

app.controller('companyCntrl',['$scope','$routeParams','$http','$location','authService',function ($scope,$routeParams,$http,$location,authService) {
    $scope.username = $routeParams.uname;

    $scope.postFn = function () {
        console.log($scope.job);

        $http.post('http://127.0.0.1:2000/postJob',$scope.job).then(function (data) {
            console.log(data.data);


        });
        $scope.job=null;
    }

    $scope.logOut = function () {
        authService.logOut($scope);
    }
}]);

