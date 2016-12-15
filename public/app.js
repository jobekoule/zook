(function(){
 var app = angular.module('myApp',['ngRoute']);

  // DECLARATION DU CONTROLLER
  app.controller("myCtrl", function(){
      //this.joseph = object;
  });

// DECLARATION DES DIRECTIVES
  app.directive('header',function(){
    return{
      restrict:'A',
      templateUrl:'common/header.html'
    }
  });
  app.directive('footer',function(){
    return{
      restrict:'A',
      templateUrl:'common/footer.html'
    }
  });

  app.directive('home',function(){
    return{
      restrict:'A',
      templateUrl:'home.html'
    }
  });
/*
  app.config(["$routeProvider",function($routeProvider){
    $routeProvider
      .when("/",{
          templateUrl:'public/home/home.html'
  }); */
  })();
