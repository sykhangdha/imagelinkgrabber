// ==UserScript==
// @name         Image Link Grabber for Tampermonkey
// @namespace    http://skyha.rf.gd
// @version      1.0
// @description  Attempt to grab all image links from website
// @author       skyha
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Function to validate if the URL points to an image
    function isImageUrl(url) {
        return /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i.test(url);
    }

    // Create "Grab All Image Links" button
    const grabButton = document.createElement('button');
    grabButton.textContent = 'Grab All Image Links';
    grabButton.style.position = 'fixed';
    grabButton.style.top = '10px';
    grabButton.style.left = '10px';
    grabButton.style.padding = '10px';
    grabButton.style.zIndex = '9999';
    document.body.appendChild(grabButton);

    // Function to grab all image links from the page (img, meta, and background images)
    function grabImageLinks() {
        const imageLinks = new Set(); // Using a Set to ensure no duplicates

        // 1. Get all <meta> tags and search for image URLs in 'content' attributes
        const metaTags = document.querySelectorAll('meta');
        metaTags.forEach(tag => {
            const content = tag.getAttribute('content');
            if (content && isImageUrl(content)) {
                imageLinks.add(content); // Add to Set (duplicates will be ignored)
            }
        });

        // 2. Get all <img> tags and extract their 'src' attribute for image links
        const imgTags = document.querySelectorAll('img');
        imgTags.forEach(img => {
            const src = img.getAttribute('src');
            if (src && isImageUrl(src)) {
                imageLinks.add(src); // Add to Set (duplicates will be ignored)
            }
        });

        // 3. Get all background-image URLs from stylesheets or inline styles
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const backgroundImage = window.getComputedStyle(element).getPropertyValue('background-image');
            if (backgroundImage && backgroundImage !== 'none') {
                const urlMatch = backgroundImage.match(/url\(["']?(https?:\/\/.*?\.(jpg|jpeg|png|gif|webp|bmp|tiff))["']?\)/i);
                if (urlMatch) {
                    imageLinks.add(urlMatch[1]); // Add to Set (duplicates will be ignored)
                }
            }
        });

        return [...imageLinks]; // Convert Set back to array for use
    }

    // Function to copy links to clipboard and alert the user
    function copyToClipboardAndAlert(imageLinks) {
        if (imageLinks.length > 0) {
            const imageLinksString = imageLinks.join('\n');
            GM_setClipboard(imageLinksString);
            alert(`${imageLinks.length} image links copied to clipboard!`);
        } else {
            alert('No valid image links found!');
        }
    }

    // Add event listener for the "Grab All Image Links" button
    grabButton.addEventListener('click', function() {
        const imageLinks = grabImageLinks();
        copyToClipboardAndAlert(imageLinks);
    });
})();
