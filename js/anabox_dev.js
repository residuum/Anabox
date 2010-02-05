/* -----------------------------------------------------------------------------------
	AnaBox v 0.2.1
	by Thomas Mayer - http://ix.residuum.org/anabox.html
	License: MIT license, i.e. more or less: Do As Thou Wilst (with the code) Shall
	Be The Whole of The Law.

	Copyright (c) 2009 Thomas Mayer

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

	Thanks: Lokesh Dhakar for Lightbox, Stackoverflow for onLoadListener from
	external JavaScript (http://stackoverflow.com/questions/552524/onload-from-external-js-file),
	the newsgroup comp.lang.javascript for code review and testing, and of course
	Steffy for being so patient with me ("just another little function for tonight, OK?").

 -----------------------------------------------------------------------------------

	Table of Contents
	-----------------
	AnaBox Class Declaration
	- variables (configurables first)
	- resizeImageContainer (resizes containers of anything about the image)
	- out (sets display:none)
	- initialize (updateImageList, createDom)
	- updateImageList (append onclick to anabox links)
	- popup (displays overlay, displayImage)
	- displayImage (display the image, prev/nextLink, title etc., resizeImageContainer)

	Global function call
	- attach Anabox to window.onload
----------------------------------------------------------------------------------- */

/**
 * @package AnaBox
 * @author Thomas Mayer <thomas@residuum.org>
 * @link http://ix.residuum.org/anabox.html
 * @version 0.2
 * @copyright Thomas Mayer 2009
 *
 **/
function AnaBox() {
	// configurables
	var fileLoadingImage = 'images/loading.gif',
		fileBottomNavCloseImage = 'images/close.gif',
		borderSize = 10,
		labelImage = "Image",
		labelOf = "of",

	// other variables
		imageArray = [],
		imageSet,

	// will be filled during construction of anabox
		overlayObj,
		anaboxObj,
		outerImageContainerObj,
		imageContainerObj,
		anaboxImageObj,
		imageDataContainerObj,
		prevLinkObj,
		nextLinkObj,
		loadingObj,
		numberDisplayObj,
		captionObj;

	/**
	 * resizes image container
	 *
	 * @param {int} width
	 * @param {int} height
	 * @return {null}
	 */
	this.resizeImageContainer = function (newWidth, newHeight, yOffset) {
		this.imageContainerObj.style.width = newWidth + 'px';
		this.imageContainerObj.style.height = newHeight + 'px';
		this.anaboxImageObj.width = newWidth;
		this.anaboxImageObj.height = newHeight;
		var containerWidth = newWidth + 2 * borderSize,
			containerHeight = newHeight + 2 * borderSize,
			overlayWidth = this.overlayObj.style.width,
			overlayHeight = this.overlayObj.style.height;
		this.outerImageContainerObj.style.width = containerWidth + 'px';
		this.outerImageContainerObj.style.height = containerHeight + 'px';
		this.prevLinkObj.style.height = containerHeight + 'px';
		this.nextLinkObj.style.height = containerHeight + 'px';
		this.nextLinkObj.style.height = containerHeight + 'px';
		this.imageDataContainerObj.style.width = containerWidth + 'px';
		// resize overlay if image too large
		if (containerWidth > overlayWidth.substring(0, (overlayWidth.length - 2))) {
			this.overlayObj.style.width = containerWidth + 'px';
		}
		if ((containerHeight + yOffset) > overlayHeight.substring(0, (overlayHeight.length - 2))) {
			this.overlayObj.style.height = (containerHeight + yOffset + 100) + 'px';
		}
	};

	/**
	 * sets display of overlay and anabox to none
	 *
	 * @return {null}
	 */
	this.out = function () {
		this.overlayObj.style.display = "none";
		this.anaboxObj.style.display = "none";
	};

	/**
	 * updateImageList, creates DOM for anabox
	 *
	 * @constructor
	 * @return {null}
	 */
	this.initialize = function () {
		this.updateImageList();
		var overlay = document.createElement('div'),
			anabox = document.createElement('div'),
			outerImageContainer = document.createElement('div'),
			imageContainer = document.createElement('div'),
			anaboxImage = document.createElement('img'),
			hoverNav = document.createElement('div'),
			prevLink = document.createElement('a'),
			nextLink = document.createElement('a'),
			loading = document.createElement('div'),
			loadingImage = document.createElement('img'),
			imageDataContainer = document.createElement('div'),
			imageData = document.createElement('div'),
			imageDetails = document.createElement('div'),
			caption = document.createElement('span'),
			numberDisplay = document.createElement('span'),
			bottomNav = document.createElement('div'),
			bottomNavClose = document.createElement('a'),
			closeImage = document.createElement('img'),
			//resize overlay
			overlayHeight = Math.max(
				Math.max(document.body.clientHeight, document.documentElement.clientHeight),
				Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
				Math.max(document.body.offsetHeight, document.documentElement.offsetHeight)
			),
			overlayWidth = Math.max(
				Math.max(document.body.clientWidth, document.documentElement.clientWidth),
				Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
				Math.max(document.body.offsetWidth, document.documentElement.offsetWidth)
			);


		overlay.id = 'overlay';
		overlay.onclick = function () {
			window.ana.out();
			return false;
		};
		overlay.style.display = 'none';
		document.body.appendChild(overlay);
		this.overlayObj = overlay;
		anabox.id = 'anabox';
		anabox.style.display = 'none';
		document.body.appendChild(anabox);
		this.anaboxObj = anabox;
		outerImageContainer.id = 'outerImageContainer';
		anabox.appendChild(outerImageContainer);
		this.outerImageContainerObj = outerImageContainer;
		imageContainer.id = 'imageContainer';
		outerImageContainer.appendChild(imageContainer);
		this.imageContainerObj = imageContainer;
		anaboxImage.id = 'anaboxImage';
		imageContainer.appendChild(anaboxImage);
		imageContainer.style.padding = borderSize + 'px';
		this.anaboxImageObj = anaboxImage;
		hoverNav.id = 'hoverNav';
		imageContainer.appendChild(hoverNav);
		prevLink.id = 'prevLink';
		prevLink.href = '#';
		hoverNav.appendChild(prevLink);
		this.prevLinkObj = prevLink;
		nextLink.id = 'nextLink';
		nextLink.href = '#';
		hoverNav.appendChild(nextLink);
		this.nextLinkObj = nextLink;
		loading.id = 'loading';
		imageContainer.appendChild(loading);
		this.loadingObj = loading;
		loadingImage.src = fileLoadingImage;
		loading.appendChild(loadingImage);
		imageDataContainer.id = 'imageDataContainer';
		anabox.appendChild(imageDataContainer);
		this.imageDataContainerObj = imageDataContainer;
		imageData.id = 'imageData';
		imageDataContainer.appendChild(imageData);
		imageDetails.id = 'imageDetails';
		imageData.appendChild(imageDetails);
		caption.id = 'caption';
		imageDetails.appendChild(caption);
		caption.appendChild(document.createTextNode(''));
		this.captionObj = caption;
		numberDisplay.id = 'numberDisplay';
		imageDetails.appendChild(numberDisplay);
		numberDisplay.appendChild(document.createTextNode(''));
		this.numberDisplayObj = numberDisplay;
		bottomNav.id = 'bottomNav';
		imageData.appendChild(bottomNav);
		bottomNavClose.id = 'bottomNavClose';
		bottomNavClose.href = '#';
		bottomNavClose.onclick = function () {
			window.ana.out();
			return false;
		};
		bottomNav.appendChild(bottomNavClose);
		closeImage.src = fileBottomNavCloseImage;
		bottomNavClose.appendChild(closeImage);
		this.overlayObj.style.height = overlayHeight + 'px';
		this.overlayObj.style.width = overlayWidth + 'px';

	};

	/**
	 * selects a-Elements, adds onclick attributes
	 *
	 * @return {null}
	 */
	this.updateImageList = function () {
		var aElements = document.getElementsByTagName("a"),
			i;
		for (i = 0; i < aElements.length; i += 1) {
			if (aElements[i].rel.match(/^anabox(\[([a-zA-Z 0-9\-_]*)\])?$/)) {
				aElements[i].onclick = function () {
					window.ana.popup(this);
					return false;
				};
			}
		}
	};

	/**
	 * displays overlay, fills imageSet, imageArray, calls displayImage
	 *
	 * @param {object} linkObj
	 * @return {null}
	 */
	this.popup = function (linkObj) {
		var anaRel = linkObj.rel,
			anaLink = linkObj.href,
			anaTitle = linkObj.title,
			imageNum = 0,
			aElements,
			i;
		this.overlayObj.style.display = 'block';
		this.anaboxObj.style.display = 'block';
		// clear imageSet/Array
		this.imageSet = undefined;
		this.imageArray = [];
		if (anaRel.length > 6) {
			this.imageSet = anaRel.substr(7);
			this.imageSet = this.imageSet.substr(0, (this.imageSet.length - 1));
			aElements = document.getElementsByTagName("a");
			for (i = 0; i < aElements.length; i += 1) {
				if (aElements[i].rel === anaRel) {
					this.imageArray.push([aElements[i].href, aElements[i].title]);
				}
			}
			while (this.imageArray[imageNum][0] !== anaLink) {
				imageNum += 1;
			}
		} else {
			this.imageArray.push([anaLink, anaTitle]);
		}
		this.displayImage(imageNum);
	};

	/**
	 * displays image and information, resizes container
	 *
	 * @param {int} imageNum
	 * @return {null}
	 */
	this.displayImage = function (imageNum) {
		var yScroll,
			xScroll,
			docHeight,
			topScroll,
			imgPreloader;
		if (window.pageYOffset) {
			yScroll = window.pageYOffset;
			xScroll = window.pageXOffset;
		} else {
			yScroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
			xScroll = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		}
		if (window.innerHeight) {
			docHeight = window.innerHeight;
		} else {
			docHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
		}
		topScroll = yScroll + (docHeight / 10);
		this.anaboxObj.style.top = topScroll + 'px';
		this.anaboxObj.style.top = topScroll + 'px';
		this.overlayObj.style.left = xScroll + 'px';
		this.anaboxObj.style.left = xScroll + 'px';
		this.anaboxImageObj.style.display = 'none';
		this.loadingObj.style.display = 'block';
		if (imageNum === 0) {
			this.prevLinkObj.style.display = 'none';
		} else {
			this.prevLinkObj.onclick = function () {
				window.ana.displayImage(imageNum - 1);
				return false;
			};
			this.prevLinkObj.style.display = 'block';
		}
		if (imageNum === (this.imageArray.length - 1)) {
			this.nextLinkObj.style.display = 'none';
		} else {
			this.nextLinkObj.onclick = function () {
				window.ana.displayImage(imageNum + 1);
				return false;
			};
			this.nextLinkObj.style.display = 'block';
		}
		imgPreloader = new Image();
		imgPreloader.onload = (function () {
			window.ana.anaboxImageObj.src = imgPreloader.src;
			window.ana.resizeImageContainer(imgPreloader.width, imgPreloader.height, topScroll);
			window.ana.anaboxImageObj.style.display = 'inline';
			window.ana.loadingObj.style.display = 'none';
		});
		imgPreloader.src = this.imageArray[imageNum][0];
		if (this.imageArray[imageNum][1]) {
			this.captionObj.firstChild.data = this.imageArray[imageNum][1];
		} else {
			this.captionObj.firstChild.data = '';
		}
		if (this.imageArray.length > 1) {
			this.numberDisplayObj.firstChild.data = labelImage + ' ' + (imageNum + 1) + ' ' + labelOf + ' ' + this.imageArray.length;
		} else {
			this.numberDisplayObj.firstChild.data = '';
		}
	};
	AnaBox.prototype.constructor = this.initialize();
}

/**
 * adds Anabox initialization to body onload attribute
 */
if (window.addEventListener) {
	window.addEventListener('load', function () {
		window.ana = new AnaBox();
	}, false);
} else if (window.attachEvent) {
	window.attachEvent('onload', function () {
		window.ana = new AnaBox();
	});
} else if (typeof window.onload === 'undefined') {
	window.onload = function () {
		window.ana = new AnaBox();
	};
} else {
	window.onload = window.onload && function () {
		window.ana = new AnaBox();
	};
}
