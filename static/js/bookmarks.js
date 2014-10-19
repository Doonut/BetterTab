define(function() {
    var bookmarks = {
        init: function() {
            chrome.permissions.contains({permissions: ['bookmarks']}, function(res) {
                if(res == true) {
                    bookmarks.load();
                } else {
                    $('<li />').attr('title', this.url).html('Enable Bookmarks').data('url', 'tab.html#options').appendTo('#bookmarks-menu');
                    $('<li>View All</li>').appendTo('#bookmarks-menu').data('url', 'chrome://bookmarks');
                }
            });
            
        },
        load: function() {
            chrome.bookmarks.getChildren('1', function(res) {
                res = res.splice(0, 12);
                
                $.each(res, function(i, item) {
                    $('<li />').attr('title', this.url).html('<img src="chrome://favicon/' + this.url + '" /> ' + this.title).data('url', this.url).appendTo('#bookmarks-menu');
                });
                
                $('<li>Edit</li>').appendTo('#bookmarks-menu').data('url', 'chrome://bookmarks');
            });
        }
    };
    
    return bookmarks;
});