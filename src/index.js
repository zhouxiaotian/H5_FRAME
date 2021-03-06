import './css/reset.min.css';
import './css/animate.min.css';
import './css/swiper.min.css';
import './css/main.css';

import Swiper from './js/swiper.min.js';
import './js/prefixfree.min.js';
import {
	swiperAnimateCache,
	swiperAnimate
} from './js/swiper.animate.min.js';


let SWIPER_RENDER = (function () {
	// 获取全局配置信息
	let MAINBOX = document.querySelector('#MAINBOX'),
		{
			CON: {
				DIRECTION,
				EFFECT
			},
			MUSIC,
			DESW
		} = window.CONFIG;

	/*
	 * REM的处理
	 */
	function computed() {
		let DEVW = document.documentElement.clientWidth;
		DEVW >= 750 ? DEVW = 750 : null;
		document.documentElement.style.fontSize = DEVW / DESW * 100 + 'px';
	}

	/*
	 * RENDER：重构建页面整体结构
	 */
	function render() {
		// 构建主体结构
		MAINBOX.innerHTML = `
		<div class="swiper-container">
			<div class="swiper-wrapper">
				${MAINBOX.innerHTML}
			</div>
		</div>
		${
			MUSIC?`<audio src="${MUSIC}" autoplay loop class="AUDIO"></audio>
			<a href="javascript:;" class="MUSICBTN MOVE"></a>`:``
		}
		<a href="javascript:;" class="${
			DIRECTION==='vertical'?'PREBTN':'PREBTN2'
		} PREBTN_BG"></a>`;

		// 设置SWIPER-SLIDE
		let PAGES = MAINBOX.querySelectorAll('.swiper-container>.swiper-wrapper>div');
		[].forEach.call(PAGES, function (item) {
			item.className = 'swiper-slide ' + item.className;
		});

		// 初始化SWIPER
		init_swiper();
	}

	/*
	 * 初始化SWIPER
	 */
	function init_swiper() {
		new Swiper('.swiper-container', {
			direction: DIRECTION,
			effect: EFFECT,
			loop: true,
			on: {
				init: function () {
					swiperAnimateCache(this);
					swiperAnimate(this);
				},
				slideChangeTransitionEnd: function () {
					swiperAnimate(this);

					let PREBTN_BG = document.querySelector('.PREBTN_BG');
					if (!PREBTN_BG) return;
					let n = this.activeIndex,
						slides = this.slides,
						len = slides ? slides.length : 0;
					PREBTN_BG.style.display = (n === (len - 2) || n === 0) ? 'none' : 'block';
				}
			}
		});
	}

	/*
	 * 音乐的处理
	 */
	function handl_music() {
		let $MUSICBTN = document.querySelector('.MUSICBTN'),
			AUDIO = document.querySelector('.AUDIO');
		if (!AUDIO) return;
		$MUSICBTN.addEventListener('click', (ev) => {
			if (AUDIO.paused) {
				AUDIO.play();
				$MUSICBTN.className = 'MUSICBTN MOVE';
				return;
			}
			AUDIO.pause();
			$MUSICBTN.className = 'MUSICBTN';
		});
		let play = () => {
			AUDIO.play();
			document.removeEventListener("touchstart", play, false);
		};
		AUDIO.play();
		document.addEventListener("WeixinJSBridgeReady", play, false);
		document.addEventListener("YixinJSBridgeReady", play, false);
		document.addEventListener("touchstart", play, false);
	}

	return {
		init: function () {
			computed();
			window.addEventListener('resize', computed, false);

			render();
			handl_music();
		}
	}
})();

let LOADING_RENDER = (function () {
	let LOADINGBOX = document.querySelector('#LOADINGBOX'),
		CURRENT = document.querySelector('#CURRENT'),
		MAINBOX = document.querySelector('#MAINBOX'),
		IMGDATA = window.CONFIG.LOADING;

	let n = 0,
		len = IMGDATA.length;

	let run = function run(callback) {
		IMGDATA.forEach(item => {
			let tempImg = new Image;
			tempImg.onload = () => {
				tempImg = null;
				CURRENT.innerHTML = Math.ceil(((++n) / len) * 100) + '%';
				if (n === len) {
					clearTimeout(delayTimer);
					callback && callback();
				}
			};
			tempImg.src = item;
		});
	};

	let delayTimer = null;
	let maxDelay = function maxDelay(callback) {
		delayTimer = setTimeout(() => {
			clearTimeout(delayTimer);
			if (n / len >= 0.9) {
				CURRENT.innerHTML = '100%';
				callback && callback();
				return;
			}
		}, 600000);
	};

	let done = function done() {
		let timer = setTimeout(() => {
			document.body.removeChild(LOADINGBOX);
			MAINBOX.style.display = 'block';
			clearTimeout(timer);
			SWIPER_RENDER.init();
		}, 1000);
	};

	return {
		init: function () {
			MAINBOX.style.display = 'none';
			if (len === 0) {
				document.body.removeChild(LOADINGBOX);
				MAINBOX.style.display = 'block';
				SWIPER_RENDER.init();
				return;
			}
			run(done);
			maxDelay(done);
		}
	}
})();

LOADING_RENDER.init();