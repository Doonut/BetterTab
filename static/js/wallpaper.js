define(['jquery'], function($) {
    
    var wallpapers = {
        init: function() {
            if(!localStorage.wallpaperData) {
                $.get('http://webshots.com/api/v3/dailys?front_page=true', function(res) {
                    if(res && res.free[0] && res.free[0].url) {
                        localStorage._webshotsJson = JSON.stringify(res);
                        localStorage.wallpaper = '';
                        chrome.extension.getBackgroundPage().createWallpaperData(res.free[0].url.replace('.jpg', '-2560x1440x.jpg'), function() {
                            $(document.body).css('backgroundImage', 'url(' + localStorage.wallpaperData + ')');
                        });
                    }
                });
            }
        },
        get: function(start, fn) {
            $.ajax({
                url: "https://interfacelift-interfacelift-wallpapers.p.mashape.com/v1/wallpapers/?limit=60&resolution=1920x1080&sort_by=favorites&start=" + (start || 0),
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('X-Mashape-Authorization', 'tXCc7VhnIiw5jtlOi9nZT0DtBDIW02Q2');},
                success: function(res) {
                    fn(res);
                }
             });
        },
        select: function(id) {
            $.ajax({
                url: "https://interfacelift-interfacelift-wallpapers.p.mashape.com/v1/wallpaper_download/" + id + "/1920x1080/",
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('X-Mashape-Authorization', 'tXCc7VhnIiw5jtlOi9nZT0DtBDIW02Q2');},
                success: function(res) {
                     localStorage.wallpaper = res.download_url;
                     chrome.extension.getBackgroundPage().createWallpaperData(res.download_url);
                     $(document.body).css('backgroundImage', 'url(' + res.download_url + ')');
                     $('.blackout.wallpapers').remove();
                }
            });
        },
        show: function() {
            var overlay = $('<div />').addClass('blackout wallpapers close_area').append('<div class="icon spinner"></div>').append('<div class="hidden close_area"><div style="color: #fff; margin-bottom: 10px;"><button id="webshots" style="margin-bottom: 10px;">Use photo of the day from Webshots</button><br />Or choose from one of the below</div><div class="show_more"><button class="more">Show More</button> <button class="cancel">Cancel</button></div></div> ').appendTo(document.body),
            i = 0;
        
            wallpapers.get(i, function(res) {
                $.each(res, function(i, item) {
                    $('<img src="' + this.preview_url + '" />').insertBefore('.show_more').on('click', function() {
                        wallpapers.select(item.id);
                    });
                });
                overlay.find('.spinner').hide().end().find('.hidden').fadeIn('fast');
            });
            
            $('.show_more .more').on('click', function() {
                i += 60;
                $('.show_more .more').text('Loading...');
                wallpapers.get(i, function(res) {
                    
                    $.each(res, function(i, item) {
                        $('<img src="' + this.preview_url + '" />').insertBefore('.show_more').on('click', function() {
                            wallpapers.select(item.id);
                        });
                    });
                    $('.show_more .more').text('Show More');
                });
            });
            
            $('.show_more .cancel').on('click', function() {
                overlay.fadeOut('fast', function() {
                    overlay.remove();
                });
            });
            
            $('.close_area').on('click', function(e) {
                if(e.target == this) {
                    overlay.fadeOut('fast', function() {
                        overlay.remove();
                    });
                }
            });
            
            $('#webshots').on('click', function() {
                localStorage.wallpaper = '';
                $.get('http://webshots.com/api/v3/dailys?front_page=true', function(res) {
                    $(document.body).css('backgroundImage', 'url(' + res.free[0].url.replace('.jpg', '-2560x1440x.jpg') + ')');
                    localStorage.wallpaper = '';
                    chrome.extension.getBackgroundPage().createWallpaperData(res.free[0].url.replace('.jpg', '-2560x1440x.jpg'));
                });
                overlay.remove();
            });
        }
    };
    
    return wallpapers;
});