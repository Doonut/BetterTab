define(['csv'], function(csv) {
    var root,
        symbols = [],
        to,
        interval = 60000,
        stocks = {
            init: function(el) {
                root = el;
                stocks.get();
                
                root.on('keyup', 'input', function(e) {
                    if(e.which == 13) {
                        stocks.add();
                    }
                }).on('click', '#stockList .remove', function() {
                    stocks.remove($(this).closest('li').detach().find('a').text());
                });
                
                $('<li class="input"><input placeholder="Add a stock ticker" /></li>').appendTo('#stockList');
            },
            get: function() {
                chrome.storage.sync.get('stocks', function(res) {
                    root.find('li').not('.input').remove();
                    symbols = res.stocks || symbols;
                    if(!symbols.length) { root.find('.input').show(); return; }
                    $.each(symbols, function(i, s) {
                        $('<li class="stock"><a href="http://google.com/finance?q=' + s + '">' + s.toUpperCase() + '</a><span class="fr"><span class="remove">✖</span></span></li>').prependTo('#stockList');
                    });
                    
                    stocks.update();
                });
            },
            update: function() {
                $.get('http://finance.yahoo.com/d/quotes.csv?s=' + symbols.join(',') + '&f=sl1p2j1', function(res) {
                    if(!res) { to = setTimeout(stocks.update, interval); return; }
                    stocks.render(csv.parse(res));
                }).error(function() {
                    to = setTimeout(stocks.update, 2000);
                });
            },
            add: function() {
                var stock = $.trim(root.find('input').val());
                if(stock && $.inArray(stock.toUpperCase(), symbols) == -1) {
                    clearTimeout(to);
                    symbols.push(stock.toUpperCase());
                    root.find('.input').click().find('input').val('');
                    stocks.save();
                    stocks.get();
                }
            },
            save: function() {
                chrome.storage.sync.set({'stocks': symbols});
            },
            remove: function(symbol) {
                var pos = $.inArray(symbol, symbols);
                if(pos != -1) {
                    clearTimeout(to);
                    symbols.splice(pos, 1);
                    stocks.save();
                    //stocks.get();
                }
            },
            render: function(values) {
                root.find('li').not('.input').remove();
                $.each(values, function(i, val) {
                    var p = parseFloat(this[1]).toFixed(2),
                        cap = this[3],
                        cls = (this[2].indexOf('-') == 0) ? 'stock-down' : 'stock-up';
                    
                    $('<li><a href="http://google.com/finance?q=' + this[0] + '">' + this[0] + '</a><span class="fr"><span class="remove">✖</span> &nbsp;&nbsp;$' + parseFloat(p.split('.')[0]).toLocaleString('en') + '.' + p.split('.')[1] + ' <b style="display: inline-block; text-align: right; width: 60px;">' + cap + '</b><i class="' + cls +'">' + this[2] + '</i></span></li>').prependTo('#stockList');
                    
                });
                to = setTimeout(stocks.update, interval);
                $(document.body).trigger('module_loaded');
            }
        }
        
        
    
    return stocks;
});