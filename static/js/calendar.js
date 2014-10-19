define(['moment'], function(moment) {
    
    var el = $('#calendar'),
        interval = 30000;
        
        
        

    var calendar = {
        getURL: function() {
            return 'https://www.google.com/calendar/feeds/default/private/embed?orderby=starttime&sortorder=ascending&singleevents=true&start-min=' + moment().startOf('day').toISOString() + '&start-max=' + moment().add(10, 'day').startOf('day').toISOString();
        },
        init: function() {
            
            chrome.extension.getBackgroundPage().$get(calendar.getURL(), calendar.render, 'xml');
            
            setInterval(function() {
                chrome.extension.getBackgroundPage().$get(calendar.getURL(), calendar.render, 'xml');
            }, interval);
        },
        render: function(res) {
            el.empty();
            var feed = $(res);
            feed.find('entry:lt(9)').each(function(i) { 
                var item = $(this);
                
                
                var time = moment(item.find('when').attr('startTime')).calendar();
                
                if(item.find('when').attr('startTime').indexOf('T') == -1) {
                    time = time.replace('at 12:00 AM', '');
                }
                
                $('<li class="linked"><span class="time" style="float: right;">' + time + '</span><a href="' + item.find('link').attr('href') + '">' + item.find('title').text() + '</a></li>').appendTo(el);
            });
            
            if(feed.find('entry').length == 0) {
                $('<li class="linked more"><a href="http://google.com/calendar">No Upcoming Events</a></li>').appendTo(el);
            } else {
                $('<li class="linked more"><a href="http://google.com/calendar">View More</a></li>').appendTo(el);
            }
            
            $(document.body).trigger('module_loaded');
        }
    }
    
    return calendar;
});