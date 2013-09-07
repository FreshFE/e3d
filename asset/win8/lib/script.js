/**
 * 定位#place的高度
 */
$(document).ready(function() {

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	var left = Math.floor((windowWidth - 975) / 2);
	var top = Math.floor((windowHeight - 480) / 2) - 80;
	
	$('#place').css({'left': left, 'top': top});
});


/**
 * Angular JS
 */
var app = angular.module('App', []);

app.controller('HomeController', function($scope, $http) {

	$scope.items = [];

	$scope.fetch = function() {
		$http({
			method: "GET",
			url: 'cases/cover/cover.json'
		}).success(function(data, status, headers, config) {

			$scope.items = data;
		});
	};

	$scope.fetch();

});