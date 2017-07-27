/*
 *
 * Copyright (c) Rob Welan
 * Location: https://github.com/robwelan/background-video
 * Read All About It: https://creatureoftech.com/
 * Connect: https://au.linkedin.com/in/robwelan
 * License: MIT
 *
 */

backgroundVideo = function () {
  var isValid = false;
  var isScriptLoaded = false;
  var player;
  var o;
  var donePlaying = false;
  var nVolume;
  var sQuality;
  var nAutoPlay = 0;
  var nLoop = 0;
  var sPlayList = "";
  var nClipTop = 0;

  var oVHW = {}; // Video Height, Video Width

  function init(oSettings) {
    o = oSettings;

    validate(o);

    if (isValid === false) {
      console.log("background-video could not be initialized...");
      return;
    }
    if (o.hasOwnProperty("clipTop")) {
      if (o.clipTop > 0) {
        nClipTop = o.clipTop;
      }
    }

    oVHW = sizeHeight();

    if (o.hasOwnProperty("playerVolume")) {
      nVolume = o.playerVolume;
    } else {
      nVolume = 100;
    }

    if (o.hasOwnProperty("qualityDesktop")) {
      sQuality = o.qualityDesktop;
    } else {
      sQuality = "medium";
    }

    if (oVHW.width < 768) {
      if (o.hasOwnProperty("qualityMobile")) {
        sQuality = o.qualityMobile;
      } else {
        sQuality = "small";
      }
    }

    if (o.hasOwnProperty("autoplay")) {
      if (o.autoplay) {
        nAutoPlay = 1;
      }
    }

    if (o.hasOwnProperty("playlist")) {
      if (Object.prototype.toString.call(o.playlist) === "[object String]") {
        sPlayList = o.playlist;
      }
    }

    if (o.hasOwnProperty("loop")) {
      if (o.loop) {
        nLoop = 1;
        if (sPlayList !== "") {
          if (sPlayList.indexOf(o.videoID) === -1) {
            sPlayList = sPlayList + "," + o.videoID;
          }
        } else {
          sPlayList = o.videoID;
        }
      }
    }

    loadScript();
  }

  function returnParameter(sParameter) {
    if ((sParameter = "isScriptLoaded")) {
      return isScriptLoaded;
    }
  }

  function hasClass(element, sClass) {
    return (" " + element.className + " ").indexOf(" " + sClass + " ") > -1;
  }

  function clipVideo(oParent, oTarget, height, fixHeight) {
    var nT = nClipTop;
    var nB = 0;
    var nD = 0;
    var sCP = "";
    var nCB = 0;
    var sCa = "";
    var sCb = "";
    var nMT = 0;
    var nMB = 0;

    if (height > fixHeight) {
      nD = height - fixHeight;
      if (fixHeight > nClipTop) {
        nB = height - fixHeight - nClipTop;
        sCP = "inset(" + nT + "px 0px " + nB + "px 0px)";
        //	clipBottom (nCB) is: imageHeight - desiredHeight + topClip + bottomClip
        //	clipTop (nCT) is: topClip
        nCB = nClipTop + fixHeight;
        sCa = "clip: rect(" + nT + "px auto " + nCB + "px 0px)";
        sCb = "clip: rect(" + nT + "px, auto, " + nCB + "px, 0px)";

        if (nClipTop > 0) {
          nMT = nClipTop * -1;
        }

        nMB = (height - fixHeight - nClipTop) * -1;

        oTarget.style.clip = sCa;
        oTarget.style.clip = sCb;

        oTarget.style.webkitClipPath = sCP;
        oTarget.style.mozClipPath = sCP;
        oTarget.style.msClipPath = sCP;
        oTarget.style.oClipPath = sCP;
        oTarget.style.clipPath = sCP;

        oTarget.style.marginTop = nMT + "px";
        oTarget.style.marginBottom = nMB + "px";
      }
    } else {
      if (o.hasOwnProperty('clipRatioHorizontal')) {
        var nRemainingHeight = oParent.offsetHeight - (oParent.offsetHeight * o.clipRatioHorizontal);
        var nClipHeight = Math.ceil(oParent.offsetHeight * o.clipRatioHorizontal);
        nCB = nClipHeight + nRemainingHeight;
        nMT = Math.ceil((oParent.offsetHeight * o.clipRatioHorizontal) + 1) * -1;
        nMB = Math.ceil((oParent.offsetHeight * o.clipRatioHorizontal) + 1) * -1;
        oParent.style.marginTop = nMT + "px";
        oParent.style.marginBottom = nMB + "px";
        console.log(nRemainingHeight)
        // Clip
        sCa = "clip: rect(" + nClipHeight + "px auto " + nRemainingHeight + "px 0px)";
        sCb = "clip: rect(" + nClipHeight + "px, auto, " + nRemainingHeight + "px, 0px)";
        oParent.style.clip = sCa;
        oParent.style.clip = sCb;
        // ClipPath
        sCP = "inset(" + nClipHeight + "px 0px " + nClipHeight + "px 0px)";
        oParent.style.webkitClipPath = sCP;
        oParent.style.mozClipPath = sCP;
        oParent.style.msClipPath = sCP;
        oParent.style.oClipPath = sCP;
        oParent.style.clipPath = sCP;
      } else {
        nMT = Math.ceil((oParent.offsetHeight * 0.0042328 + 2) * -1);
        nMB = Math.ceil((oParent.offsetHeight * 0.0042328 + 2) * -1);
        oParent.style.marginTop = nMT + "px";
        oParent.style.marginBottom = nMB + "px";
      }
    }
  }

  function sizeHeight() {
    //16-9', '4-3', '3-2', '8-5
    var sTarget = o.elementID;
    var sAspectRatio = "";

    if (o.hasOwnProperty("aspectRatio")) {
      sAspectRatio = o.aspectRatio;
    } else {
      sAspectRatio = "16-9";
    }

    var oThis = {};
    var oTarget = window.document.getElementById(sTarget);
    var oParentElement = oTarget.parentElement;
    var width = 0;
    var height = 0;

    if (hasClass(oParentElement, "limited-width")) {
      width = oParentElement.offsetWidth;
    } else {
      width = window.innerWidth;
    }

    if (sAspectRatio === "4-3") {
      height = Math.ceil(width * (3 / 4));
    } else if (sAspectRatio === "3-2") {
      height = Math.ceil(width * (2 / 3));
    } else if (sAspectRatio === "8-5") {
      height = Math.ceil(width * (5 / 8));
    } else {
      height = Math.ceil(width * (9 / 16));
    }

    if (hasClass(oParentElement, "fixed-height")) {
      var fixHeight = oParentElement.offsetHeight;
      oTarget.style.height = height + "px";
      clipVideo(oParentElement, oTarget, height, fixHeight);
    } else {
      oTarget.style.height = height + "px";
      oParentElement.style.height = height + "px";
      clipVideo(oParentElement, oTarget, 0, 0);
    }

    oParentElement.style.width = width + "px";

    oThis = {
      height: height,
      width: width
    };
    return oThis;
  }

  function validate(o) {
    if (typeof value != "undefined" && value) {
      if (o.elementID === "") {
        return;
      }
      if (o.videoID === "") {
        return;
      }
    }
    if (o.hasOwnProperty("height")) {
      if (o.height > 0) {
        if (o.hasOwnProperty("clipTop")) {
          if (o.clipTop <= 0) {
            return;
          }
        } else {
          return;
        }
      }
    }
    isValid = true;
  }

  function loadScript() {
    var sSource = "https://www.youtube.com/iframe_api";
    var list = document.getElementsByTagName("script");
    var i = list.length;
    var firstLoad = false;

    while (i--) {
      if (list[i].src === sSource) {
        isScriptLoaded = true;
        break;
      }
    }
    if (isScriptLoaded === false) {
      var tag = document.createElement("script");
      tag.src = sSource;
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      firstLoad = true;
    }

    if (firstLoad === true || isScriptLoaded === true) {
      if (o.hasOwnProperty("verbose")) {
        if (o.verbose === false) {
          return;
        }
      }
      console.log("Video " + o.videoID + " is initialized...");
    }
  }

  function onPlayerReady(event) {
    event.target.setVolume(nVolume);
    event.target.playVideo();
    var oElement = window.document.getElementById(o.elementID);
    oElement.removeAttribute("height");
    oElement.removeAttribute("width");
  }

  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !donePlaying) {
      donePlaying = true;
    }
  }

  function play() {
    if (isValid === false) {
      return;
    }

    player = new YT.Player(o.elementID, {
      height: oVHW.height.toString(),
      width: oVHW.width.toString(),
      videoId: o.videoID,
      playerVars: {
        autoplay: nAutoPlay,
        cc_load_policy: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        loop: nLoop,
        modestbranding: 1,
        playlist: sPlayList,
        rel: 0,
        showinfo: 0,
        vq: sQuality
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  }

  return {
    parameterResize: returnParameter,
    init: init,
    play: play,
    resize: sizeHeight
  };
};

/*
 *	Acknowledgement:
 *	https://developer.mozilla.org/en-US/docs/Web/Events/resize
 */

(function () {
  window.addEventListener("resize", resizeThrottler, false);

  var resizeTimeout;

  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
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
})();