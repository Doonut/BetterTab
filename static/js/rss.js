define(['jquery.autocomplete'], function() {
    var reader = $('.feedReader');
    
    var rss = {
        init: function() {
            reader.find('.list').empty().append('<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>');
            chrome.storage.local.get('feed', function(res) {
                var feed = res.feed;
                if(!feed || !feed.value) {
                    feed = {value: 'Google News - Top Stories', data: 'http://news.google.com/?output=rss'};
                    
                }
                
                if(feed.value.indexOf('http') != 0) {
                    reader.closest('section').data('name', feed.value);
                    $(document).trigger('updateTickerData');
                }
                
                $.get(feed.data, function(res) {
                    reader.find('.list').empty();
                    $(res).find('item').slice(0,9).each(function(i, item) {
                        var a = document.createElement('a');
                            a.href = $(this).find('link').text();
                        $('<li class="linked"><a href="' + a.href + '"><img src="chrome://favicon/' + $(res).find('link').not(':empty').eq(0).text() + '" />' + $(this).find('title').eq(0).text() + '</a></li>').appendTo(reader.find('.list'));
                    });
                    $('<li class="linked more"><a href="' + $(res).find('link').not(':empty').eq(0).text() + '">View More</a></li>').appendTo(reader.find('.list'));
                    
                    !localStorage._rssHelperSeen && $('<li class="notice">Edit your news feed by clicking the title above</li>')
                        .on('mouseenter', function() {
                            $(this).html('Click to hide this message');
                        })
                        .on('mouseleave', function() {
                            $(this).html('Edit your news feed by clicking on the title above');
                        })
                        .on('click', function() {
                            $(this).slideUp('fast');
                            localStorage._rssHelperSeen = 1;
                        })
                        .prependTo(reader.find('.list'));
                        
                }, 'xml').error(function(a, b, c) {
                    $('<li>Unable to load a feed from this source</li>').appendTo(reader.find('.list'));
                });
                
                $('.feedUrl').val(feed.value);
                rss.setupTypeahead();
                $(document.body).trigger('module_loaded');
            });
        },
        setupTypeahead: function() {
            var feeds = [
                {value: 'AP Headlines', data: 'http://hosted.ap.org/lineups/USHEADS-rss_2.0.xml?SITE=RANDOM&SECTION=HOME'},
                {value: 'BBC World Edition', data: 'http://newsrss.bbc.co.uk/rss/newsonline_world_edition/americas/rss.xml'},
                {value: 'CNN Top Stories', data: 'http://rss.cnn.com/rss/cnn_topstories.rss'},
                {value: 'Google News - Top Stories', data: 'http://news.google.com/?output=rss'},
                {value: 'Hacker News', data: 'https://news.ycombinator.com/rss'},
                {value: 'Lifehacker', data: 'http://feeds.gawker.com/lifehacker/full'},
                {value: 'TechCrunch', data: 'http://feeds.feedburner.com/TechCrunch/'},
                {value: 'Mashable', data: 'http://feeds.feedburner.com/Mashable'},
                {value: 'Netflix New Releases', data: 'http://dvd.netflix.com/NewReleasesRSS'},
                {value: 'New York Times', data: 'http://feeds.nytimes.com/nyt/rss/HomePage'},
                {value: 'New York Times Sports', data: 'http://rss.nytimes.com/services/xml/rss/nyt/Sports.xml'},
                {value: 'NPR News', data: 'http://www.npr.org/rss/rss.php?id=1001'},
                {value: 'Reddit', data: 'http://www.reddit.com/.rss'},
                {value: 'Washington Post', data: 'http://feeds.washingtonpost.com/wp-dyn/rss/linkset/2005/03/24/LI2005032400102_xml'},
                {value: 'Wired', data: 'http://feeds.wired.com/wired/index'},
                {value: 'Yahoo Sports - Top News', data: 'http://sports.yahoo.com/top/rss.xml'},
                {value: 'Yahoo Sports - MLB News', data: 'http://sports.yahoo.com/mlb/rss.xml'},
                {value: 'Yahoo Sports - NFL News', data: 'http://sports.yahoo.com/nfl/rss.xml'},
                {value: 'Yahoo Sports - NHL News', data: 'http://sports.yahoo.com/nhl/rss.xml'},
                {value: 'Yahoo Sports - NBA News', data: 'http://sports.yahoo.com/nba/rss.xml'}
            ];
            
            var selection;
            
            var input = $('.feedUrl').autocomplete({
                width: 284,
                lookup: feeds,
                minChars: 0,
                autoSelectFirst: true,
                onSelect: function(item) {
                    chrome.storage.local.set({'feed': item});
                    rss.init();
                }
            }).on('focus', function() {
                selection = input.val();
                input.val('a').trigger('keyup').val('').trigger('keyup');
            }).on('blur', function() {
                (input.val() == '') && (input.val(selection));
            });
        }
    };
    
    $('.feedForm').on('submit', function(e) {
        e.preventDefault();
        var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
        var val = $('.feedUrl').val();
        if(val.match(urlPattern)) {
            var item = {value: val, data: val};
            chrome.storage.local.set({'feed': item});
            rss.init();
        }
    });
            
    return rss;
});