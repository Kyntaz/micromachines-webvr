

var OrangeTexture = new THREE.TextureLoader().load('tex/orange.jpg');
var OrangeBumpTex = new THREE.TextureLoader().load('tex/orange-normal.jpg');

var orange_material = orangeMaterial(OrangeTexture, OrangeBumpTex);

var orange_material2 = new THREE.MeshBasicMaterial( { color: 0x7cba81} );
var orange_phong2 = new THREE.MeshPhongMaterial({color: 0x7cba81, emissive: 0x0, specular: 0x878787, shininess: 10});
var orange_lambert2 = new THREE.MeshLambertMaterial({color: 0x7cba81, emissive: 0x0});

function Orange(position){
  'use strict';

  var self = this;

  var mesh = new THREE.Object3D();

  var geometry = new THREE.SphereBufferGeometry( 5, 8, 8 );
  THREE.BufferGeometryUtils.computeTangents( geometry );
  var material = orange_material
  var body = new THREE.Mesh( geometry, material );

  var geometry2 = new THREE.TorusGeometry(0.5, 0.5, 3, 3);
  var head = new THREE.Mesh(geometry2, orange_material2);
  head.position.set(0,0,5);

  mesh.add(body, head);
  this.head = head;
  this.lightMat2 = PHONG_SWITCH ? (orange_phong2) : (orange_lambert2);
  this.head.material = ILUMINATE ? this.lightMat2 : orange_material2;

  MovableObject.call(this, position, mesh, orange_material, orange_material, orange_material);
  SolidObject.call(this, position, mesh, new SphereBox(5), orange_material, orange_material, orange_material);

  this.target = body;
  this.target.material = ILUMINATE ? this.lightMat : this.basicMat;

  // Uniform Movement
  this.move = function(delta) {
    var dir = new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z);
    this.mesh.position.add(dir.multiplyScalar(this.speed*delta));

    if (this.direction.z == 0) {
      var rotAxis = (new THREE.Vector3(0,0,0)).crossVectors(this.direction, new THREE.Vector3(0,0,1))
      mesh.rotateOnAxis(rotAxis, -Math.PI*(this.speed/25)*delta)
    }
  };

  this.update = function(delta) {
    this.move(delta);
    if (this.isOutside()) {
        this.speed = 120;
        this.direction = new THREE.Vector3(0,0,-1);
    }

    if (this.mesh.position.z < -100) {
      this.remove();
    }
  };

  this.collide = function(other) {
    if (other instanceof Butter || other instanceof Orange) {
      var disp = this.direction.clone().divideScalar(20);
      while (this.hasCollision(other)) {
        this.mesh.position.sub(disp);
      }

      // Bounce
      if (other instanceof Butter) {
        var n;
        if (Math.abs(this.mesh.position.y - other.mesh.position.y) >= 12.5) n = new THREE.Vector3(0,1,0);
        else n = new THREE.Vector3(1,0,0);
        this.direction.reflect(n);
      }
      else {
        var dir = this.mesh.position.clone().sub(other.mesh.position).normalize();
        this.direction = dir;
      }
    }
  };

  this.switchWireFrame2 = function(key) {
    if (key.key === "A" || key.key === "a") {
        orange_lambert2.wireframe = IN_WIREFRAME;
        orange_material2.wireframe = IN_WIREFRAME;
        orange_phong2.wireframe = IN_WIREFRAME;
    }
}

  this.switchMat2 = function(key) {
  switch (key.key) {
      case "L":
      case "l":
          if (ILUMINATE) self.head.material = self.lightMat2;
          else self.head.material = orange_material2;
          break;
      case "G":
      case "g":
          if (PHONG_SWITCH) self.lightMat2 = orange_phong2;
          else self.lightMat2 = orange_lambert2;
          if (ILUMINATE) self.head.material = self.lightMat2;
          break;
  }
}

  this.speed = ORANGE_SPEED;
  this.direction = (new THREE.Vector3(1,0,0)).applyAxisAngle(new THREE.Vector3(0,0,1), 360*Math.random());
  UPDATE.push(this);

  window.addEventListener("keydown", this.switchMat2);
  window.addEventListener("keydown", this.switchWireFrame2);
}

function orangeMaterial(texture, bumpMap) {
  var uniforms = {
    texture1: { type: "t", value: texture },
    bumpMap: { type: "t", value: bumpMap },
    material: { value: {
        diffuse: new THREE.Vector4(1, 0.647, 0, 1.0),
        specular: new THREE.Vector4(1, 0.549, 0, 1.0),
        shininess: 100,
        twoTextures: false
      }
    },
    fog: true
  }

  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
}

function updateOrangeFog(scene){
  if(scene.fog != null){
    orange_material.uniforms.fogColor = { type: "c", value: scene.fog.color };
    orange_material.uniforms.fogDensity = { type: "f", value: scene.fog.density };
    orange_material.uniforms.enableFog = { type: "b", value: true };
  } else {
    orange_material.uniforms.enableFog = { type: "b", value: false };
  }
}