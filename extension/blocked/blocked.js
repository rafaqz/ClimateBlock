/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Get parameters from url query
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Get the url and its index in the block lis
function getUrlIndex(data) {
  // Find the site filter that matches the query url
  url = getParameterByName('url');
  index = -1;
  for (i = 0; i < data.siteList.length; i++) {
    // Remove the wildcards and match the url body
    siteFilter = data.siteList[i].url.slice(6, -2);
    if (url.includes(siteFilter)) {
      index = i;
      break;
    };
  };
  return [url, index]
}

// Set the sitesList blocked field to false for the current page
async function allowAllways(event) {
	let data = await browser.storage.local.get();
  [url, index] = getUrlIndex(data);
  if (index >= 0) {
    data.siteList[index].blocked = false;
    browser.storage.local.set({siteList: data.siteList});
    function redirect() {
      window.location.href = url;
    };
    setTimeout(redirect, 500);
    console.log("Allyways allowed: ", url);
  } else {
    console.log("Eror: Url not found in blocked list. Turn off manually or reinstall extension: ", url);
  };
}

// Set the sessionList to false for the current page
async function allowSession(event) {
	let data = await browser.storage.local.get();
  [url, index] = getUrlIndex(data);
  if (index >= 0) {
    data.sessionList[index] = false;
    browser.storage.local.set({sessionList: data.sessionList});
    function redirect() {
      window.location.href = url;
    };
    setTimeout(redirect, 500);
    console.log("Allowed for session: ", url);
  } else {
    console.log("Eror: Url not found in blocked list. Turn off manually or reinstall extension: ", url);
  };
}

// Add callbacks to page buttons
async function setupOrRedirect(){
  // Allow refresh if unblocked elsewhere
	let data = await browser.storage.local.get();
  [url, index] = getUrlIndex(data);
  if (!data.isBlocking || !data.siteList[index].blocked) {
    window.location.href = url;
  };

  var btnAllowAllways = document.getElementById('btn-allways');
  btnAllowAllways.onclick = allowAllways;

  var btnThisTime = document.getElementById('btn-this-time');
  btnThisTime.onclick = allowSession;
};

setupOrRedirect();
