define(function() {
    var API = 'http://api.wunderground.com/api/a71f2e6769460c47/';
    
    var weather = {
        init: function() {
            $(function() {
                // If they are offline, let em know
                if(!navigator.onLine) {
                    $('#offline').fadeIn('fast');
                    return;
                }
                
                // Otherwise show a (weather) loading indicator
                $('#loading').show().find('span').fadeIn('slow');
                
                chrome.storage.sync.get('weatherMinimal', function(res) {
                    if(res && res.weatherMinimal) {
                        $('.weather').addClass('minimal').css('height', '106px').find('#weather .date').eq(0).text('Today');
                    } else {
                        $('.weather').css('height', '349px');
                    }
                });
                    
                chrome.storage.local.get('weather', function(res) {
                    if(res.weather && (new Date).getTime() - res.weather.timestamp < 600000) {
                        weatherSetup(res.weather);
                    } else {
                        weather.forecast(function(res) {
                            if(res.response.error && res.response.error.type == 'querynotfound') {
                                $('#loading').text('This location has no current weather data, please update your location in options.');
                                return;
                            }
                            res.timestamp = (new Date()).getTime();
                            chrome.storage.local.set({weather: res});
                            
                            weatherSetup(res);
                        });
                    }
                });
                
                var weatherSetup = function(res) {
                    $('#loading').stop().hide();
                    $('#online').show();
                    
                    
                    // Add the current conditions
                    var temp = (localStorage._units == 'c') ? res.current_observation.temp_c : res.current_observation.temp_f;
                    $('#conditions').append('<div class="temp">' + Math.round(temp) + '&deg;</div>')
                                    .append('<div class="details">' + res.current_observation.weather + '</div>');
                    
                    // Add a map background (try catching to prevent error)
                    try {
                        var img = new Image(),
                            img_url = res.satellite.image_url_vis.replace(/=300/g, '=400').replace('borders=1', 'borders=0');
                            img.onload = function() {
                                $('#map,#map-goog').css({backgroundImage: 'url(' + img_url + ')'}).hide().fadeIn('slow');
                            };
                            img.src = img_url;
                    } catch(e) {}
                    
                    
                    // Add the hourly info
                    var hourly = res.hourly_forecast.slice(0, 8);
                    $.each(hourly, function(i) {
                        var unit = (localStorage._units == 'c') ? 'metric' : 'english';
                        var html = '<div class="icon">' + weather.getIcon(this.icon) + '</div>';
                            if(this.FCTTIME.hour == 0) { this.FCTTIME.hour = 12; }
                            html += '<div class="date">' + (this.FCTTIME.hour > 12 ? this.FCTTIME.hour - 12 : this.FCTTIME.hour) + this.FCTTIME.ampm + "</div>";
                            
                            html += '<div class="temp"><span class="high">' + this.temp[unit] + '&deg; </span></div>';
                            
                        $('<li />').html(html).appendTo('#hourly').data('weather', this);
                    });
                    
                    // Add the forecast icons
                    $.each(res.forecast.simpleforecast.forecastday, function() {
                        var unit = (localStorage._units == 'c') ? 'celsius' : 'fahrenheit';
                        var html = '<div class="icon">' + weather.getIcon(this.icon) + '</div>';
                            html += '<div class="date">' + this.date.weekday_short + "</div>";
                            html += '<div class="temp"><span class="low">' + this.low[unit] + '&deg; </span> / <span class="high">' + this.high[unit] + "&deg;</span></div>";
                            
                        $('<li />').html(html).appendTo('#weather').data('weather', this);
                    });
                    
                    
                    var tooltip = $('<div />').addClass('tooltip').appendTo('body').hide();
                    $('#weather li, #hourly li').hover(function() {
                        var target = $(this),
                            conditions = target.data('weather'),
                            offset = target.offset(),
                            html = '<div class="section">' + (conditions.conditions || conditions.condition);
                            html += '<br /><span style="opacity: 0.5">' + conditions.pop + '% chance of precipitation</span></div>';
                        
                        if(offset.left -1 < 0) {
                            tooltip.empty().html(html).stop().show().css({left: offset.left - 1, top: offset.top - tooltip.outerHeight()});
                        } else if(offset.left + 100 > $('body').width()) {
                            tooltip.empty().html(html).stop().show().css({left: offset.left - 101 + target.outerWidth(), top: offset.top - tooltip.outerHeight()});
                        } else {
                            tooltip.empty().html(html).stop().show().css({left: offset.left - 1 - 50 + target.outerWidth() / 2, top: offset.top - tooltip.outerHeight()});
                        }
                    }, function() {
                        tooltip.hide();
                    });
                    
                    // Show the location
                    $('#location').text(res.current_observation.display_location.full);
                    
                    // Add the location / more link
                    $('#location,#weather li, #hourly li').on('click', function() {
                        window.location.href = res.current_observation.forecast_url + '?apiref=40c64ece8843c98f';
                    });
                    
                    chrome.storage.sync.get('weatherMinimal', function(res) {
                        if(res && res.weatherMinimal) {
                            $('.weather').addClass('minimal').css('height', '106px').find('#weather .date').eq(0).text('Today');
                        } else {
                            $('.weather').css('height', '349px');
                        }
                        setTimeout(function() { $(document.body).trigger('module_loaded'); }, 300);
                    });
                    
                    $(document.body).trigger('module_loaded');
                    
                }                
                
            });
        },
        forecast: function(fn) {
            var that = this,
                then = function(_location) {
                    if(_location && _location.zmw) {
                        that.api('geolookup/hourly/conditions/satellite/forecast/q/zmw:' + _location.zmw, fn);
                    } else {
                        window.navigator.geolocation.getCurrentPosition(function(pos) {
                            that.api('geolookup/hourly/conditions/satellite/forecast/q/' + pos.coords.latitude + ',' + pos.coords.longitude, fn);
                        }, function() {
                            that.api('geolookup/hourly/conditions/satellite/forecast/q/autoip', fn);
                        }, 
                        {
                            enableHighAccuracy: false,
                            timeout: 5000,
                            maximumAge: 3600000
                        });
                    }
                };
            
            
            chrome.storage.local.get('location', function(res) {
                
                then(res.location);
            });
        },
        temp: function(fn) {
            var that = this;
            
            chrome.storage.local.get('location', function(res) {
                _location = res.location;
            
                if(_location && _location.zmw) {
                    that.api('conditions/q/zmw:' + _location.zmw, fn);
                } else {
                    window.navigator.geolocation.getCurrentPosition(function(pos) {
                        that.api('conditions/q/' + pos.coords.latitude + ',' + pos.coords.longitude, fn);
                    }, function() {
                        that.api('conditions/q/autoip', fn);
                    }, 
                    {
                        enableHighAccuracy: false,
                        timeout: 5000,
                        maximumAge: 3600000
                    });
                }
                
            });
        },
        api: function(path, fn) {
            $.get(API + path + '.json', fn);
        },
        getIcon: function(icon) {
            switch(icon) {
                case 'flurries':
                case 'chanceflurries':
                case 'chancesnow':
                case 'snow':
                    return 'W'
                break;
                case 'chancerain':
                case 'rain':
                case 'chancesleet':
                    return 'R';
                break;
                case 'chanceclear':
                case 'mostlycloudy':
                case 'mostlysunny':
                case 'partlycloudy':
                case 'partlysunny':
                    //if((new Date()).getHours() > 6 && (new Date()).getHours() < 21) {
                        return 'H';
                    //} else {
                        return 'I';
                    //}
                break;
                case 'sleet':
                    return 'X';
                break;
                
                case 'chancetstorms':
                case 'tstorms':
                    return '0';
                break;
                case 'fog':
                case 'hazy':
                    return 'L';
                break;
                case 'cloudy':
                    return 'Y';
                break;
                case 'sunny':
                case 'clear':
                    //if((new Date()).getHours() > 6 && (new Date()).getHours() < 21) {
                        return 'B';
                    //} else {
                        return '2';
                    //}
                break;
                default:
                    return 'A';
                break;
            }
        }
    };
    
    return weather;
});