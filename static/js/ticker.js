define(function() {
    var position = parseInt(localStorage._tickerPosition) || 0,
        title = $('#title').hide(),
        hoverMenu = $('#title .hoverMenu');
    
    if(localStorage._allInOne) {
        return;
    }
    
    var count = $('section').each(function(i) {
        $(this).css({left: ((i + position) * 100) + '%'});
        if((parseInt(this.style.left)) == 0) {
            $('#title .name').text($(this).data('name'));
        }
        $('<li><span style="color: #aaa; float: right; padding-right: 5px;">' + (i+1) + '</span> ' + $(this).data('name') + '</li>').on('click', function() {
            ticker.setPosition(-$(this).index());
            ticker.updateTicker();
        }).appendTo(hoverMenu);
    }).length;
    
    if(count == 0) { $('#ticker-right,#ticker-left').remove(); }
    
    $(document).on('updateTickerData', function() {
        $(hoverMenu).empty();
        $('section').each(function(i) {
            $('<li><span style="color: #aaa; float: right; padding-right: 5px;">' + (i+1) + '</span> ' + $(this).data('name') + '</li>').on('click', function() {
                ticker.setPosition(-$(this).index());
                ticker.updateTicker();
            }).appendTo(hoverMenu);
        });
        ticker.updateTicker();
    });
    
    var ticker = {
        init: function() {
            $('#ticker-right').on('click', function() {
                if($(this).hasClass('inactive')) {
                    ticker.setPosition(0);
                } else {
                    ticker.setPosition(--position);
                }
                
                ticker.updateTicker();
            });
            
            $('#ticker-left').on('click', function() {
                if($(this).hasClass('inactive')) {
                    ticker.setPosition(-($('section').length - 1));
                } else {
                    ticker.setPosition(++position);
                }
                
                ticker.updateTicker();
            });
            
            $(document).on('keyup', function(e) {
                if(e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA') { return; }
                (e.which == 37) && $('#ticker-left').trigger('click');
                (e.which == 39) && $('#ticker-right').trigger('click');
                
                if(String.fromCharCode(e.which).match(/[1-9]/) && parseInt(String.fromCharCode(e.which).match(/[1-9]/)) <= $('section').length) {
                    ticker.setPosition(-(parseInt(String.fromCharCode(e.which)) - 1));
                    ticker.updateTicker();
                }
            })
            
            $(window).on('scroll', function(e) {
                console.log(e);
            });
        },
        setPosition: function(p) {
            position = p;
            localStorage._tickerPosition = p;
        },
        updateTicker: function() {
            if(position == 0) {
                $('#ticker-left').addClass('inactive');
            } else {
                $('#ticker-left').removeClass('inactive');
            }
            
            if(position == -($('section').length - 1)) {
                $('#ticker-right').addClass('inactive');
            } else {
                $('#ticker-right').removeClass('inactive');
            }
            
            $('section').each(function(i) {
                $(this).css({left: ((i + position) * 100) + '%'});
                
                if(parseInt(this.style.left) == 0) {
                    $('#title .name').text($(this).data('name'));
                }
            });
        }
    };
    
    ticker.updateTicker();
    title.show();
    
    return ticker;
})