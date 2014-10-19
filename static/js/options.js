define(['features', 'wallpaper', 'jquery.autocomplete', 'jquery-ui.custom.min'], function(features, wallpaper) {
    var init = false,
        location = false,
        el;
    
    var options = {
        init: function() {
            if(!init) {
                $.get('options.tpl', function(res) {
                    $(document.body).append(res);
                    
                    
                    el = $('#options');
                    el.find('.blackout').on('click', function() {
                        el.fadeOut('fast');
                    });
                    init = true;
                    options.init();
                    options.setup();
                });
                return;
            } else {
                 el.fadeIn('fast');
            }
            
        },
        optionalPermissions: function() {
            chrome.permissions.contains({permissions: ['bookmarks']}, function(res) {
                if(res) {
                    el.find('#enable-bookmarks').closest('.option').remove();  
                } else {
                    el.find('#enable-bookmarks').on('click', function(e) {
                        e.preventDefault();
                        chrome.permissions.request({permissions: ['bookmarks']}, function() {
                            window.location.hash = '';
                            window.location.reload();
                        });
                    });
                }
            });
        },
        setup: function() {
            
            options.optionalPermissions();
            
            $('#wallpapers').on('click', function() {
                $('#options .cancel').click();
                wallpaper.show();
            });
            
            $('#input_location').autocomplete(
                {
                    serviceUrl: "http://autocomplete.wunderground.com/aq",
                    deferRequestBy: 8,
                    dataType: 'json',
                    paramName: 'query',
                    width: 200,
                    transformResult: function(res){
                        res = res.RESULTS;
                        
                        var suggestions = $.map(res, function(item) {
                            return {value: item.name, data: item};
                        });
                        res = {
                            'suggestions' : suggestions
                        };                      
                        return res;
                    },
                    onSelect: function(item) {
                        location = item.data;
                    }
            });
        
            chrome.storage.local.get('location', function(res) {
                if(res && res.location) {
                    location = res.location;
                    $('#input_location').val(location.name).autocomplete().suggestion = {value: location.name, data: location};
                }
            });
            
            $('#units').val(localStorage._units || $('#units').val());
            $('#allInOne').val(!('_allInOne' in localStorage) || localStorage._allInOne != '' ? 'allInOne' : '');
            $('#transparency').val(localStorage._opacity || $('#transparency').val());
            
            chrome.storage.sync.get('weatherMinimal', function(res) {
                if(res && res.weatherMinimal) {
                    $('#weatherMinimal').val(res.weatherMinimal);
                }
            });
            
            $('#options .save').on('click', options.save);
            $('#options .cancel').on('click', function() {
                el.fadeOut('fast');
            });
            
            chrome.storage.local.get(['disabledFeatures', 'sortOrder'], function(res) {
                var disabledFeatures = res.disabledFeatures || [];
                
                $.each(features, function() {
                    if(this.invisible) { return; }
                    $('<div class="feature" title="' + this.name + '" style="background-color: ' + this.color +'">' + this.icon + '</div>').appendTo('#option-features').on('click', function() {
                        $(this).toggleClass('off');
                    }).data('module', this.js).addClass( (($.inArray(this.js, disabledFeatures) != -1) ? 'off' : '') );
                });
                
                (function() {
                    var sortOrder = (res.sortOrder || []).reverse();
                    
                    var sort = function(i, module) {
                        $('#option-features .feature').each(function() {
                            ($(this).data('module') == module) && $(this).detach().prependTo('#option-features');
                        });
                    };
                    
                    $(sortOrder).each(sort);
                    
                    $( "#option-features" ).sortable({ zIndex: 9999, appendTo: 'parent', helper: 'clone'});
                })();
    
    
                
                
            });
        },
        save: function() {
            localStorage._units = $('#options #units').val();
            localStorage._allInOne = $('#options #allInOne').val();
            localStorage._opacity = $('#transparency').val();
            
            
            
            
            chrome.storage.sync.set({'weatherMinimal': $('#weatherMinimal').val() });
            
            if($.trim($('#input_location').val()).length === 0) {
                chrome.storage.local.remove('weather');
                chrome.storage.local.remove('location');
            } else if(location) {
                chrome.storage.local.remove('weather');
                chrome.storage.local.set({'location': location});
            }
            
            /* Feature order and diabled */
            var disabledFeatures = [], sortOrder = [];
            $('#option-features .feature').each(function() {
                /* If it's disabled */
                $(this).hasClass('off') && disabledFeatures.push($(this).data('module'));
                /* Reset the ticker position */
                localStorage._tickerPosition = 0;
                /* Add it to the order array */
                sortOrder.push($(this).data('module'));
            });
            chrome.storage.local.set({'sortOrder': sortOrder});
            chrome.storage.local.set({'disabledFeatures': disabledFeatures});
            
            
            el.fadeOut('fast', function() {
                window.location.hash = '';
                setTimeout(function() {
                    window.location.reload();
                }, 100);
                
            });
        }
    };
    
    return options;
});