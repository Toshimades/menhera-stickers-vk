function checkAccessToken() {
  ge('block_auth').style.display = opts.accessToken ? 'none' : 'block';
  ge('block_logged').style.display = opts.accessToken ? 'block' : 'none';
  ge('block_settings').style.display = opts.accessToken ? 'block' : 'none';

  if (opts.accessToken) {

    api('users.get', {}, function(data) {
      if (data.error) {
        saveOptions({ accessToken: false });
        checkAccessToken();
        return true;
      }

      saveOptions({ userID: data.response[0].id, firstName: data.response[0].first_name, lastName: data.response[0].last_name });

      ge('link_user').href = 'http://vk.com/id' + opts.userID;
      ge('link_user').innerHTML = opts.firstName + ' ' + opts.lastName;
    });
    var photoRequests = [];
    for (var i = 0; i < 20; i++) {
      photoRequests.push('API.docs.get({ owner_id: -133219583, offset: ' + (i * 200) + ', count: 200 })');
    }
	
    api('execute', { code: 'return { photos: API.docs.get({ owner_id: -133219583, count: 150 }) };', https: 1 }, function(data) {
      if (data.error) {
        saveOptions({ accessToken: false });
        checkAccessToken();
        return true;
      }
      var photos = [];
      for (var i = 0; i < data.response.photos.count; i++) {
        photos = photos.concat(data.response.photos.items[i]);
      }
	  
	  
      photos = photos.reverse();
      var html = [];
      var defs = {};
      function comparer(a, b) {
		 if(a.title < b.title) return -1;
		if(a.title > b.title) return 1;
		return 0;
}
	photos.sort(comparer);
	console.log(photos);
      for (var i = 0; i < photos.length; i++) {
		html.push(
		'<a class="fl_l im_sticker_bl" id="check_album' + photos[i].id + '_wrap">\
		  <div class="fl_l im_sticker_bl_mimg"><img src="' + photos[i].url + '" width="96" class="im_sticker_bl_bimg img-fluid"></div>\
		  <div class="im_sticker_bl_info clear">\
			<div class="im_sticker_bl_name">' + photos[i].title + '</div>\
		  </div>\
		</a>');
		}
 loadOptions(defs);
      ge('list_albums').innerHTML = html.join('');
      
    });
  }
}



ge('button_auth').onclick = performAuth;
ge('button_close').onclick = function() {
  window.close();
}
ge('link_logout').onclick = function() {
  saveOptions({ accessToken: false });
  checkAccessToken();
  return false;
}



checkAccessToken();