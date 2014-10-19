define(function() {
    var url = 'https://www.facebook.com/desktop_notifications/counts.php',
        el = $('#facebook'),
        interval = 15000,
        latest;
        
        
        $('#fb_notifications').hide();

    var facebook = {
        init: function() {
            chrome.extension.getBackgroundPage().$get(url, function(res) {
                if(res && res.notifications) {
                    
                    facebook.render(res);
                    
                    setInterval(function() {
                        chrome.extension.getBackgroundPage().$get(url, facebook.render, 'json');
                    }, interval);
            
                }
            }, 'json');

        },
        render: function(res) {
            if(res && res.notifications) {
                var unread = 0;
                if(res.notifications.unread) {
                    $.each(res.notifications.unread, function() {
                        (this == 1) && (unread++);
                    });
                }
                res.inbox.unseen && $('#fb_notifications_messages').show().text(res.inbox.unseen);
                unread && $('#fb_notifications').show().text(unread);
            }
        }
    }
    
    return facebook;
});