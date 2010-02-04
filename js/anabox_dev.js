/* -----------------------------------------------------------------------------------
	AnaBox v 0.3
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
 * @version 0.3
 * @copyright Thomas Mayer 2009
 *
 **/
(function () {
	var anabox = function () {

		// configurables
		var fileLoadingImage = '/images/loading.gif',
			fileBottomNavCloseImage = '/images/closelabel.gif',
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
			captionObj,

			self = {};

		/**
		 * resizes image container
		 *
		 * @param {int} newWidth new width of image container
		 * @param {int} newHeight new height of image container
		 * @param {int} yOffset offset of the viewport in vertical direction
		 * @type null
		 */
		self.resizeImageContainer = function (newWidth, newHeight, yOffset) {
			imageContainerObj.style.width = newWidth + 'px';
			imageContainerObj.style.height = newHeight + 'px';
			anaboxImageObj.width = newWidth;
			anaboxImageObj.height = newHeight;
			var containerWidth = newWidth + 2 * borderSize,
				containerHeight = newHeight + 2 * borderSize,
				overlayWidth = overlayObj.style.width,
				overlayHeight = overlayObj.style.height;
			outerImageContainerObj.style.width = containerWidth + 'px';
			outerImageContainerObj.style.height = containerHeight + 'px';
			prevLinkObj.style.height = containerHeight + 'px';
			nextLinkObj.style.height = containerHeight + 'px';
			nextLinkObj.style.height = containerHeight + 'px';
			imageDataContainerObj.style.width = containerWidth + 'px';
			// resize overlay if image too large
			if (containerWidth > overlayWidth.substring(0, (overlayWidth.length - 2))) {
				overlayObj.style.width = containerWidth + 'px';
			}
			if ((containerHeight + yOffset) > overlayHeight.substring(0, (overlayHeight.length - 2))) {
				overlayObj.style.height = (containerHeight + yOffset + 100) + 'px';
			}
		};

		/**
		 * sets display of overlay and anabox to none
		 *
		 * @type null
		 */
		self.out = function () {
			overlayObj.style.display = "none";
			anaboxObj.style.display = "none";
		};

		/**
		 * updateImageList, creates DOM for anabox
		 *
		 * @constructor
		 * @type null
		 */
		self.initialize = function () {
			self.updateImageList();
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
				self.out();
				return false;
			};
			overlay.style.display = 'none';
			document.body.appendChild(overlay);
			overlayObj = overlay;
			anabox.id = 'anabox';
			anabox.style.display = 'none';
			document.body.appendChild(anabox);
			anaboxObj = anabox;
			outerImageContainer.id = 'outerImageContainer';
			anabox.appendChild(outerImageContainer);
			outerImageContainerObj = outerImageContainer;
			imageContainer.id = 'imageContainer';
			outerImageContainer.appendChild(imageContainer);
			imageContainerObj = imageContainer;
			anaboxImage.id = 'anaboxImage';
			imageContainer.appendChild(anaboxImage);
			anaboxImageObj = anaboxImage;
			hoverNav.id = 'hoverNav';
			imageContainer.appendChild(hoverNav);
			prevLink.id = 'prevLink';
			prevLink.href = '#';
			hoverNav.appendChild(prevLink);
			prevLinkObj = prevLink;
			nextLink.id = 'nextLink';
			nextLink.href = '#';
			hoverNav.appendChild(nextLink);
			nextLinkObj = nextLink;
			loading.id = 'loading';
			imageContainer.appendChild(loading);
			loadingObj = loading;
			loadingImage.src = 'images/loading.gif';
			loading.appendChild(loadingImage);
			imageDataContainer.id = 'imageDataContainer';
			anabox.appendChild(imageDataContainer);
			imageDataContainerObj = imageDataContainer;
			imageData.id = 'imageData';
			imageDataContainer.appendChild(imageData);
			imageDetails.id = 'imageDetails';
			imageData.appendChild(imageDetails);
			caption.id = 'caption';
			imageDetails.appendChild(caption);
			caption.appendChild(document.createTextNode(''));
			captionObj = caption;
			numberDisplay.id = 'numberDisplay';
			imageDetails.appendChild(numberDisplay);
			numberDisplay.appendChild(document.createTextNode(''));
			numberDisplayObj = numberDisplay;
			bottomNav.id = 'bottomNav';
			imageData.appendChild(bottomNav);
			bottomNavClose.id = 'bottomNavClose';
			bottomNavClose.href = '#';
			bottomNavClose.onclick = function () {
				self.out();
				return false;
			};
			bottomNav.appendChild(bottomNavClose);
			closeImage.src = 'images/close.gif';
			bottomNavClose.appendChild(closeImage);
			overlayObj.style.height = overlayHeight + 'px';
			overlayObj.style.width = overlayWidth + 'px';

		};

		/**
		 * selects a-Elements, adds onclick attributes
		 *
		 * @type null
		 */
		self.updateImageList = function () {
			var aElements = document.getElementsByTagName("a"),
				i;
			for (i = 0; i < aElements.length; i += 1) {
				if (aElements[i].rel.match(/^anabox(\[([a-zA-Z 0-9\-_]*)\])?$/)) {
					aElements[i].onclick = function () {
						self.popup(this);
						return false;
					};
				}
			}
		};

		/**
		 * displays overlay, fills imageSet, imageArray, calls displayImage
		 *
		 * @param {object} linkObj anchor element with information to display
		 * @type null
		 */
		self.popup = function (linkObj) {
			var anaRel = linkObj.rel,
				anaLink = linkObj.href,
				anaTitle = linkObj.title,
				imageNum = 0,
				aElements,
				i;
			overlayObj.style.display = 'block';
			anaboxObj.style.display = 'block';
			// clear imageSet/Array
			imageSet = undefined;
			imageArray = [];
			if (anaRel.length > 6) {
				imageSet = anaRel.substr(7);
				imageSet = imageSet.substr(0, (imageSet.length - 1));
				aElements = document.getElementsByTagName("a");
				for (i = 0; i < aElements.length; i += 1) {
					if (aElements[i].rel === anaRel) {
						imageArray.push([aElements[i].href, aElements[i].title]);
					}
				}
				while (imageArray[imageNum][0] !== anaLink) {
					imageNum += 1;
				}
			} else {
				imageArray.push([anaLink, anaTitle]);
			}
			self.displayImage(imageNum);
		};

		/**
		 * displays image and information, resizes container
		 *
		 * @param {int} imageNum number of the image in a group of images to display
		 * @type null
		 */
		self.displayImage = function (imageNum) {
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
			anaboxObj.style.top = topScroll + 'px';
			anaboxObj.style.top = topScroll + 'px';
			overlayObj.style.left = xScroll + 'px';
			anaboxObj.style.left = xScroll + 'px';
			anaboxImageObj.style.display = 'none';
			loadingObj.style.display = 'block';
			if (imageNum === 0) {
				prevLinkObj.style.display = 'none';
			} else {
				prevLinkObj.onclick = function () {
					self.displayImage(imageNum - 1);
					return false;
				};
				prevLinkObj.style.display = 'block';
			}
			if (imageNum === (imageArray.length - 1)) {
				nextLinkObj.style.display = 'none';
			} else {
				nextLinkObj.onclick = function () {
					self.displayImage(imageNum + 1);
					return false;
				};
				nextLinkObj.style.display = 'block';
			}
			imgPreloader = new Image();
			imgPreloader.onload = function () {
				anaboxImageObj.src = imgPreloader.src;
				self.resizeImageContainer(imgPreloader.width, imgPreloader.height, topScroll);
				anaboxImageObj.style.display = 'inline';
				loadingObj.style.display = 'none';
			};
			imgPreloader.src = imageArray[imageNum][0];
			if (imageArray[imageNum][1]) {
				captionObj.firstChild.data = imageArray[imageNum][1];
			} else {
				captionObj.firstChild.data = '';
			}
			if (imageArray.length > 1) {
				numberDisplayObj.firstChild.data = labelImage + ' ' + (imageNum + 1) + ' ' + labelOf + ' ' + imageArray.length;
			} else {
				numberDisplayObj.firstChild.data = '';
			}
		};
		return self;
	};
	window.anabox = anabox();

/**
 * adds Anabox initialization to body onload attribute
 */
	if (window.addEventListener) {
		window.addEventListener('load', function () {
			window.anabox.initialize();
		}, false);
	} else if (window.attachEvent) {
		window.attachEvent('onload', function () {
			window.anabox.initialize();
		});
	} else if (typeof window.onload === 'undefined') {
		window.onload = function () {
			window.anabox.initialize();
		};
	} else {
		window.onload = window.onload && function () {
			window.anabox.initialize();
		};
	}
}());
