"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var urlBeginning = 'https://api.parse.com/1/classes/input';

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'S2WiA5MuUpr4c04YWPq7Y0mTZ8tTuFO7fJP6eIQQ';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LFJHXc3B5tll4AsaQPYpJ4Ni3NpeRXdKQJrBj6om';
    	//--data-urlencode 'order=score';
    })
    .controller('AjaxController', function($scope, $http) {
        $scope.newComment = {
        	score: 0, 
        	downvote: true,
        };

        $scope.refreshComments = function () {
            $scope.loading = true;
            $http.get(urlBeginning + "?order=-score")
                .success(function (data) {
                    $scope.comments = data.results;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        $scope.addComment = function () {
            $scope.loading = true;
            $http.post(urlBeginning, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                })
                .finally(function() {
                    $scope.form.$setPristine();
                    $scope.newComment = {
                    	score: 0, 
                    	downvote: true,
                    };
                    $scope.loading = false;
                })
        };

        $scope.changeScore = function(comment, amount) {
            if (amount == 1) {
                $scope.updateScore(comment, amount);
            } else if (comment.score == 0 && amount == -1) {
                comment.downvote = false;
            } else if (amount == -1 && comment.downvote) {
                $scope.updateScore(comment, amount);
            }
        };

        $scope.updateScore = function(comment, amount) {
            $http.put(urlBeginning + '/' + comment.objectId, {
                score: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function (responseData) {
                    comment.score = responseData.score;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                });
        };

        $scope.deleteComment = function (comment) {
            $http.delete(urlBeginning + '/' + comment.objectId, comment)
                .success(function(respData) {
                    $scope.refreshComments();
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                });
        };
    });