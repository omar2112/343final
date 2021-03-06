"use strict";

var urlBeginning = 'https://api.parse.com/1/classes/input';

var timer;

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
        $('#name').val(localStorage.getItem('userName'));
        $scope.userName= localStorage.getItem('userName');

        $scope.addReply = function(comment) {
            var elem = $('.reply-body');

            var coolstring;

            elem.each(function(i, item) {
                console.log(item.value);
                if(item.value||item.value!="") {
                    console.log('hi');
                    coolstring = item.value;
                }
                item.value = '';
            });

            var obj = {
                name: localStorage.getItem('userName'),
                reply: coolstring
            };
            comment.replyArray.push(obj);            
            $http.put(urlBeginning + '/' + comment.objectId, {
                replyArray: comment.replyArray
            })
                .success(function (responseData) {
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                });   
        };

        $scope.refreshComments = function () {
            $scope.loading = true;
            $http.get(urlBeginning + "?order=-score")
                .success(function (data) {
                    $scope.comments = data.results;
                    $('#name').val(localStorage.getItem('userName'));
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                })
                .finally(function () {
                    $scope.loading = false;
                    $('#name').val(localStorage.getItem('userName'));
                });
        };

        $scope.refreshComments();
        $('#name').val(localStorage.getItem('userName'));

        //this method will validate the result to see if the comment is already on the database. If it passes, continueComment is called.
        $scope.addComment = function () {
            $scope.loading = true;
            $scope.temp;
            var temp;
            $('#name').val(localStorage.getItem('userName'));

            $http.get(urlBeginning + '?where={"comment":"' + $scope.newComment.comment + '"}') //results.length == 0 wihtin .sucess. 
                .success(function (data) {
                    console.log(data);
                    $scope.temp = data.results.length;
                    $('#name').val(localStorage.getItem('userName'));
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
                        $('#name').val(localStorage.getItem('userName'));
                    } else {
                        alert("you can't post the same thing twice");
                        console.log("this does not work");
                        $scope.loading = false;
                        $('#name').val(localStorage.getItem('userName'));
                    }
                });           
        };

        $scope.continueComment = function() {
            $http.post(urlBeginning, $scope.newComment)
                    .success(function (responseData) {
                        $scope.newComment.objectId = responseData.objectId;
                        $scope.newComment.name = localStorage.getItem('userName');
                        $scope.comments.push($scope.newComment);
                        $('#name').val(localStorage.getItem('userName'));
                    })
                    .error(function (err) {
                        $scope.errorMessage = err;
                        console.log(err);
                    })
                    .finally(function() {
                        $('#name').val(localStorage.getItem('userName'));
                        $scope.newComment = {
                            score: 0,
                            name: localStorage.getItem('userName'),
                            replyArray: []
                        };
                        $('#name').val(localStorage.getItem('userName'));
                        $scope.refreshComments();
                    });
                $('#name').val(localStorage.getItem('userName'));
                }; 

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



