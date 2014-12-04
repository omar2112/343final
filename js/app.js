"use strict";

var urlBeginning = 'https://api.parse.com/1/classes/input';

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'MFVa6bsPTrjcOViE9pTjgtRS582f3l2twgWo1GzL';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '5xSs9vIg8vZRLezwMw1E9ydrOgqnCAxj9151SMd6';
    })
    .controller('AjaxController', function($scope, $http) {
        $scope.newComment = {
        	score: 0, 
            name: localStorage.getItem('userName'),
            replyArray: []
        };

        $scope.addReply = function() {
            var elem = $('#reply-body');
            console.log(elem);
            var coolstring = elem.val();
            console.log(coolstring);
            //$scope.newComment.replyArray.push(coolstring);
            //var Gamescore = Parse.Object.extend("GameScore");
            //var query = new Parse.Query(Gamescore);
            
            /*
            var ref = $("#objectId");

            var GameScore = Parse.Object.extend("GameScore");
            var query = new Parse.Query(GameScore);
            query.get(ref, {
             success: function(gameScore) {
                // The object was retrieved successfully.
                gameScore.addUnique("replyArray", coolstring);
            },
            error: function(object, error) {
                console.log(error);*/
                     // The object was not retrieved successfully.
             // error is a Parse.Error with an error code and message.
            }
        });



            //query.get("rPq8ASYEdt", {
             //   success: function(gameScore) {

               // }
            //})
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
            console.log('teting from omar' + $scope.newComment.comment);

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
                        //$scope.newComment.name = localStorage.getItem('userName');
                        //console.log(localStorage.getItem('userName'));
                        $scope.comments.push($scope.newComment);
                    })
                    .error(function (err) {
                        $scope.errorMessage = err;
                        console.log(err);
                    })
                    .finally(function() {
                        $scope.form.$setPristine();
                        $scope.newComment = {
                            score: 1
                        };
                    });
                
                }; 

        //ORIGINAL CHANGESCORE FUNCTION. UNCOMMENT IF WE CANT GET IP TO WORK
        /*$scope.changeScore = function(comment, amount) {
            if (amount == 1) {
                $scope.updateScore(comment, amount);
            } else if (comment.score == 0 && amount == -1) {
                comment.downvote = false;
            } else if (amount == -1 && comment.downvote) {
                $scope.updateScore(comment, amount);
            }
        };*/

        $scope.changeScore = function(comment, amount) {
            var ip;
            $.getJSON('http://jsonip.com/?callback=?', function(r) { 
                changeWithIP(comment, amount, r.ip); 
            });   
        };

        function changeWithIP(comment, amount, ip){
            $http.put(urlBeginning + '/' + comment.objectId, {
                score: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function (responseData) {
                    comment.score = responseData.score;
                    console.log(ip);
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                });
        }
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
            $('#name').val(localStorage.getItem('userName'));
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
            $('#name').val(localStorage.getItem('userName'));
        }
    });
}



