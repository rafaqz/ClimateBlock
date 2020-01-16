window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
});

// function getParameterByName(name, url) {
//     if (!url) url = window.location.href;
//     name = name.replace(/[\[\]]/g, '\\$&');
//     var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//         results = regex.exec(url);
//     if (!results) return null;
//     if (!results[2]) return '';
//     return decodeURIComponent(results[2].replace(/\+/g, ' '));
// }


// window.onload = function(){
//   console.log('window.onload');
//   blockedUrl = getParameterByName('url');
//  // let data = await browser.storage.sync.get();

//  for (i = 0; i < data.siteList.length; i++) {
//     siteUrl = data.siteList[i].url.slice(5, -1);
//     if (blockUrl.includes(siteUrl)) {
//       index = i;
//       break;
//     }
//  }
//   console.log(index);
//   str = JSON.stringify(data.siteList[index], null, 4);
//   console.log(str);
// };
