define(function() {
    return {
        init: function() {
            var recenttabs = $('#recenttabs');

            chrome.sessions.getDevices(function(data){

            	var devices = [];
                $.each(data, function() {devices.push(this);});
                devices = devices.splice(0, 4);

                $.each(devices, function(i, item) {
                    $('<li />').html('<span><img src="https://cdn0.iconfinder.com/data/icons/communication-technology/500/desktop_computer-32.png" /> ' + this.deviceName + '</span>').data(this).appendTo(recenttabs);
                    $.each(this.sessions, function(i, item){
                		$('<li class="linked" />').html('<span><a href = ' + this.window.tabs[0].url + '><img src="chrome://favicon/' + this.window.tabs[0].url + '" /> ' + this.window.tabs[0].title + '</a></span>').data(devices).appendTo(recenttabs);
                		if (this.window.tabs.length > 1) {
                			$('<li class="linked" />').html('<span><a href = ' + this.window.tabs[1].url + '><img src="chrome://favicon/' + this.window.tabs[1].url + '" /> ' + this.window.tabs[1].title + '</a></span>').data(devices).appendTo(recenttabs);
                		}
                	});
                });
            }); 	
        }
    }
    return recenttabs;
});