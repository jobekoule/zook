(function(){
  var app = angular.module('zookApp',['ngRoute']);

  app.controller('mainController', function(appService) {
    this.createAccount = function(form) {
      // Pas de vérifications, pas le temps
      const membre = {
        nom: form.nom,
        email: form.email,
        motdepasse: form.motdepasse,
        adresse: form.adresse
      };
      appService.addMembre(membre).then(function(response) {
        console.log(response);
      });

    }
  });

  /// Section DIRECTIVES
  app.directive('header', function() {
    return {
      templateUrl: 'common/header.html',
      restrict: 'A'
    }
  });
  app.directive('footer', function() {
    return {
      templateUrl: 'common/footer.html',
      restrict: 'A'
    }
  });

  app.factory('appService', function($http) {
    return {
      addMembre: addMembre
    };
    function addMembre(membre) {
      return $http.post('/api/membre', membre).then(complete).catch(failed);
    }
    function complete(response) {
      return response;
    }
    function failed(error) {
      console.log(error.statusText);
    }
  });
})();
