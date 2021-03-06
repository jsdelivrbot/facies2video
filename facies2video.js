(function($) {

    function loadScript(url, callback) {
	// from http://stackoverflow.com/a/756526
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.src = url;
	var done = false;
	script.onload = script.onreadystatechange = function() {
	    if (!done && ( !this.readyState 
			   || this.readyState == "loaded" 
			   || this.readyState == "complete")) {
		done = true;
		callback();
		head.removeChild( script );
	    }
	};

	head.appendChild(script);
    }

    function getJpegURLs() {
	return $("#chat-list > li > img").map(function() {
	    return $(this).attr("src");
	}).get().reverse();
    }

    function jpegToWebP(jpegURL) {
	var canvas = document.createElement("canvas"),
	context = canvas.getContext("2d"),
	img = new Image();
	img.src = jpegURL;
	canvas.height = 300;
	canvas.width = 300;
	context.drawImage(img, 0, 0);
	return canvas.toDataURL('image/webp','');
    }

    function faciesToVideoBlobURL(framerate) {
	var jpegs = getJpegURLs(),
	webps = jpegs.map(jpegToWebP),
	blob = Whammy.fromImageArray(webps, framerate);
	return URL.createObjectURL(blob);
    }

    function createVideo(src) {
	var video = document.createElement("video");
	video.loop = "loop";
	video.autoplay = "autoplay";
	video.controls = "controls";
	video.src = src;
	return video;
    }

    function renderFaciesVideo(mount, framerate) {
	var videoBlob = faciesToVideoBlobURL(framerate),
	video = createVideo(videoBlob);
	mount.appendChild(video);
    }

    function mountModal(mountNode) {
	var modal = document.createElement("div"),
	    controls = document.createElement("div"),
	    framerateText = document.createElement("span"),
	    framerate1 = document.createElement("button"),
	    framerate5 = document.createElement("button"),
	    framerate10 = document.createElement("button"),
	    framerate25 = document.createElement("button")
	    framerate500 = document.createElement("button")
	    close = document.createElement("button"),
	    video = document.createElement("div");

	controls.id = "controls";
	video.id = "video";
	close.id = "close";

	framerateText.innerText = "framerate"
	framerate1.innerText = "1";
	framerate5.innerText = "5";
	framerate10.innerText = "10";
        framerate25.innerText = "25";
	framerate500.innerText = "500";

	controls.appendChild(framerateText);
	controls.appendChild(framerate1);
	controls.appendChild(framerate5);
	controls.appendChild(framerate10);
	controls.appendChild(framerate25);
	controls.appendChild(framerate500);
	controls.appendChild(close);
	modal.appendChild(controls);
	modal.appendChild(video);

	close = $(close);
	controls = $(controls);

	close.text("✖");
	close.css({
	    "float": "right"
	});
	close.on("click", function(e) {
	    $(modal).remove();
	});

	controls.css({
	    "padding": "10px",
	    "height": "25px",
	    "box-style": "border-box",
	    "border-bottom": "2px solid black"
	});
	controls.find("button").css({
	    "cursor": "pointer"
	});
	controls.on("click", "button", function(e) {
	    var buttonText = $(this).text(),
	        framerate = parseInt(buttonText, 10);
	    if (isNaN(framerate)) return;
	    $(video).empty();
	    renderFaciesVideo(video, framerate);
	});

	$(modal).css({
	    "position": "absolute",
	    "width": "300px",
	    "height": "325px",
            "margin": "0",
	    "padding": "0",
	    "display": "block",
	    "background-color": "deepskyblue",
	    "box-style": "border-box",
	    "left": "50%",
	    "margin-left": "-150px"
	});

	mountNode.appendChild(modal);
    }

    loadScript("https://cdn.jsdelivr.net/gh/antimatter15/whammy/whammy.js", function() {
	mountModal(document.body);
    });

})(jQuery);
