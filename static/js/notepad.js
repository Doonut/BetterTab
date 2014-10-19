define(function() {
    var notepad = $('#notepad textarea'),
        rows = notepad.val().split("\n").length+1||2;
        
        
        
    return {
        init: function() {
            chrome.storage.sync.get('notepad', function(res) {
                notepad.val(res.notepad || '');
                rows = notepad.val().split("\n").length+1||2;
                notepad.attr("rows", rows);
                $(document.body).trigger('module_loaded');
            });
            
            notepad.on('keyup', function() {
                chrome.storage.sync.set({'notepad': notepad.val()});
                var newRows = notepad.val().split("\n").length+1||2;
                if(newRows != rows) {
                    notepad.attr("rows", newRows);
                    rows = newRows;
                    $(document.body).trigger('module_loaded');
                }
                
            });
            $(document.body).trigger('module_loaded');
        }
    }
});