require(['jquery'], function() {
    var throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function() {
          previous = options.leading === false ? 0 : new Date;
          timeout = null;
          result = func.apply(context, args);
        };
        return function() {
          var now = new Date;
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
      };
  
    window.$get = function() {
        return $.get.apply(this, Array.prototype.slice.call(arguments));
    };
    
    window.createWallpaperData = function(url, fn) {
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image();
        img.onload = function() {
            canvas.width = screen.width;
            canvas.height = img.height * (canvas.width/img.width);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            localStorage.wallpaperData = canvas.toDataURL("image/jpeg", 0.7);
            fn && fn(localStorage.wallpaperData);
        };
        img.src = url;
    }
    
    var uuid;
    var getWebshotsBackground = function() {
        if(localStorage.wallpaper == '' || localStorage.wallpaper == 'WEBSHOTS') {
            $.get('http://webshots.com/api/v3/dailys?front_page=true', function(res) {
                if(res && res.free[0] && res.free[0].url && res.free[0].uuid != uuid) {
                    localStorage._webshotsJson = JSON.stringify(res);
                    createWallpaperData(res.free[0].url.replace('.jpg', '-2560x1440x.jpg'), function() {
                        uuid = res.free[0].uuid;
                    });
                }
            });
        }
    };
    getWebshotsBackground();
    
    chrome.idle.setDetectionInterval(15);
    chrome.idle.onStateChanged.addListener(throttle(function(a) {
        if(a == 'active') {
            getWebshotsBackground();
        }
    }, 300000));
    
    
});