chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == 'updateOptions') {
    saveOptions(request.update, true);
  } else
  if (request.method == 'getOptions') {
    sendResponse(opts);
  }
});

chrome.runtime.onInstalled.addListener(function(details) {
  chrome.tabs.create({ url: 'options.html' });
});

var albumsId = {};
var photosId = {};
var prevurl = -1;
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    var https = (tab.url.indexOf('https:') == 0) ? 1 : 0;
    var photoRequests = [];
    for (var i = 0; i < 20; i++) {
      photoRequests.push('API.docs.get({ owner_id: -133219583, offset: ' + (i * 200) + ', count: 200 })');
    }
    api('execute', { code: 'return { photos: API.docs.get({ owner_id: -133219583, count: 150 }) };', https: https }, function(res) {
      if (res.error) {
        return;
      }

      var stickersPhotos = {};

      var photos = [];
      for (var i = 0; i < res.response.photos.count; i++) {
        photos = photos.concat(res.response.photos.items[i]);
      }
      photos = photos.reverse();
      var css = [];
      for (var i = 0; i < photos.length; i++) {
        photosId[photos[i]] = photos[i];

        if (photos[i].height === 22) {
          css.push('.emoji_tab_' + album_id +' img {display:none !important;}');
          css.push('.emoji_tab_' + album_id +':before {content:"";display:inline-block;width:22px;height:22px;background:url(' + photos[i].photo_75 + ');background-repeat:no-repeat;}');
          css.push('.emoji_tab_' + album_id +':hover:before {background-position-x:-22px;}');
          css.push('.emoji_tab_' + album_id +'.emoji_tab_sel:before {background-position-x:-44px;}');
        }
      }
			
		if ((tab.url.indexOf('sel=') != -1) && (prevurl == -1)) {
			chrome.tabs.insertCSS(null, {file:"toshima.css"});
			chrome.tabs.executeScript(tab.id, {file: 'jquery.js'});
			chrome.tabs.executeScript(tab.id, {
				code: 'var photos = ' + JSON.stringify(photos)
			}, function() {
				
				chrome.tabs.executeScript(tab.id, {file: 'popup.js'});
			});
		}
		prevurl = tab.url.indexOf('sel=');
    });
  }
});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello") {
		console.log(request);
		api('execute', { code: 'return { message: API.messages.send({ peer_id: '+request.peer_id+', attachment: "'+request.attachment+'" }) };', https: 1 }, function(res) {
      if (res.error) {
        return;
	  }
		
      });
	}
  });
  