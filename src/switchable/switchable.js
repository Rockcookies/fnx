var $ = require('$'),
	SwitchableBasic = require('./basic/switchable-basic'),
	Effects = require('./basic/effects');

var Switahable = SwitchableBasic.extend({
	attrs: {
		// 自动播放标记
		autoplay: false,

		// 自动播放的间隔时间
		interval: 5000,

		// 是否循环播放
		circular: false,

		// 动画效果
		effect: {
			value : 'none',
			setter: function (val) {
				return Effects[val] ? val.toLowerCase() : 'none';
			}
		},

		// 缓动函数
		easing: 'linear',

		// 动画时长
		duration: 500,

		// 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
		viewSize: null,

		// 可视窗口有多少个显示面板
		size: 1,

		// 步长不能超过 size
		step: {
			value: 1,
			getter: function (val) {
				var size = this.get('size');
				return val > size ? size : val;
			}
		}
	},

	events: {
		'mouseenter': function () {
			if (this.get('autoplay')) {
				this.stop();
				this._mouseEnterStop = true;
			}
		},
		'mouseleave': function () {
			if (this._mouseEnterStop) {
				this._mouseEnterStop = false;
				this.start();
			}
		}
	},

	_invokeEffect: function (fn) {
		var ef = Effects[this.get('effect')];
		if (ef && ef[fn]) {
			var args = Array.prototype.slice.call(arguments, 1);

			return ef[fn].apply(this, args);
		}
	},

	//初始化面板
	_initPanels: function (role) {
		Switahable.superclass._initPanels.call(this, role);
		var panels = this._invokeEffect('initPanels', this.get('panels'));

		if (panels) {
			this.set('panels', panels);
		}
	},

		// 初始化效果
	_initEffect: function () {
		if (this._invokeEffect('initEffect') === false) {
			this._ineffective = true;
		}
	},

		//切换面板
	_switchPanel: function (toIndex, fromIndex) {
		if (this._ineffective) return;

		var panelInfo = this._getPanelInfo(toIndex, fromIndex);
		this._invokeEffect('switchPanel', panelInfo);
	},

	_onRenderAutoplay: function (auto) {
		var that = this,
			interval = this.get('interval');

		if (auto) {
			stopTimer();
			that._autoplayTimer = setInterval(function () {
				if (!that._autoplayTimer) return;
				that.next();
			}, interval)
		} else {
			stopTimer();
		}

		function stopTimer () {
			if (that._autoplayTimer) {
				clearInterval(that._autoplayTimer);
				that._autoplayTimer = null;
			}
		}
	},

	start: function () {
		this.set('autoplay', true);
	},

	stop: function () {
		this.set('autoplay', false);
	},

	destroy: function () {
		this._invokeEffect('destroy');
	}
});

module.exports = Switahable;

require('class/class-loader').register('switchable/switchable', Switahable);
// Helpers
// -------
