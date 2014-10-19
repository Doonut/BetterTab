define(function() {
    var url = 'http://gdata.youtube.com/feeds/api/standardfeeds/most_viewed?max-results=9&alt=json&time=today&format=5',
        el = $('#youtube');

    var youtube = {
        init: function() {
            $.get(url, youtube.render, 'json');
        },
        render: function(res) {
            $.each(res.feed.entry, function(i, item) { 
                $('<li class="linked"><a href="' + this.link[0].href + '"><img src="chrome://favicon/https://www.youtube.com/" />' + this.title.$t + '</a></li>').appendTo(el);
            });
            $('<li class="linked more"><a href="http://www.youtube.com/channel/HC4qRk91tndwg">View More</a></li>').appendTo(el);
            $(document.body).trigger('module_loaded');
        }
    }
    
    return youtube;
});