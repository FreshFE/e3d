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

		initialize: function() {

			var that = this;

			$(window).resize(function() {
				that.changeStageSize();
			});
		},

		/**
		 * 根据模型数据调整视图
		 *
		 * @param string folder 索引data.js的目录路径
		 * @return this
		 */
		start: function(folder) {

			var that = this;

			$.get(
				'cases/' + folder + '.json',
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

			// 默认超链接属性
			var attr = '',
				link = '';

			// 设置特殊超链接属性
			if(item.type === 'fancybox') {
				attr = ' class="fancybox"';
				link = item.link;
			}
			else if(item.type === 'external') {
				attr = ' class="external" target="_blank"';
				link = item.link;
			}
			else {
				link = '#slide/'+ item.link;
			}

			return '<div class="tile" style="width: '+item.width+'px; height: '+item.height+'px; top: '+item.y+'px; left: '+item.x+'px;"><a href="'+ link +'" title="'+ item.title +'"'+ attr +'><img src="cases/' + item.img + '"></a></div>';
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

			$('.tiles', this.$el).css({
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

			$('.fancybox', this.tiles).on('click', function() {

				// 获得链接
				var href = $(this).attr('href');

				// 执行ajax
				$.get(
					'cases/' + href + '.json',
					function(data) {
						
						// 定义Node对象
						var $prev = $('<div class="fancybox-new-nav fancybox-new-nav-prev"></div>'),
							$next = $('<div class="fancybox-new-nav fancybox-new-nav-next"></div>');

						var resize = function() {

							// 拿到尺寸
							var wHeight = $(window).height();
							var wWidth = $('.fancybox-image').width();
							var pWidth = $('.fancybox-wrap').width();
							var pLeft = $('.fancybox-wrap').offset().left;

							// 赋值两对丑死的耳朵，破设计案
							$prev.css({
								'top': (wHeight - 100) / 2,
								'left': pLeft - 70
							});
							$next.css({
								'top': (wHeight - 100) / 2,
								'left': pLeft + pWidth + 10
							});
						}

						var opts = {
							type: 'image',
							openEffect: 'none',
							closeEffect: 'none',
							nextEffect: 'none',
							prevEffect: 'none',
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

								// 判断是否支持触摸属性，如果支持则改变关闭按钮出现的情况
								if('ontouchstart' in document.documentElement) {

									$('.fancybox-image').on('click', function() {
										$('.fancybox-close').fadeToggle();
									});
								}
								else {

									$('.fancybox-wrap').hover(function() {
										$('.fancybox-close').fadeIn();
									}, function() {
										$('.fancybox-close').hide();
									});
								}

								resize();
							},
							onUpdate: function() {
								resize();
							}
						}

						$.fancybox(data, opts);
					}
				);

				return false;
			});
		},

		end: function(callback) {

			var that = this;

			this.tilesSlideOut();

			setTimeout(function() {

				// 移除DOM元素
				that.tiles.remove();

				// 回调方法
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
			this.slide('main');
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