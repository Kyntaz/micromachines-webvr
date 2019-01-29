var cubeCamera;
var mirrorMesh;

function Mirror(scene, geometry, transform){  
    // Table Geometry
    var resolution = 1024;

    var mirror = new THREE.Reflector( geometry, {
        clipBias: 0.003,
        color: 0x777777,
        recursion: 30,
        textureWidth: resolution,
        textureHeight: resolution
    } );

    transform(mirror);


    scene.add( mirror );
}
