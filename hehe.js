window.onload = function() {
    console.log('yes yes');

    function send1000Text() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 1; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }


        var time = null;
        var params = null;
        time = new Date().getTime();

        params = {
            // 是否将截屏结果保存一份到相册中
            text: text,
            time: time
        };

        console.log('hehehe call');

        window.WindVane.call('MyJSBridge', 'firstAPI', params, function(e) {
            console.log('success: ' + new Date().getTime() - params['time']);
        }, function(e) {
            console.log('failure: ' + new Date().getTime() - params['time']);
        });
    }

    $("#refresh").on("click", function(e) {
        send1000Text();
    });

}

window.onerror = function(a, b, c) {
    alert(a + b + c);
}
