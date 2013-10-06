/**
 * 定义APP类
 */
(function($) {

	var App = function() {};

	App.prototype = {

		/**
		 * App 舞台
		 */
		$stage: $('#stage'),

		/**
		 * 获得远程数据
		 */
		fetch: function() {

			$.ajax({
			});
		}
	};

	window.App = App;

})(jQuery);


/**
 * 定义执行和事件绑定
 */
$(document).ready(function() {

	var app = new App();

});