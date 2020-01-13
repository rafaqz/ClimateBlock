/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Create block handler
async function createBlocker() {
	// Remove previous listener
	browser.webRequest.onBeforeRequest.removeListener(block);
	
	// Load URLs from storage
	let sites = await browser.storage.sync.get();
	
	// Check if there are URLs to load
	if (sites.siteList) {
		// Create URL fliter list
		filter = [];
		for (i = 0; i < sites.siteList.length; i++) {
      if (sites.siteList[i].active) {
        filter.push(sites.siteList[i].url);
      }
		}
		
		// Create listener
		browser.webRequest.onBeforeRequest.addListener(block, {urls: filter}, ["blocking"]);
	}
}

// Handles missing data
async function checkData() {
	// Load URLs from storage
	let data = await browser.storage.sync.get();

	// Create blank URL list in storage if required
	// if (!data.siteList) {
		browser.storage.sync.set({siteList: sites});
	// }
  
	if (!data.siteList) {
		browser.storage.sync.set({isBlocking: true});
	 }
}

// Toggle url blocking and icon
function toggleBlock() {
  if (browser.webRequest.onBeforeRequest.hasListener(block)) {
		browser.webRequest.onBeforeRequest.removeListener(block);
    browser.browserAction.setIcon({path: "icons/icon-dark-32.png"});
  } else {
		browser.webRequest.onBeforeRequest.addListener(block, {urls: filter}, ["blocking"]);
    browser.browserAction.setIcon({path: "icons/icon-32.png"});
  }
}

// Handle blocked URL
function block(details) {
    // str = JSON.stringify(details, null, 4); // (Optional) beautiful indented output.
    // console.log(str); // Logs output to dev tools console.
    return {redirectUrl: browser.runtime.getURL('/blocked/blockpage.html?url=' + details.url)};
}

browser.contextMenus.create({
  id: "blocked-site-list",
  title: "Blocked sites",
  contexts: ['all'],
  onclick: function () {
    browser.tabs.create({url: browser.extension.getURL('options/options.html')});
  },
});

var filter = [];
createBlocker();
browser.storage.onChanged.addListener(createBlocker);
browser.browserAction.onClicked.addListener(toggleBlock);
checkData();
