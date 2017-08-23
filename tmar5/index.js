window.onload = function() {

    // 渲染部分。
    // var scene, renderer, camera, markerRoot;

    // var arparams;

    // scene = new THREE.Scene();
    // renderer = new THREE.WebGLRenderer({
    //     alpha: true,
    //     antialias: true
    // });

    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    // 创建相机
    // camera = new THREE.Camera();
    // scene.add(camera);

    // 创建容器对象
    // markerRoot = new THREE.ARObject({
        // renderer: renderer,
        // camera: camera,
        // width: 300,
        // height: 300
    // });

    // var geometry = new THREE.BoxGeometry(30, 30, 30);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    // var cube = new THREE.Mesh(geometry, material);

    // markerRoot.add(cube);
    // scene.add(markerRoot);


    // function tick() {
        // if (arparams) {
        //     markerRoot.update(arparams);
        // }

        // renderer.autoClear = false;
        // renderer.clear();
        // renderer.render(scene, camera);

        // requestAnimationFrame(tick);
    // }


    //AR部分。
    var $reg = document.querySelector("#reg");
    document.addEventListener('FacePlugin.captureDetectResult', arPluginUpdate, false);

    function arPluginUpdate(e) {
        if( e.param.frame != null ){
            alert('result: ' + JSON.stringify(e.param.frame));
        }
        else{
            // alert('result: ' + JSON.stringify(e.param));
        }
        if (e.param.faces.length > 0) {
            $reg.innerText = "" + e.param.faces[0].face_rectangle[0] + "-"+ e.param.faces[0].face_rectangle[1] + "-" + e.param.faces[0].face_rectangle[2] + "-" + e.param.faces[0].face_rectangle[3] + "-f-" + e.param.faces[0].landmark.length;
            $reg.style.background = "green";
        } else {
            $reg.innerText = "无法识别" + Date.now();
            $reg.style.background = "red";
        }
    }

    var cameraFront = false;

    $("#stop").on("click", function(e) {
        var data = {
        };
        alert('stop: ');
        Ali && Ali.callWindVane("FacePlugin.stopCameraDetect", data, function(e) {
            // alert('result: ' + JSON.stringify(e));
        }, function(e) {
        });
    });

    // quality  front 
    $("#start_fq").on("click", function(e) {
         var data = {
            cameraType: 'front',
            previewMode: 'quality'
        };

        Ali && Ali.callWindVane("FacePlugin.startCameraDetect", data, function(e) {
            // alert('result: ' + JSON.stringify(e));
        }, function(e) {
        });
    });

    //  speed  front 
    $("#start_fs").on("click", function(e) {
         var data = {
            cameraType: 'front',
            previewMode: 'speed'
        };
        Ali && Ali.callWindVane("FacePlugin.startCameraDetect", data, function(e) {
            // alert('result: ' + JSON.stringify(e));
        }, function(e) {
        });
    });

    // quality   back
    $("#start_bq").on("click", function(e) {
         var data = {
            cameraType: 'back',
            previewMode: 'quality'
        };

        Ali && Ali.callWindVane("FacePlugin.startCameraDetect", data, function(e) {
            // alert('result: ' + JSON.stringify(e));
        }, function(e) {
        });
    });

    // screenshot
    $("#take_pic").on("click", function(e) {
        var data = {};
        Ali && Ali.callWindVane("FacePlugin.takeCameraFrame", data, function(e) {
        }, function(e) {
            // alert('result: ' + JSON.stringify(e));
        });
    });

    $("#img").on("click", function(e) {
         var data = {
            url: 'https://dtmall-tel.alicdn.com/minsk/online/fileware/201707/1a1295cb-36bb-459e-87ba-901c4f0620a7',
            // data: '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'
        };

        Ali && Ali.callWindVane("FacePlugin.imgDetect", data, function(e) {
            //
        }, function(e) {
            alert('result: ' + JSON.stringify(e));
        });
    });
}

window.onerror = function(a, b, c) {
    alert(a + b + c);
}