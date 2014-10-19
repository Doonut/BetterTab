define(function() {
    return {
        init: function() {
            var sites = $('#topSites');
            
            chrome.topSites.get(function(res) {
                res = res.splice(0, 10);
                $.each(res, function(i, item) {
                    $('<li class="linked"><a href="' + this.url + '"><img src="chrome://favicon/' + this.url + '" /> ' + this.title + '</a></li>').appendTo(sites).data('url', this.url);
                });
                
                $(document.body).trigger('module_loaded');
            });
        }
    }
});