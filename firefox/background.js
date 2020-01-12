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

// Handle blocked URL
function block(requestDetails) {
	return {redirectUrl: browser.runtime.getURL('/blocked/blockpage.html')};
}

// Handles missing data
async function checkData() {
	// Load URLs from storage
	let data = await browser.storage.sync.get();

	// Create blank URL list in storage if required
	// if (!data.urlList) {
		browser.storage.sync.set({siteList: sites});
	// }
}

// Import SDK Stuff
var filter = [];
createBlocker();
browser.storage.onChanged.addListener(createBlocker);
checkData();
