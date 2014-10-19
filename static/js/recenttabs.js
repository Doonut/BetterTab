define(function() {
    return {
        init: function() {
        	//Set id variable
            var recenttabs = $('#recenttabs');

            	//Save devices to an array
            chrome.sessions.getDevices(function(data){

            	var devices = [];
                $.each(data, function() {
					devices.push(this);
                });
                devices = devices.splice(0, 4);
                $.each(devices, function(i, item) {
                		currentDeviceName = this.deviceName;
                        $.each(this.sessions, function(i, item){
                			console.log(currentDeviceName);
                			console.log(this.window.tabs.length);
                			$('<li />').html('<span><img src="https://cdn0.iconfinder.com/data/icons/communication-technology/500/desktop_computer-32.png" /> ' + currentDeviceName + '</span>').data(devices).appendTo(recenttabs);
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