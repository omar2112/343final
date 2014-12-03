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
        	downvote: true
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

        
        //this method will validate the result to see if the comment is already on the database. If it passes, continueComment is called.
        //continueComment is the old addComment function.
        $scope.addComment = function () {
            $scope.loading = true;
            $scope.temp;
            var temp;

            $http.get(urlBeginning + '?where={"comment":"' + $scope.newComment.comment + '"}') //results.length == 0 wihtin .sucess. 
                .success(function (data) {
                    console.log(data);
                    $scope.temp = data.results.length;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);

                })
                .finally(function () {
                    console.log("inside length: " + $scope.temp); 
                    if ($scope.temp == 0) {
                        console.log("this does work");
                        $scope.continueComment();
                        $scope.loading = false;

                    } else {
                        console.log("this does not work");
                        $scope.form.$setPristine();
                        $scope.loading = false;
                    }

                });           
        };

        $scope.continueComment = function() {
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
                            score: 1, 
                            downvote: true
                        };
                    });
                
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

        /*$scope.deleteComment = function (comment) {
            $http.delete(urlBeginning + '/' + comment.objectId, comment)
                .success(function(respData) {
                    $scope.refreshComments();
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                });
        };*/
    });

$(document).ready(function() {
    if(!localStorage.getItem('userName')) {
        getUserName();
    }
    console.log(localStorage.getItem('userName'));
    $('#name').val(localStorage.getItem('userName'));
});

function getUserName(){
    var counter = 2;
    $.get('lib/adjectives.txt', function(data) {
        var adjectiveLines = data.split('\n');
        console.log(adjectiveLines);
        console.log(Math.floor((Math.random() * (adjectiveLines.length - 1))));
        localStorage.setItem('adjective', adjectiveLines[Math.floor((Math.random() * (adjectiveLines.length - 1)))]);
        console.log(localStorage.getItem('adjective'));
        counter--;
        if(counter == 0) {
            localStorage.setItem('userName', localStorage.getItem('adjective') + ' ' + localStorage.getItem('noun'));
            console.log(localStorage.getItem('userName'));
        }
    });
    $.get('lib/nouns.txt', function(data) {
        var nounLines = data.split('\n');
        console.log(nounLines);
        console.log(Math.floor((Math.random() * (nounLines.length - 1))));
        localStorage.setItem('noun', nounLines[Math.floor((Math.random() * (nounLines.length - 1)))]);
        console.log(localStorage.getItem('noun'));
        counter--;
        if(counter == 0) {
            localStorage.setItem('userName', localStorage.getItem('adjective') + ' ' + localStorage.getItem('noun'));
            console.log(localStorage.getItem('userName'));
        }
    });
}


