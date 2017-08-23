THREE.ARObject = function(opt) {
    THREE.Object3D.call(this);
    if ( !opt.camera || !opt.width || !opt.height || !opt.renderer ) {
        throw new Error( 'THREE.ARObject: camera, renderer, width, height must be set!' );
    }

    this.matrixAutoUpdate = false;
    this.onceUpdate = false;
    this.container = new THREE.Object3D();
    this.camera = opt.camera;
    this.renderer = opt.renderer;
    this.container.position.x = parseInt(parseInt(opt.width * 0.16) * 0.37);
    this.container.position.y = parseInt(parseInt(opt.height * 0.08) * 0.72);

    this.add(this.container);
    this.add = function(obj) {
        this.container.add(obj);
    };
};

THREE.ARObject.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {
    constructor: THREE.ARObject
} );

THREE.ARObject.prototype.update = function(param) {
    var modelMatrix = param.models[0].modelmatrix;
    var projectionMatrix = param.models[0].projection;
    var viewport = param.viewport;
    // if(!this.onceUpdate) {        
        this.renderer.setViewport(
            viewport[0] / window.devicePixelRatio,
            viewport[1] / window.devicePixelRatio,
            viewport[2] / window.devicePixelRatio,
            viewport[3] / window.devicePixelRatio);
        this.camera.projectionMatrix.fromArray(projectionMatrix);
        this.onceUpdate = true;
    // }
    this.matrix.fromArray(modelMatrix);
};