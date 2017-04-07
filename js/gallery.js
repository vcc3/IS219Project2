// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/
// Swap Photo function
function swapPhoto() {
  if(mCurrentIndex == mImages.length-1){
    mCurrentIndex = -1;
  }
  // incrment after it does a check and then display the  info
  mCurrentIndex++;
  $('#photo').attr('src', mImages[mCurrentIndex].imgPath);
  //assign the details to the text with text replace.
  $('.location').text(mImages[mCurrentIndex].location);
  $('.description').text(mImages[mCurrentIndex].description);
  $('.date').text(mImages[mCurrentIndex].date);


}
// part 4
function getQueryParams(qs) {
  qs = qs.split("+").join(" ");
  var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;
      while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      }
      return params;

}
// setting the $_GET as the defualt of images if it cant find another json file or it doesnt open up.
// that means that getQuery is responsible for looking at the input and determing  the json asked.
var $_GET = getQueryParams(document.location.search);
console.log($_GET['json']);
//look at the var $_GET and see if the getQuery params assigned it anything, if it has set the $_GET['mUrl'] as image.json
// the [] has to be whats being wirtten in the url address bar. so if the query is index.html?json=extra.json,  then i need to have the var called json here.
if($_GET['json' ] == "undefined" || $_GET['json'] == null){
  $_GET['json'] = "images.json";
}
// mUrl vlaue set
var mUrl = $_GET['json'];
// counter now set to -1 so starts at 0 becuase counter ++ sets it back to 0
var mCurrentIndex = -1;
// already added from the file
var mRequest = new XMLHttpRequest();
// Array holding GalleryImage objects (see below).
var mImages = [];
// Holds the retrived JSON information
var mJson;


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

// here is where all click functions go
$(document).ready( function() {
 
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();
  // button clickable
  $('.moreIndicator').click(function(){
    $('.moreIndicator').toggleClass('rot90 rot270');
    $('.details').fadeToggle(500);
  });
// set foward function. i had coutner set at -1 so here will be set at lenght -1.
// when calling the swap photo it increments up again
  $('#nextPhoto').click(function(){
    if(mCurrentIndex == mImages.length-1){
      mCurrentIndex = -1;
    }
    // calling  here does the mCounterIndex ++
    swapPhoto();
    //reset the clock
    mLastFrameTime = 0;
  });
  // have to start back here from -2  instead of -1this way itll go back correctly becuase it checks ot see if its at position 0 if not then then itlll be lenght . current.  the ++then moves it back
  $('#prevPhoto').click(function(){
    if(mCurrentIndex == 0){
      mCurrentIndex = mImages.length-2;
    }
    else{
      mCurrentIndex-=2;
    }
    //calls ++ again and checks to see what psoition we are on right now
    swapPhoto();
    //reset clock
    mLastFrameTime = 0;
  });


});

window.addEventListener('load', function() {

	console.log('window loaded');

}, false);

// setting the info form the json file to something the mImage can read and have ready
function GalleryImage(location, description, date, imgPath) {
  this.location = location;
  this.description = description;
  this.date = date;
  this.imgPath = imgPath;
}

function reqListener () {
  console.log(this.responseText);
}

var mRequest = new XMLHttpRequest();
mRequest.onreadystatechange = function() {
// Do something interesting if file is opened successfully
if (mRequest.readyState == 4 && mRequest.status == 200) {
try {
    // Let’s try and see if we can parse JSON
    mJson = JSON.parse(mRequest.responseText);
    for(var i= 0; i<mJson.images.length;i++){
      var line = mJson.images[i];
      // add the json info into a array for glalery images
      mImages.push(new GalleryImage(line.imgLocation,line.description,line.date,line.imgPath))
    }
    console.log(mImages);
    // Let’s print out the JSON; It will likely show as “obj”
    console.log(mJson);
    } catch(err) {
    console.log(err.message)
    }
  }
};
mRequest.open("GET", mUrl, true);
mRequest.send();