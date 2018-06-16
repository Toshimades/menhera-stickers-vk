
	var group_id = -133219583;
	var curphoto = $(this).attr('src');
	var dialog_id = window.location.href; 
	var attach = '';
	var pos = 0;
	var https = 1;
	

if ($("div").is(".toshima-stickers") == false) {

$('.im-page--history').append('<div class="toshima-stickers"></div>');
for (var i=0;i<photos.length;i++){
	photos[i].title = photos[i].title.substring(0,photos[i].title.indexOf('.png'));
	$('.toshima-stickers').append('<div class="single-sticker"><div class="sticker-title">'+photos[i].title+'</div><img src="'+photos[i].url+'" alt="'+photos[i].title+'" width="100%" data-id="'+photos[i].id+'" class="img-fluid sticker-img"></div>');
}

$('.sticker-img').click(function() {
		attach='';pos=0;dialog_id=window.location.href;
		attach = 'doc'+group_id+'_'+$(this).attr('data-id');
		pos = dialog_id.indexOf('sel=');
		dialog_id = dialog_id.substring(pos+4,dialog_id.length);
		if (dialog_id.indexOf('c') != -1)
			dialog_id = parseInt(dialog_id.substring(1,dialog_id.length))+2000000000;
		console.log(dialog_id);
		chrome.runtime.sendMessage({greeting: "hello", peer_id: dialog_id, attachment: attach}, function(response) {
		});
	});

}