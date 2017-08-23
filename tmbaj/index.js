window.onload = function() {

    //AR部分。
    var $reg = document.querySelector("#reg");
    document.addEventListener('FacePlugin.captureDetectResult', arPluginUpdate, false);

    function arPluginUpdate(e) {
        if (e.param.faces.length > 0) {
            // $reg.innerText = "成功识别" + Date.now();
            $reg.innerText = "" + e.param.faces[0].face_rectangle[0] + "-"+ e.param.faces[0].face_rectangle[1] + "-" + e.param.faces[0].face_rectangle[2] + "-" + e.param.faces[0].face_rectangle[3] + "-f-" + e.param.faces[0].landmark.length;
            $reg.style.background = "green";

            if( e.param.frame != null ){
                alert('result: ' + JSON.stringify(e.param.frame));
            }
            //定位识别2维坐标点.
            // arparams = e.param;

            // markerRoot.visible = true;

        } else {
            $reg.innerText = "无法识别" + Date.now();
            $reg.style.background = "red";

            // markerRoot.visible = false;
        }
    }

    var cameraFront = false;

    function show_image(src, width, height, alt) {
        var img = document.createElement("img");
        img.src = src;
        img.width = width;
        img.height = height;
        img.alt = alt;

        // This next line will just add it to the <body> tag
        document.body.appendChild(img);
    }

    $("#startCamera").on("click", function(e) {
        var data = {
        };

        Ali && Ali.callWindVane("WVCommonPlugin.startCamera", data, function(e) {
            // alert('result: ' + JSON.stringify(e));
        }, function(e) {
        });
    });
    $("#stopCamera").on("click", function(e) {
        var data = {
        };

        Ali && Ali.callWindVane("WVCommonPlugin.stopCamera", data, function(e) {
            // alert('result: ' + JSON.stringify(e));
        }, function(e) {
        });
    });
    $("#faceCollect").on("click", function(e) {
        var data = {
        };

        Ali && Ali.callWindVane("RP.liveness", data, function(e) {
            // alert('result: ' + JSON.stringify(e));
        }, function(e) {
            alert('result: ' + JSON.stringify(e));
            // alert('result: ' + e);
            // if( e.bigImage != null && e.bigImage.imageUrl != null ){
                // alert('result: ' + e.bigImage.imageUrl);
                // show_image(e.bigImage.imageUrl,100,100,'face');
            // }
        });
    });
}

window.onerror = function(a, b, c) {
    alert(a + b + c);
}