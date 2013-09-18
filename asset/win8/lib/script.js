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

	/**
	 * 数据项
	 */
	$scope.items = [];

	/**
	 * 飞入动画
	 */
	$scope.flewIn = function(id, y) {

		timeout = Math.floor(Math.random() * 30) * 20;

		setTimeout(function() {
			$('#thumb-'+id).transition({
				top: y,
			}, 300, 'snap');
		}, timeout);
	}

	/**
	 * 飞出动画
	 */
	$scope.flewOut = function(id, y) {

		timeout = Math.floor(Math.random() * 30) * 20;

		id = 12 - id;

		setTimeout(function() {
			$('#thumb-'+id).transition({
				top: -1000,
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

			setTimeout(function() {

				$('#load').fadeOut(1000);

				$.each(data, function(index, value) {
					$scope.flewIn(index, value.yScale);
				});
			}, 2000);
		});
	};

	/**
	 * 关闭并跳转地址
	 */
	$scope.closed = function(id) {

		// 遍历飞出tiles
		var data = $scope.items;

		$.each(data, function(index, value) {
			$scope.flewOut(index, value.yScale);
		});

		// 跳转到指定url地址
		var url = 'view.html#' + $scope.items[id].category;

		setTimeout(function() {
			window.location.href = url;
		}, 2000);
	}

	$scope.fetch();

});