$(document).ready(function() {
    document.addEventListener("deviceready",onDeviceReady,false);
	
});

function onDeviceReady(){
	//var channel = 'blink182VEVO';
	var channel;
	
	if(localStorage.channel==null || localStorage.channel==''){
		$('#popupDialog').popup("open");
	}else{
		channel = localStorage.getItem('channel');	
		$("#channelOptions").val(channel);
		$("#maxResultsOptions").val('10');
	}
	
	 
	
	$("#channelBtnOK").click(function(){
		channel=$("#channelName").val();
		localStorage.setItem('channel',channel);
		$("#channelOptions").val(channel);
		$("#maxResultsOptions").val('10');
		getPlayList(channel,10);
	});
	
	
	
	$("#saveOptions").click(function(){
		channel=$("#channelOptions").val();
		limit=$("#maxResultsOptions").val();
		if(limit<=0 || limit==''){
			limit=5;	
		}
		localStorage.setItem('channel',channel);
		getPlayList(channel,limit);
		$.mobile.pageContainer.pagecontainer("change", "#main", { transition: "pop"});
	
	});
	
	
	$("#clearOptions").click(function(){
		$("#channelOptions").val('');
		$("#maxResultsOptions").val('');
		localStorage.removeItem('channel');
		getPlayList('',1);
		//$.mobile.pageContainer.pagecontainer("change", "#main", { transition: "pop"});
	});
	
	
	
	
	
	getPlayList(channel,10);
	
	$(document).on('click','#vidlist li',function(){
		showVideo($(this).attr('videoId'));
	});
	
	
}

function getPlayList(channel,limit){
	$("#vidlist").html('');
	$.get(
		"https://www.googleapis.com/youtube/v3/channels",
		{
			part: 'contentDetails',	
			forUsername: channel,
			key: 'AIzaSyBnXrKZ0ypMSM3tevhEO0ppUNDgxkfbZyw'		
		},
		function(data){
			$.each(data.items,function(i,items){
				console.log(items);
				playlistId=items.contentDetails.relatedPlaylists.uploads;
				getVideos(playlistId,limit);
			});
		}
	);	
}

function getVideos(id,limit){
	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems",
		{
			part: 'snippet',	
			maxResults: limit,
			playlistId: id,
			key: 'AIzaSyBnXrKZ0ypMSM3tevhEO0ppUNDgxkfbZyw'	
		},
		function(data){
			console.log(data);
			$.each(data.items,function(i,items){
				id=items.snippet.resourceId.videoId;
				title=items.snippet.title;
				thumb=items.snippet.thumbnails.default.url;
				$("#vidlist").append('<li videoId="'+id+'"><h3>'+title+'</h3><img src="'+thumb+'"></li>');
				$("#vidlist").listview('refresh');
				//console.log(id+": "+title);
			});
		}
	);	
}


function showVideo(id){
	$("#bannerMTM").hide(1000);
	$("#showVideo").html('<iframe id="frame" width="100%" height="255" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>');
	console.log(id);
}





