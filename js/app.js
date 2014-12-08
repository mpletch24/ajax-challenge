//Talking Back App

var baseUrl = 'https://api.parse.com/1/classes/comments';

angular.module('TalkingBackApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'w73YUelOtatsiR9khfgq2nDzl82Amps7bcDMmJNj';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'GJrqH5g1T93dmcJU90yGZU7cepnWg7COYixmE4vD';
    })
    .controller('CommentController', function($scope, $http) {

        //retrieve comments
        $scope.retrieveComments = function() {
            $scope.loading = true;
            $http.get(baseUrl)

            .success(function(data) {
                    $scope.comments = data.results.sort(function(commentA, commentB) {
                        if (commentA.score == commentB.score) {
                            return 0;
                        } else if (commentA.score < commentB.score) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                })
                .error(function(err) {
                    console.log(err);
                    // notify user of error
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; //refreshComments

        //get initial set of tasks when page loads
        $scope.retrieveComments();

        //initialize new comment object 
        $scope.addComment = function() {
            $http.post(baseUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    //add that comment to our comment list
                    $scope.comments.push($scope.newComment);
                    //change the score
                    $scope.updateScore($scope.newComment, 0);
                    //reset comment to clear the form
                    $scope.newComment = {};
                })
                .error(function(err) {
                    console.log(err);
                    // notify user of error
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };

        //changes score depending on up-votes or down-votes
        $scope.updateScore = function(comment, amount) {
            if (!(comment.score <= 0 && amount < 0)) {
                var postData = {
                    score: {
                        __op: "Increment",
                        amount: amount
                    }
                };
                $scope.updating = true;
                console.log(base);
                $http.put(baseUrl + '/' + comment.objectId, postData)
                    .success(function(respData) {
                        comment.score = respData.score;
                    })
                    .finally(function() {
                        $scope.updating = false;
                    });
            }
        };

        //delete comment
        $scope.deleteComment = function(givenComment) {
            $http.delete(baseUrl + '/' + comment.objectId, comment)
                .finally(function() {
                    $scope.refreshComments();
            });
        };
    });