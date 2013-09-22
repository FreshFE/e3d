var app = angular.module('App', []);

app.controller('WallController', function($scope, $http) {

	/**
	 * 解析描点
	 */
	function getHashArray() {
		return window.location.hash.split('#')[1].split('-');
	}

	$scope.viewer = [];

	$scope.menus = [];

	$scope.fetchMenus = function() {

		var hashArray = getHashArray();

		$http({
			method: "GET",
			url: 'cases/' + hashArray[0] + '/menu.json'
		}).success(function(data, status, headers, config) {
			$scope.menus = data;
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

			$scope.viewer = data;

			var $prev = $('<div class="fancybox-new-nav fancybox-new-nav-prev"></div>');
			var $next = $('<div class="fancybox-new-nav fancybox-new-nav-next"></div>');
			var $title = $('.fancybox-title span.child');

			var resize = function() {

				// 拿到尺寸
				var wHeight = $(window).height();
				var wWidth = $('.fancybox-image').width();
				var pWidth = $('.fancybox-wrap').width();
				var pLeft = $('.fancybox-wrap').offset().left;

				// 赋值两对丑死的耳朵，破设计案
				$prev.css({
					'top': (wHeight - 100) / 2,
					'left': pLeft - 80
				});
				$next.css({
					'top': (wHeight - 100) / 2,
					'left': pLeft + pWidth + 20
				});

				// 调整关闭按钮位置
				$('.fancybox-title span.child').css({'width': wWidth - 20});
			}

			$(".fancybox").fancybox({
				openEffect	: 'none',
				closeEffect	: 'none',
				padding: 0,
				margin: 100,
				afterShow: function() {

					$prev.appendTo($('.fancybox-overlay'))
						 .on('click', function() {
						 	$.fancybox.prev();
						 });
					$next.appendTo($('.fancybox-overlay'))
						 .on('click', function() {
						 	$.fancybox.next();
						 });

					resize();
				},
				onUpdate: function() {
					resize();
				}
			});
		});
	};

	$scope.fetchMenus();
	$scope.fetchViewer();

	$(window).bind('hashchange', function() {
		$scope.viewer = [];
		$scope.fetchViewer();
	});

});

$(document).ready(function() {

	$('#J_header').transition({
		'top': 0
	}, 800, 'ease');

});