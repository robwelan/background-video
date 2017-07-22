# background-video
Defined to use with YouTube only.

Here's an example: <a href="https://robwelan.github.io/background-video/" target="_blank">https://robwelan.github.io/background-video/</a>.

## Instructions
Define a variable using backgroundVideo. For example:  
```javascript
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
    autoplay: true,
    clipTop: 168
  }
</script>
```

The required HTML:
```
<section class="background-video width-100%">
  <div id="fullWidth"></div>
</section>
```

## Required Settings
The Settings object accepts the following required arguments:  
### elementID
* String
* the ID of the target HTML element
  
### videoID
* String
* the ID of the YouTube video you wish to play
  
### Minimum Settings Definition
The minimum required object definition needed to initialize and use `backgroundVideo()` is:
```javascript
var oSettings = {
  elementID: 'id',
  videoID: '<you-tube-id>'
}
```
  
## Optional Settings
The following optional arguments can also be included:
### aspectRatio
* String
* identifies the aspect ratio of the video  
* Allowed values: '16-9', '4-3', '3-2', '8-5'  
* default value: '16-9'  

**NOTE**: check the video's aspect ratio before making the setting.
### qualityDesktop
* String
* describes the desired video quality on Desktop devices
* default value: 'medium'

### qualityMobile
* String
* describes the desired video quality on Desktop devices
* default value: 'small'
  
### playerVolume
* Number
* 0 to 100
* 0 equals no sound at all
* 100 is loudest volume possible
* default value: 100

### autoplay
* Boolean
* default value: false

### loop
* Boolean
* default value: false

### playlist
* String (comma separated string list)
* default value: ''

### clipTop
* Number (pixels)
* default value: 0
* how much clip to remove from top of video
* clip to remove from the bottom is calculated based on remaining height

NOTE: clipTop looks for 'fixed-height' to be added to the class of the parent object.

### Complete Settings Definition
```javascript
var oSettings = {
  elementID: 'id',
  videoID: '<you-tube-id>',
  aspectRatio: '4-3',
  qualityDesktop: 'large',
  qualityMobile: 'small',
  playerVolume: 0,
  autoplay: true,
  loop: false,
  playlist: '',
  clipTop: 0
}
```

---

## YouTube iFrame API
For more information about the YouTube iFrame API, follow this link: [https://developers.google.com/youtube/iframe_api_reference](https://developers.google.com/youtube/iframe_api_reference)