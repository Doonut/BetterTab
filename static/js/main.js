define(['jquery', 'features'], function($, features) {
    
    
    /* Sorting */
    (function() {
        chrome.storage.local.get('sortOrder', function(res) {
            var sortOrder = (res.sortOrder || []).reverse();
        
            var sort = function(i, module) {
                $('section').each(function() {
                    ($(this).data('module') == module) && $(this).detach().prependTo('#container');
                });
            };
            
            $(sortOrder).each(sort);
        
        });
        
    })();
    
    
    if(localStorage.wallpaperData) {
        $(document.body).css('backgroundImage', 'url(' + localStorage.wallpaperData + ')');
        if(localStorage.wallpaper == '' && localStorage._webshotsJson) {
            var webshots = JSON.parse(localStorage._webshotsJson);
            try {
                $('#footer').html('<a href="http://webshots.com/photos/' + webshots.free[0].channel_fragment + "/" + webshots.free[0].title_fragment + '?utm_source=zach&utm_medium=extension&utm_campaign=zakk_start">' + webshots.free[0].title + ' &middot; Share</a>').show();
                
            } catch(e) {}
        }
    }
    
    /* List of the controllers */
    var modules = ['wallpaper', 'ticker', 'search'],
        els = $('section'),
        container = $('#container');
    
    if(!('_allInOne' in localStorage) || localStorage._allInOne != '') {
        $(document.body).addClass('allInOne');
        require(['static/js/masonry.js'], function(Masonry) {
            var m;
            $('#container section').css({opacity: 0});
            $(document.body).on('module_loaded', _.debounce(function() {
                $('#container section').css({opacity: 1});
                
                (m && m.layout()) || (m = new Masonry($('#container')[0], {itemSelector: 'section', isFitWidth: true, isInitLayout: true, transitionDuration: 0}));
            }, 50));
        });
    }
    
    chrome.storage.local.get('disabledFeatures', function(res) {
        var disabledFeatures = res.disabledFeatures || [];
        
        $.each(features, function() {
            var feature = this;
            if($.inArray(this.js, disabledFeatures) == -1) {
                modules.push(this.js);
            } else {
                els.each(function() {
                    if(feature.js == $(this).data('module')) {
                        $(this).remove();
                    }
                });
            }
        });
        
        /* Load the modules, then initialize them */
        require(modules, function() {
            container.show();
            
            var args = Array.prototype.slice.apply(arguments);
            $.each(modules, function(i, module) {
                var el = els.filter(function() { return $(this).data('module') == module;  });
                args[i] && args[i].init && args[i].init(el);
            });
        });
    });
    
    
     // Buttons
    $('#options_button').on('click', function() {
        require(['options'], function(options) {
            options.init();
        });
    });
    (window.location.hash == '#options') && ($('#options_button').click());
    
    $('.menu-toggle-menu').on('click', 'li', function() {
        chrome.tabs.update({url: $(this).data('url')});
    });
    
    $('#apps-link').on('click', function() {
        chrome.tabs.update({url: 'chrome://apps/'});
    });
    
    
    $('#share_button').on('click', function(e) {
        e.preventDefault();
        var w = 550, h = 420, left = (screen.width/2)-(w/2), top = (screen.height/2)-(h/2);
        chrome.windows.create({
            url: 'https://www.facebook.com/sharer/sharer.php?u=https://bit.ly/weathertab',
            left: left,
            top: top,
            width: w,
            height: h,
            type: 'popup',
            focused: true
        });
    });
    
    /* If transparent mode is on */
    if(localStorage._opacity) {
        $('#container,#title').css({opacity: 0.9});
        var opacity = localStorage._opacity || 0.9;
        $('#container').css({opacity: opacity});
        $('.buttons button').css({opacity: 1});
    } else {
        $('#container,#title').css({opacity: 0.9});
        $('.buttons button').css({opacity: 0.9});
    }
    
    if(!localStorage._hideReview) {
        $('#review').delay(500).slideDown('fast').on('mouseenter', function() {
            localStorage._hideReview = '1';
        });
    }
    
    require(['google-analytics-bundle'], function() {
        var service = analytics.getService('start');
        var tracker = service.getTracker('UA-37022210-6');
        
        tracker.sendAppView('NewTab');

    });
});