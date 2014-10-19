define(['moment'], function(moment) {
    var clock = $('#clock'),
        day = $('#day');
    
    return {
        init: function() {
            var self = this;
            chrome.storage.sync.get(['clockformat'], function() {
                setInterval(self.tick, 200);
                $(document.body).trigger('module_loaded');
            });
        },
        tick: function() {
            
            clock.html(moment().format('h:mm:ss A'));
            day.html(moment().format('dddd, MMMM Do YYYY'));
        }
    }
});