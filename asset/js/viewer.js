var app = angular.module('App', []);

app.controller('WallController', function($scope, $http) {

	/**
	 * 解析描点
	 */
	function getHashArray() {
		return window.location.hash.split('#')[1].split('-');
	}

	$scope.viewer = [];

	$scope.menu = [];

	$scope.fetchMenu = function() {

		var hashArray = getHashArray();

		$http({
			method: "GET",
			url: 'cases/' + hashArray[0] + '/menu.json'
		}).success(function(data, status, headers, config) {

			console.log(data);
			$scope.menu = data;
		});
	}

	/**
	 * 远程获值并执行遍历动画
	 */
	$scope.fetchViewer = function() {

		var hashArray = getHashArray();

		$http({
			method: "GET",
			url: 'cases/' + hashArray[0] + '/' + hashArray[1] + '/config.json'
		}).success(function(data, status, headers, config) {

			console.log(data);
			$scope.viewer = data;
		});
	};

	$scope.fetchMenu();
	$scope.fetchViewer();

});