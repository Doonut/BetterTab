define(['moment'], function(moment) {
    var url = 'https://mail.google.com/mail/feed/atom',
        el = $('#gmail'),
        interval = 15000,
        tooltip = $('<div />').addClass('tooltip').appendTo('body').hide();
        
        
        

    var gmail = {
        init: function() {
            chrome.extension.getBackgroundPage().$get(url, gmail.render, 'xml');
            setInterval(function() {
                chrome.extension.getBackgroundPage().$get(url, gmail.render, 'xml');
            }, interval);
        },
        render: function(res) {
            el.empty();
            var feed = $(res);
            feed.find('entry:lt(9)').each(function(i) { 
                var item = $(this),
                    contributors = [];
                
                item.find('contributor').each(function() {
                    contributors.push($(this).find('name').text());
                });
                
                contributors.reverse().push( item.find('author name').text() );
                if(contributors.length > 1) {
                    $.each(contributors, function(i, name) {
                        contributors[i] = name.split(' ')[0];
                    });
                }
                
                var time = moment(item.find('modified').text()).fromNow(true),
                    li = '<li class="linked"><span class="time" style="float: right;">' + time + '</span><a data-summary="' + item.find('summary').text() + '" href="' + item.find('link').attr('href') + '"><img src="chrome://favicon/http://gmail.com" /><b>' + contributors[contributors.length-1] + '</b> &nbsp;' + item.find('title').text() + '</a></li>';
                
                $(li).appendTo(el).hover(function() {
                        var target = $(this),
                            summary = target.find('a').data('summary'),
                            offset = target.offset(),
                            html = '<div class="section">' + contributors[contributors.length-1];
                            
                            html += '<br /><span style="opacity: 0.5">' + summary + '</span></div>';

                        tooltip.width(target.outerWidth() + 20).css('textAlign', 'left');
                        
                        tooltip.empty().html(html).stop().show().css({left: offset.left - 10, top: offset.top - tooltip.outerHeight() - 2});
                        
                        
                    }, function() {
                        tooltip.hide();
                    });
            });
            
            $('<li class="linked more"><a href="http://gmail.com">View More</a></li>').appendTo(el);
            
            

                    
            
            $(document.body).trigger('module_loaded');
        }
    }
    
    return gmail;
});