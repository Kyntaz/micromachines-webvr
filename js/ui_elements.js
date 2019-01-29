function PauseTxt() {
    var self = this;
    this.texture = new THREE.TextureLoader().load('tex/pause.png');

    this.geometry = new THREE.PlaneGeometry(100,50);
    this.material = new THREE.MeshBasicMaterial({map: this.texture, transparent: true});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.visible = false;
    UI_SCENE.add(this.mesh);

    window.addEventListener('keydown', function(key) {
        if (GAME_OVER) return;
        if (key.key == "S" || key.key == "s") self.mesh.visible = !self.mesh.visible;
    });
}

function GameOverTxt() {
    var self = this;
    this.texture = new THREE.TextureLoader().load('tex/go.png');

    this.geometry = new THREE.PlaneGeometry(200,50);
    this.material = new THREE.MeshBasicMaterial({map: this.texture, transparent: true});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.visible = false;
    UI_SCENE.add(this.mesh);

    this.mesh.visible = false;
}

function HitPoints() {
    var self = this;
    var carMesh = CAR.mesh.clone();
    this.models = [
        carMesh.clone(),
        carMesh.clone(),
        carMesh.clone(),
        carMesh.clone(),
        carMesh.clone()
    ];

    this.meshes = new THREE.Object3D();
    console.log(this.models);

    this.models.forEach(function (model, i) {
        model.position.set(-100 + 15 * i, 110, 0);
        self.meshes.add(model);
    });

    UI_SCENE.add(this.meshes);

    this.updateLives = function(l) {
        this.models.forEach(function(model, i) {
            model.visible = i<l;
        });
    }
}

function ScoreTxt() {
    var self = this;
    this.mesh = new THREE.Object3D();
    this.childMesh = null
    this.font = null;
    this.mesh.position.set(100, -110, 0);
    this.material = new THREE.MeshBasicMaterial({color: 0x0});
    UI_SCENE.add(this.mesh);

    var loader = new THREE.FontLoader();
    loader.load('helvetiker_regular.typeface.json', (font) => {
        var geometry = new THREE.TextGeometry('Score: 0', {
            font: font,
            size: 5,
        });
        var txt_mesh = new THREE.Mesh(geometry, self.material);

        self.mesh.add(txt_mesh);
        self.childMesh = txt_mesh;
        self.font = font;
    });

    this.updateScore = (score) => {
        self.mesh.remove(self.childMesh);
        var geometry = new THREE.TextGeometry(`Score: ${score}`, {
            font: self.font,
            size: 5,
        });
        var txt_mesh = new THREE.Mesh(geometry, self.material);

        self.mesh.add(txt_mesh);
        self.childMesh = txt_mesh;
    };
}
