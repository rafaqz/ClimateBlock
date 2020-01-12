/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Load settings
async function restore() {
	// Load list from storage
	let data = await browser.storage.sync.get();
	siteData = data.siteList;
	
	// Add items to GUI table
	var list = document.getElementById('site-list');
	for (i = 0; i < data.siteList.length; i++) {
		createItem(data.siteList[i]);
	}
}

// Save settings
function save() {
	browser.storage.sync.set({siteList:siteData});
}

// Create item GUI
function createItem(site) {
	var list = document.getElementById('site-list');
	
	// Create item container
	var container = document.createElement('div');
	container.className = 'list-item';
	
	// Create item text label
	var name = document.createElement('span');
	name.textContent = site.name;
	var url = document.createElement('span');
	url.textContent = site.url;
	var url = document.createElement('span');
	url.textContent = site.url;
  var active = document.createElement('input');
  active.type = 'checkbox';
  active.id = site.name.replace(/ /g,"_").toLowerCase(); // need unique Ids!
  active.checked = site.active;
	
	// Merge items
	container.appendChild(name);
	container.appendChild(url);
	container.appendChild(active);
	list.appendChild(container);
}

var siteData;
// Run when page loads
window.onload = function(){
	restore();
	// document.getElementsByTagName('header')[0].addEventListener('click',changeMenu);
};
