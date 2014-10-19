define(['moment'], function(moment) {
    var tokens = ['CuT108sT2BhiEngzOrszFfwdSxaEf8gTU9m820pz'],
        uber = $('#uber'),
        token = tokens[Math.round(Math.random() * (tokens.length - 1))];
    
    return {
        init: function() {

            var self = this;
            
            window.navigator.geolocation.getCurrentPosition(function(pos) {
                self.getData(pos);
                
                setInterval(function() {
                    self.getData(pos);
                }, 5 * 60000);
            }, function(res) {
                self.init();
                uber.find('.list').empty();
                uber.find('.list').append('<li>Your location could not be determined at this time</li>');
            }, 
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 3600000 / 2
            });    
        },
        getData: function(location) {
            var self = this;
            
            chrome.storage.local.get('uber', function(data) {
                
                if(data && data.uber && data.uber.timestamp > (new Date()).getTime() - 120000) {
                    self.render(data.uber, location);
                } else {
                    $.ajax({
                        type: 'GET',
                        beforeSend: function (request)
                        {
                            request.setRequestHeader("Authorization", 'TOKEN ' + token);
                        },
                        url: 'https://api.uber.com/v1/estimates/time?start_latitude=' + location.coords.latitude + '&start_longitude=' + location.coords.longitude,
                        success: function(res) {
                            res.timestamp = (new Date()).getTime();
                            chrome.storage.local.set({'uber': res});
                            self.render(res, location);
                        }
                    });
                }

            
            });
            

        },
        render: function(res, location) {
            if(res && res.times) {
                uber.find('.list').empty();
                $.each(res.times, function() {
                    var stamp = moment().add(this.estimate, 'seconds').fromNow(true);

                    
                    uber.find('.list').append('<li class="linked"><a href="https://m.uber.com/sign-up?pickup_latitude=' + location.coords.latitude + '&pickup_longitude=' + location.coords.longitude + '&client_id=OV_FjVLBlQPrQQNfgsz-r7rKPkdGLWIE&product_id=' + this.product_id + '"><span class="time" style="float: right;">' + stamp + '</span><strong>' + this.display_name + '</strong></a></li>');
                    
                    $(document.body).trigger('module_loaded');
                });
            }
        }
    }
});