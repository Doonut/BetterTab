define(function() {
    return {
        init: function() {
            var appList = $('#appList');
            
            chrome.management.getAll(function(res) {
                var apps = [];
                $.each(res, function() {
                    if(this.isApp) { this.icon = 'chrome://extension-icon/' + this.id + '/128/1'; apps.push(this); }
                });
                
                apps = apps.splice(0, 8);
                
                apps.push({
                    icons: ['', {url: "chrome://extension-icon/ahfgeienlihckogmohjhadlkjgocpleb/128/1"}],
                    name: 'Chrome Web Store',
                    appLaunchUrl: 'https://chrome.google.com/webstore/',
                    enabled: true,
                    useURL: true,
                    icon: 'chrome://extension-icon/ahfgeienlihckogmohjhadlkjgocpleb/128/1'
                });
                
/*
                apps.push({
                    icons: ['', {url: "chrome://favicon/chrome://apps/"}],
                    name: 'View All',
                    appLaunchUrl: 'chrome://apps/',
                    enabled: true,
                    useURL: true,
                    icon: 'chrome://favicon/chrome://apps/'
                });
*/
                
                
                
                $.each(apps, function(i, item) {
                    if(this.enabled) {
                        $('<li />').html('<img src="' + this.icon + '" class="app_icon" /> <span>' + this.name + '</span>').data(this).on('click', function() {
                            if(item.useURL || item.appLaunchUrl.indexOf('http') == 0) {
                                chrome.tabs.update({url: item.appLaunchUrl});
                            } else {
                                chrome.management.launchApp(item.id);
                            }
                            
                        }).appendTo(appList);
                    }
                });
            });
        }
    }
});