window.onload = function() {

    // 渲染部分。
    var scene, renderer, camera, markerRoot;

    var arparams;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 创建相机
    camera = new THREE.Camera();
    // camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

    // camera.position.x = 1200;
    // camera.position.y = 1200;
    // camera.position.z = 1200;

    // camera.up.x = 0;
    // camera.up.y = 1;
    // camera.up.z = 0;
    scene.add(camera);

    // 创建容器对象
    markerRoot = new THREE.ARObject({
        renderer: renderer,
        camera: camera,
        width: 478,
        height: 255
    });

    var GLTFLoader = new THREE.GLTFLoader();
    GLTFLoader.setCrossOrigin('anonymous');
    GLTFLoader.load("https://ossgw.alicdn.com/tmall-c3/tmx/a1ba18d7afaaa9c1a9fa088dc2173a96.gltf", function(data) {
        var gltf = data;
        object = gltf.scene !== undefined ? gltf.scene : gltf.scenes[0];
        // object.position.x = 0;
        // object.position.y = 0;
        // object.position.z = 0;
        object.scale.set(0.15, 0.15, 0.15);
        // object.children[0].children.splice(3, 1);
        markerRoot.add(object);
        scene.add(markerRoot);
    })

    // var geometry = new THREE.BoxGeometry(120, 120, 120);
    // var material = new THREE.MeshBasicMaterial({
    //     color: 0x00ff00,
    //     wireframe: true
    // });
    // var cube = new THREE.Mesh(geometry, material);

    // markerRoot.add(cube);
    // scene.add(markerRoot);


    function tick() {
        if (arparams) {
            markerRoot.update(arparams);
        }

        renderer.autoClear = false;
        renderer.clear();
        renderer.render(scene, camera);

        requestAnimationFrame(tick);
    }


    //AR部分。
    var $reg = document.querySelector("#reg");
    document.addEventListener('arpluginupdate', arPluginUpdate, false);

    function arPluginUpdate(e) {
        if (e.param.models.length > 0) {
            $reg.innerText = "成功识别" + Date.now();
            $reg.style.background = "green";

            //定位识别2维坐标点.
            arparams = e.param;

            markerRoot.visible = true;

        } else {
            $reg.innerText = "无法识别" + Date.now();
            $reg.style.background = "red";

            markerRoot.visible = false;
        }
    }

    // $("#collect img").on("click", function(e) {
    //     $("#collect").hide();

    //     var dataObject = tmall;

    //     var id = $(this).attr("id");
    //     if (id == "tmall") dataObject = tmall;
    //     if (id == "intel") dataObject = intellogo;
    //     if (id == "warcraft") dataObject = warcraft;
    //     if (id == "rmb") dataObject = rmb;
    //     if (id == "coca" || id == "binglu") dataObject = coco;

    //     var data = {
    //         dat: dataObject
    //     };

    //     // alert( data.dat );

    //     Ali && Ali.callWindVane("SLAMPlugin.startUp", data, function(b) {
    //         $reg.innerText = "成功启动";

    //         //执行渲染。
    //         tick();
    //     });

    // });

    var cameraFront = false;

    $("#switch").on("click", function(e) {

        cameraFront = !cameraFront;

        var type = cameraFront ? "front" : "back"

        var data = {
            cameraType: type
        };

        Ali && Ali.callWindVane("SLAMPlugin.updateConfig", data, function(b) {});
    });

    $("#newpage").on("click", function(e) {
        window.location.href = 'tmall://page.tm/itemDetail?itemId=538002140577&spm=a320p.7692363.0.0&id=538002140577&pic=//img.alicdn.com/bao/uploaded/i1/TB1LkltPXXXXXXKXXXXXXXXXXXX_!!0-item_pic.jpg_Q50s50.jpg_.webp&itemTitle=南极人新款加绒加厚保暖内衣套装男秋衣秋裤女蓄热德绒重磅暖衣PT&price=99.00&from=h5';
    });

    $("#slam").on("click", function(e) {
        //执行渲染。
        tick();
        var data = {

        };
        Ali && Ali.callWindVane("SLAMPlugin.startUp", data, function(b) {});
    });
}

window.onerror = function(a, b, c) {
    alert(a + b + c);
}