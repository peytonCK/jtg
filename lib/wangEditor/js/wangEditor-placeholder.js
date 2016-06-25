(function(E, $) {
    // 通过 E.plugin 注入插件代码
    E.plugin(function() {
        // 此处的 this 指向 editor 对象本身
        var editor = this;
        var $txt = editor.$valueContainer;
        var $container = editor.$editorContainer;
        var value = $txt.attr('placeholder');
        if(value==undefined){
            value = '';
        }
        editor.$placeholder = $('<div class="editorPlaceholder">' + value + '</div>');
        if ($.trim($txt.text()) || $txt.find('img').length > 0) {
            editor.$placeholder.addClass('hide')
        }
        $container.append(editor.$placeholder)
        editor.$placeholder.on('click', function(e) {
            editor.$txt.focus()
        })
        editor.$txt.on('input', function(e) {
            placeholderControl();
        });
        editor.$txt.on('keypress', function(e) {
            placeholderControl();
        });
        editor.$txt.on('keydown', function(e) {
            placeholderControl();
        });
        editor.$txt.on('keyup', function(e) {
            placeholderControl();
        });
        function placeholderControl(){
            if ($.trim(editor.$txt.text()) || editor.$txt.find('img').length > 0 || editor.$txt.find('blockquote').length > 0) {
                editor.$placeholder.hide();
            } else {
                editor.$placeholder.show();
            }
        }
    });
})(window.wangEditor,window.jQuery);