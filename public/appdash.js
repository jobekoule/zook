(function(){
  var app = angular.module('dashApp',['ngRoute']);

  app.controller('mainController', function(appService, $scope) {
    var _this = this;
    $scope.posts = [];
    $scope.master = [];
    // $scope.test = function(postID) {
    //   console.log('aaa', postID);
    //   return "<h1>a</h1>";
    // }
    this.commentsFetch = function(arrayPosts) {

      console.log("commentsFetch() :", arrayPosts)
      for(var i=0;i<arrayPosts.length;i++) {
        let postID = arrayPosts[i]._id;
        console.log('IDpost', postID);
        $scope.master = [];
        appService.getAllComment(postID).then(function(data) {
          let commentsForThisPost = data.data;
          console.log(commentsForThisPost);

          let key = postID;
          let obj = {};
          obj[key] = commentsForThisPost;

          $scope.master.push(commentsForThisPost);
          console.log('là', $scope.master)
        });
      }
      console.log('ici',$scope.master)
    }

    // Methode pour ajouter un commentaire
    this.addComment = function(form, postID) {
      let commentaire = form.commentaire;
      if(commentaire.length > 0) {
        console.log(commentaire);
        appService.addComment(postID, commentaire).then(function() {
          appService.getAllPosts().then(function(data) {
            $scope.posts = data.data;
            // console.log($scope.posts);
            _this.commentsFetch(data.data);
          });
        });
      }
    };

    // Méthode pour supprimer un post
    this.deletePost = function(postid) {
      // console.log(postid);
      if(postid.length) {
        appService.deletePost(postid).then(function(data) {
          appService.getAllPosts().then(function(data) {
            $scope.posts = data.data;
            // console.log($scope.posts);
            _this.commentsFetch(data.data);
          });
        });
      }
    }

    // Méthode d'ajout de post
    this.addPost = function(form) {
      var titre = form.titre;
      var texte = form.texte;
      if(titre.length > 0 && texte.length > 0) {
        var post = {
          titre: titre,
          texte: texte
        }
        appService.addPost(post).then(function(data) {
          form.titre = "";
          form.texte = "";
          appService.getAllPosts().then(function(data) {
            $scope.posts = data.data;
            // console.log($scope.posts);
            _this.commentsFetch(data.data);
          });
        });
      }
    }

    appService.getAllPosts().then(function(data) {
      $scope.posts = data.data;
      // console.log($scope.posts);
      _this.commentsFetch(data.data);
    });
  });

  app.factory('appService', function($http) {
    return {
      getAllPosts: getAllPosts,
      addPost: addPost,
      deletePost: deletePost,
      getAllComment: getAllComment,
      addComment: addComment
    };

    function getAllPosts() {
      return $http.get('/api/posts/').then(complete).catch(failed);
    }
    function addPost(post) {
      return $http.post('/api/posts/', {
        post: post
      }).then(complete).catch(failed);
    }
    function deletePost(postID) {
      console.log(postID);
      return $http.delete('/api/posts/'+postID).then(complete).catch(failed);
    }

    // Methodes commentaires
    function getAllComment(postID) {
      return $http.get('/api/comment?postID='+postID, {
        postID: postID
      }).then(complete).catch(failed);
    }
    function addComment(postID, commentaire) {
      return $http.post('/api/comment', {
        postID: postID,
        comment: commentaire
      }).then(complete).catch(failed);
    }

    function complete(response) {
      return response;
    }
    function failed(error) {
      console.log(error.statusText);
    }
  });


  /// Section DIRECTIVES
  app.directive('header', function() {
    return {
      templateUrl: 'common/headerdash.html',
      restrict: 'A'
    }
  });
  app.directive('footer', function() {
    return {
      templateUrl: 'common/footer.html',
      restrict: 'A'
    }
  });

  // app.factory('appService', function($http) {
  //   return {
  //     addMembre: addMembre
  //   };
  //   function addMembre(membre) {
  //     return $http.post('/api/membre', membre).then(complete).catch(failed);
  //   }
  //   function complete(response) {
  //     return response;
  //   }
  //   function failed(error) {
  //     console.log(error.statusText);
  //   }
  // });
})();
