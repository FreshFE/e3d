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

	/**
	 * 动画方法
	 */
	$scope.flewIn = function(id, y, timeout) {

		timeout = id * 150;

		setTimeout(function() {
			$('#thumb-'+id).transition({
				top: y
			}, 1000, 'snap')
			.transition({
				// perspective: '500px',
				rotateY: '180deg'
			}, timeout, 'snap')
			.transition({
				rotateY: '360deg'
			});
		}, timeout);
	}

	/**
	 * 远程获值并执行遍历动画
	 */
	$scope.fetch = function() {
		$http({
			method: "GET",
			url: 'cases/cover/cover.json'
		}).success(function(data, status, headers, config) {

			$scope.items = data;

			$.each(data, function(index, value) {
				$scope.flewIn(index + 1, value.yScale, value.timeout);
			});
		});
	};

	$scope.fetch();

});