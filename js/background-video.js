/*
*	NOTE: defined for YouTube only
*
*	Argument:
*	oSettings = {
*		elementID,
*		videoID,
*		aspectRatio,
*		qualityDesktop,
*		qualityMobile,
*		playerVolume,
*		autoplay,
*		loop,
*		playlist
*	}
*
*	Where:
*	elementID: string which identifies the HTML node to insert the video.
*		example: <div id="elementID"></div>
*	videoID: string which identifies the video (as definded by YouTube)
*	aspectRatio: string which identifies the aspect ratio of the video
*		allowed values: '16-9', '4-3', '3-2', '8-5'
*		default value: '16-9'
*		check the video's aspect ratio before making the setting.
*	qualityDesktop: the desired video quality on Desktop devices
*		default value: 'medium'
*	qualityMobile: the desired video quality on Mobile devices
*		default value: 'small'
*	playerVolume: 0 to 100 (100 being loudest)
default: 100
*	autoplay: true or false. Default is false.
*	loop: true or false. Default is false.
*	playlist: comma separated list. Default is ''.
*/

backgroundVideo = function() {
	var isValid = false;
	var isScriptLoaded = false;
	var player;
	var o;
	var donePlaying = false;
	var nVolume;
	var sQuality;
	var nAutoPlay = 0;
	var nLoop = 0;
	var sPlayList = '';

	var oVHW = {}; // Video Height, Video Width

	function init(oSettings) {
		o = oSettings;

		validate(o);

		if (isValid === false ) {
			console.log('background-video could not be initialized...')
			return;
		}

		if (o.hasOwnProperty('aspectRatio')) {
			oVHW = sizeHeight(o.elementID, o.aspectRatio);
		} else {
			oVHW = sizeHeight(o.elementID, '16-9');
		}

		if (o.hasOwnProperty('playerVolume')) {
			nVolume = o.playerVolume;
		} else {
			nVolume = 100
		}
		if (o.hasOwnProperty('qualityDesktop')) {
			sQuality = o.qualityDesktop;
		} else {
			sQuality = 'medium';
		}
		if (oVHW.width < 768) {
			if (o.hasOwnProperty('qualityMobile')) {
				sQuality = o.qualityMobile;
			} else {
				sQuality = 'small';
			}
		}
		if (o.hasOwnProperty('autoplay')) {
			if (o.autoplay) {
				nAutoPlay = 1;
			}
		}
		if (o.hasOwnProperty('playlist')) {
			if (Object.prototype.toString.call(o.playlist) === '[object String]') {
				sPlayList = o.playlist;
			}
		}
		if (o.hasOwnProperty('loop')) {
			if (o.loop) {
				nLoop = 1;
				if (sPlayList !== '') {
					if (sPlayList.indexOf(o.videoID) === -1) {
						sPlayList = sPlayList + ',' + o.videoID;
					}
				} else {
					sPlayList = o.videoID;
				}
			}
		}

		loadScript();

	}

	function sizeHeight(sTarget, sAspectRatio) {
		//16-9', '4-3', '3-2', '8-5
		var oParentElement = window.document.getElementById(sTarget).parentElement;
		var width = oParentElement.offsetWidth;
		var height = 0;

		if (sAspectRatio === '4-3') {
			height = Math.ceil(width * (3 / 4));
		} else if (sAspectRatio === '3-2') {
			height = Math.ceil(width * (2 / 3));
		} else if (sAspectRatio === '8-5') {
			height = Math.ceil(width * (5 / 8));
		} else {
			height = Math.ceil(width * (9 / 16));
		}

		oParentElement.style.height = height + 'px';
		oParentElement.style.width = width + 'px';
		var nCorrection = Math.ceil(oParentElement.offsetHeight / 4);
		var sInset = 'inset('+ nCorrection + 'px 0px ' + nCorrection + 'px 0px)';

		oParentElement.style.clipPath = sInset;
		oParentElement.style.marginTop = (nCorrection * -1) + 'px';
		oParentElement.style.marginBottom = (nCorrection * -1) + 'px';
		return { height: height, width: width };
	}

	function validate(o) {
		if (typeof value != 'undefined' && value) {
			if (o.elementID === '') {
				return;
			}
			if (o.videoID === '') {
				return;
			}
		};
		isValid = true;
	}

	function loadScript() {
		var sSource = 'https://www.youtube.com/iframe_api';
		var list = document.getElementsByTagName('script');
		var i = list.length
		var firstLoad = false;

		while (i--) {
			if (list[i].src === sSource) {
				isScriptLoaded = true;
				break;
			}
		}
		if (isScriptLoaded === false) {
			var tag = document.createElement('script');
			tag.src = sSource;
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			firstLoad = true;
		}

		if (firstLoad === true || isScriptLoaded === true) {
			console.log('YouTube is initialized...')
		}
	}

	function onPlayerReady(event) {
		event.target.setVolume(nVolume);
		event.target.playVideo();
		var oElement = window.document.getElementById(o.elementID);
		oElement.removeAttribute('height');
		oElement.removeAttribute('width');
	}

	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.PLAYING && !donePlaying) {
			donePlaying = true;
		}
	}

	function play() {
		player = new YT.Player(o.elementID, {
			height: oVHW.height.toString(),
			width: oVHW.width.toString(),
			videoId: o.videoID,
			playerVars: {
				'autoplay': nAutoPlay,
				'cc_load_policy': 0,
				'controls': 0,
				'disablekb': 1,
				'fs': 0,
				'iv_load_policy': 3,
				'loop': nLoop,
				'modestbranding': 1,
				'playlist': sPlayList,
				'rel': 0,
				'showinfo': 0,
				'vq': sQuality
			},
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}

	return {
		init: init,
		play: play,
		resize: sizeHeight
	};
};

/*
 *	Acknowledgement:
 *	https://developer.mozilla.org/en-US/docs/Web/Events/resize
 */

(function() {

  window.addEventListener("resize", resizeThrottler, false);

  var resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        actualResizeHandler();

       // The actualResizeHandler will execute at a rate of 15fps
       }, 66);
    }
  }

  // function actualResizeHandler() {
  //   // handle the resize event
	// 	// remark this function out completely and then place a version of it where you need it...
  // }

}());
