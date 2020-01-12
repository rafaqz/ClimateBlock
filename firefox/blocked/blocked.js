function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


window.onload = function(){
    blockedurl = getParameterByName("url")
	let data = await browser.storage.sync.get();

	for (i = 0; i < data.siteList.length; i++) {
		data.siteList[i].url
	}
};
