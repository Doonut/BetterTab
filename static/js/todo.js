define(function() {
    var list = $('#todo'),
        input = $('<li class="input"><input placeholder="What do you have to do?" /></li>'),
        todos = [];
        
    
    var todoManager = {
        init: function() {
            var self = this;
            
            chrome.storage.sync.get('todoitems', function(res) {
                if(res && 'todoitems' in res) {
                    todos = res.todoitems;
                }
                
                $.each(todos, function() {
                    self.appendTodo(this);
                });
                input.appendTo(list).find('input').on('keyup', self.keyup);
                
                list.on('click', 'button', todoManager.complete);
                
                $(document.body).trigger('module_loaded');
            
            });
            
        },
        complete: function() {
            $(this).closest('li').slideUp('fast', function() {
                todos.splice($(this).index(), 1);
                todoManager.updateStorage();
                $(this).remove();
                $(document.body).trigger('module_loaded');
            });
        },
        appendTodo: function(todo) {
            $('<li />').html('<button class="todo-button">✔</button> ').append($('<span />').text(todo.text)).appendTo(list).hide().slideDown('fast', function() {
                $(document.body).trigger('module_loaded');
            });
            $(document.body).trigger('module_loaded');
        },
        updateStorage: function() {
            chrome.storage.sync.set({'todoitems': todos}, function() {});
        },
        keyup: function(e) {
            if(e.which == 13 && $.trim(input.val()).length) {
                var item = {'text': input.find('input').val()};
                
                todoManager.appendTodo(item);
                todos.push(item);
                todoManager.updateStorage();
                input.detach().appendTo(list).find('input').val('').focus();
            }
        }
    };
    
    return todoManager;
});

//       chrome.storage.onChanged.addListener(function(changes, namespace) {