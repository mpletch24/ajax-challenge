"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('TalkingBackApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'unKmpQbLjggLhWtdj3V4rk2uaEjSeFrJKFPAAEKZ';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'zUx29NJmNGsnylyrT9WpLxkvnbYVjg8UfGjr25kI';
    })
    .controller('CommentController', function($scope, $http) {

        //refreshes the list of the current comments
        $scope.refreshComments = function() {
            //get all tasks
            $scope.loading = true;
            console.log(commentsUrl);
            $http.get(commentsUrl)

            .success(function(data) {
                    $scope.comments = data.results.sort(function(first, second) {
                        if (first.score == second.score) {
                            return 0;
                        } else if (first.score < second.score) {
                            return 1;
                        } else {
                            return -1;
                        }

                    });
                })
                .error(function(err) {
                    console.log(err);
                    //notify user in some way
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; 

        //call refreshComment() to get the initial set of tasks on page load
        $scope.refreshComments();

        //initialize a new comment object on the scope for the new comment form
        $scope.addComment = function() {
            $scope.inserting = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    //add that comment to our comment list
                    $scope.comments.push($scope.newComment);
                    //change the score
                    $scope.changeScore($scope.newComment, 0);
                    //reset comment to clear the form
                    $scope.newComment = {};
                })
                .error(function(err) {
                    console.log(err);
                    //report to user in some way
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        //changes the score depending on the clicks
        $scope.changeScore = function(comment, amount) {
            if (!(comment.score <= 0 && amount < 0)) {
                var postData = {
                    score: {
                        __op: "Increment",
                        amount: amount
                    }
                };
                $scope.updating = true;
                console.log(commentsUrl);
                $http.put(commentsUrl + '/' + comment.objectId, postData)
                    .success(function(respData) {
                        comment.score = respData.score;
                    })
                    .finally(function() {
                        $scope.updating = false;
                    });
            }

        };
        //deletes a comment if the user wants to 
        $scope.deleteComment = function(comment) {
            $http.delete(commentsUrl + '/' + comment.objectId, comment)
                .finally(function() {
                    $scope.refreshComments();
                });
        };


    });