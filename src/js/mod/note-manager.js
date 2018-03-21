let Toast = require('./toast.js').Toast;
let Note = require('./note.js').Note;
let Event = require('mod/event.js');

let NoteManager = (function () {
    //页面加载
    function load() {
        $.get('api/notes').done((res) => {
            if (res.status === 1) {
                $.each(res.data, (index,msg)=>{
                    new Note({
                        id: msg.id,
                        context: msg.text,
                        createTime: msg.createdAt.match(/^\d{4}-\d{1,2}-\d{1,2}/),
                        username: msg.username
                    });
                });
                Event.fire('waterfall');
            } else {
                Toast(1, res.errorMsg);
            }
        }).fail(()=>{
            Toast(1, "网络异常");
        });
    }
    /* 添加笔记 */
    function add() {
        $.get('/login').then((res)=> {
            if (res.status === 1) {
                new Note({
                    username: res.username
                });
            } else {
                Toast(0, res.errorMsg);
            }
        });

    }

    return {
        load: load,
        add: add
    }
})();

module.exports = NoteManager;