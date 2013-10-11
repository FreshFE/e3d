/**
 * 定义视图
 */
(function() {

	var StageView = window.StageView = Backbone.View.extend({

		/**
		 * 视图主要控制的节点区域
		 *
		 * @var string, Dom node, jQuery node
		 */
		el: "#stage",

		/**
		 * 磁性板的Dom对象
		 *
		 * @var object
		 */
		tiles: null,

		/**
		 * 模型数据
		 *
		 * @var object
		 */
		model: null,

		/**
		 * 根据模型数据调整视图
		 *
		 * @param string folder 索引data.js的目录路径
		 * @return this
		 */
		start: function(folder) {

			var that = this;

			$.get(
				'cases/' + folder + '/data.json',
				function(data) {

					// 保存数据
					that.model = data;

					// 调整stage的尺寸
					that.changeStageSize();

					// 生成Dom
					var tiles = '';

					$.each(data.tiles, function(index, value) {
						tiles += that.buildHtml(value);
					});

					// 加入Dom
					that.render(tiles);

					// 改变标题
					that.changeLogo();
					
					// 执行动画
					that.tilesSlideIn();

					// 绑定点击事件
					that.onClickEvent();
				}
			);

			return this;
		},

		/**
		 * 拼接HTML字符串
		 *
		 * @param object item
		 * @return string
		 */
		buildHtml: function(item) {
			return '<div class="tile" style="width: '+item.width+'px; height: '+item.height+'px; top: '+item.y+'px; left: '+item.x+'px;"><a href="#slide/'+ item.link +'" title="'+ item.title +'"><img src="cases/' + item.img + '"></a></div>';
		},

		/**
		 * 渲染HTML并加入stage节点以及保存至类属性
		 *
		 * @param string tiles
		 * @return this
		 */
		render: function(tiles) {
			this.tiles = $(tiles).appendTo($('#tiles'));
			return this;
		},

		/**
		 * 改变Logo的标题
		 *
		 * @return this
		 */
		changeLogo: function() {
			$('#logo').html(this.model.name);
			return this;
		},

		/**
		 * 改变stage的尺寸
		 *
		 * @return this
		 */
		changeStageSize: function() {

			var windowWidth = $(window).width();
			var windowHeight = $(window).height();

			var left = Math.floor((windowWidth - this.model.width) / 2);
			var top = Math.floor((windowHeight - this.model.height) / 2);

			// 防止顶部被遮盖
			if (top < 80) {
				top = 80;
			}
			
			this.$el.css({
				'left': left,
				'top': top,
				'width': this.model.width,
				'height': this.model.height
			});

			return this;
		},

		/**
		 * tiles飞入动画
		 *
		 * @return this
		 */
		tilesSlideIn: function() {

			// 遍历
			this.tiles.each(function(index, value) {

				// 随机顺序
				timeout = Math.floor(Math.random() * 30) * 20;

				// 随机延迟
				setTimeout(function() {
					$(value).transition({ y: 0 }, 300, 'snap');
				}, timeout);
			});

			return this;
		},

		/**
		 * tiles飞出动画
		 *
		 * @return this
		 */
		tilesSlideOut: function() {

			// 遍历
			this.tiles.each(function(index, value) {

				// 随机顺序
				timeout = Math.floor(Math.random() * 30) * 20;

				// 随机延迟
				setTimeout(function() {
					$(value).transition({ y: -1000 });
				}, timeout);
			});

			return this;
		},

		/**
		 * 绑定点击事件
		 *
		 * @return this
		 */
		onClickEvent: function() {
		},

		end: function(callback) {
			this.tilesSlideOut();

			setTimeout(function() {
				callback.call();
			}, 2000);

			return this;
		}

	});

})();


/**
 * 启动程序
 */
$(document).ready(function() {

	/**
	 * 引用全局变量
	 */
	var StageView = window.StageView;

	/**
	 * 初始化核心视图
	 */
	var stageView = null;

	/**
	 * 定义路由
	 */
	var Router = Backbone.Router.extend({

		routes: {
			"": "home",
			"slide/:folder": "slide"
		},

		home: function() {
			this.slide('');
		},

		slide: function(folder) {

			// 清除stageView，重新实例化
			if (stageView !== null) {

				// 异步执行，等end结束后执行
				stageView.end(function() {
					stageView = null;
					stageView = new StageView();
					stageView.start(folder);
				});
			}
			// 新建实例化
			else {
				stageView = new StageView();
				stageView.start(folder);
			}
		}

	});

	var router = new Router();
	Backbone.history.start();
});