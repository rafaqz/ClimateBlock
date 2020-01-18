/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Load settings
async function buildList() {
	// Load list from storage
	let data = await browser.storage.sync.get();
	siteList = data.siteList;
	sessionList = data.sessionList;
	
	// Add items to GUI table
	for (i = 0; i < siteList.length; i++) {
		createItem(siteList[i], sessionList[i], i);
	}

  var blockAll = document.getElementById('cb-all');

  blockAll.onclick = async function(event) {
    // Update site list
    let data = await browser.storage.sync.get();
    for (i = 0; i < siteList.length; i++) {
      data.siteList[i].active = this.checked;
      data.sessionList[i] = true; 
    };
    browser.storage.sync.set({siteList: data.siteList});
    browser.storage.sync.set({sessionList: data.sessionList});

    // Update all toggles
    var toggles = document.getElementsByClassName('tgl-single');
    var statusLabels = document.getElementsByClassName('status-single');

    for (var i=0; i < toggles.length; i++) {
      toggles[i].checked = this.checked;
      statusLabels[i].textContent = labelStatus(this.checked); 
    };
  };
}

// Create item GUI
function createItem(site, sessionval, index) {

  blocked = site.active && sessionval;

	var list = document.getElementById('site-list');
	
	// Create item container
	var container = document.createElement('div');
	container.className = 'list-item flex-parent';
	
	// Create item text label
	var name = document.createElement('div');
  name.className = "name flex-child"
	name.textContent = site.name;

	var url = document.createElement('div');
  url.className = "url flex-child"
	url.textContent = site.url;

  var toggle = document.createElement('div');
  toggle.className = "toggle flex-child"
  toggleid = 'cb' + index;
  var togglecheck = document.createElement('input');
  togglecheck.type = 'checkbox';
  togglecheck.id = toggleid;
  togglecheck.checked = blocked;
  togglecheck.className = "tgl tgl-light tgl-single";
  togglecheck.onclick = function(event) {
    if (this.checked) setBlock(index, true);
    else setBlock(index, false);
  };
  var togglelabel = document.createElement('label');
  togglelabel.className = "tgl-btn";
  togglelabel.htmlFor = toggleid;
  toggle.appendChild(togglecheck);
  toggle.appendChild(togglelabel);

  var statusLabel = document.createElement('label');
  statusLabel.id = 'status' + index;
  statusLabel.className = 'status status-single';
  statusLabel.textContent = labelStatus(blocked);

	toggle.appendChild(statusLabel);
	
	// Merge items
	container.appendChild(name);
	container.appendChild(url);
	container.appendChild(toggle);
	list.appendChild(container);
}

async function setBlock(index, blocked) {
	// Load data from storage
	let data = await browser.storage.sync.get();

  // Set status label
  var statusLabel = document.getElementById('status' + index);
  statusLabel.textContent = labelStatus(blocked); 

  // Update the site list
	data.siteList[index].active = blocked;
  // Allways reset the session list
	data.sessionList[index] = true;

  //Write to storage
	browser.storage.sync.set({sessionList: data.sessionList});
	browser.storage.sync.set({siteList: data.siteList});
}

function labelStatus(blocked) {
  if (blocked) { return "blocked" } else { return "unblocked" };
}


// Run when page loads
window.onload = function(){
	buildList();
};
