define(['jquery', 'jquery.autocomplete'], function() {
    var url = 'http://clients1.google.com/complete/search?client=serp&pq=3&sugexp=lemsnc&cp=1&gs_id=13&hl='+window.navigator.language;
    
    return {
        init: function() {
            $('#search').autocomplete(
                {
                    serviceUrl: url,
                    deferRequestBy: 8,
                    dataType: 'text',
                    paramName: 'q',
                    width: 274,
                    transformResult: function(res){
                        var res = typeof res == "string" ? res.split("(")[1].split(")")[0] : res;
                        res = JSON.parse(res);
                        
                        var suggestions = $.map(res[1], function(item) {
                            return {value: $('<div />').html(item[0]).text(), data: $('<div />').html(item[0]).text()};
                        });
                        res = {
                            'suggestions' : suggestions
                        };                      
                        return res;
                    },
                    onSelect: function(item) {
                        window.location.href = 'http://google.com/#q=' + item.data;
                    }
            });
        }
    }
});