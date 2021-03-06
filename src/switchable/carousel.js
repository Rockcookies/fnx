var Switchable = require('switchable/switchable'),
	$ = require('$');

// 旋转木马组件
var Carousel = Switchable.extend({
	attrs : {
		circular : true,

		autoplay: false,

		prevBtn : {
			getter : function (val) {
				return $(val).eq(0);
			}
		},

		nextBtn : {
			getter : function (val) {
				return $(val).eq(0);
			}
		},

		disabledBtnClass : {
			getter : function (val) {
				return val ? val : this.get("classPrefix") + '-disabled-btn';
			}
		}
	},

	setup: function () {
		Carousel.superclass.setup.call(this);
		this.render();
	},

	_initConstClass: function () {
		Carousel.superclass._initConstClass.call(this);
		$.extend(this.CONST, constClass(this.get('classPrefix')));
	},

	_initTriggers : function (role) {
		Carousel.superclass._initTriggers.call(this, role);

		// attr 里没找到时，才根据 data-role 来解析
		var prevBtn = this.get('prevBtn');
		var nextBtn = this.get('nextBtn');

		if (!prevBtn[0] && role.prev) {
			prevBtn = role.prev;
			this.set('prevBtn', prevBtn);
		}

		if (!nextBtn[0] && role.next) {
			nextBtn = role.next;
			this.set('nextBtn', nextBtn);
		}

		prevBtn.addClass(this.CONST.PREV_BTN_CLASS);
		nextBtn.addClass(this.CONST.NEXT_BTN_CLASS);
	},

	_bindTriggers : function () {
		Carousel.superclass._bindTriggers.call(this);

		var that = this;
		var circular = this.get('circular');

		this.get('prevBtn').click(function (ev) {
			ev.preventDefault();
			if (circular || that.get('activeIndex') > 0) {
				that.prev();
			}
		});

		this.get('nextBtn').click(function (ev) {
			ev.preventDefault();
			var len = that.get('length') - 1;
			if (circular || that.get('activeIndex') < len) {
				that.next();
			}
		});

		// 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
		// circular = true 时，无需处理
		if (!circular) {
			this.on('switch', function (toIndex) {
				that._updateButtonStatus(toIndex);
			});
		}
	},

	_getDatasetRole : function () {
		var role = Carousel.superclass._getDatasetRole.call(this);
		var btnRoles = Carousel.superclass._parseDatasetRole.call(this, ['next', 'prev']);

		$.extend(role, btnRoles);

		return role;
	},

	_updateButtonStatus : function (toIndex) {
		var prevBtn = this.get('prevBtn');
		var nextBtn = this.get('nextBtn');
		var disabledBtnClass = this.get("disabledBtnClass");

		prevBtn.removeClass(disabledBtnClass);
		nextBtn.removeClass(disabledBtnClass);

		if (toIndex === 0) {
			prevBtn.addClass(disabledBtnClass);
		} else if (toIndex === this.get('length') - 1) {
			nextBtn.addClass(disabledBtnClass);
		}
	}
});

module.exports = Carousel;

require('class/class-loader').register('switchable/carousel', Carousel);


// Helpers
// -------
function constClass(classPrefix) {
	return {
		PREV_BTN_CLASS: classPrefix ? classPrefix + '-prev-btn': '',
		NEXT_BTN_CLASS: classPrefix ? classPrefix + '-next-btn': ''
	}
}
