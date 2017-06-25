# background-video
Defined to use with YouTube only.

##How to use
Define a variable using backgroundVideo. For example:
```
<script>
  var oVideo = backgroundVideo();
</script>
```

Define a variable to configure the video object. For example:
```
<script>
  ...
  var oBV01 = {
      elementID: 'fullWidth',
      videoID: 'LO13tXK2V8M',
      playerVolume: 0,
      loop: true,
      autoplay: true
  }
</script>
```
The required HTML:
```
<section class="full-width background-video aspect-ratio-16-9">
  <div id="fullWidth"></div>
</section>
```

##Available Settings
The Settings object accepts the following arguments:
  elementID: the target HTML element
  videoID: the YouTube video you wish to play

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
