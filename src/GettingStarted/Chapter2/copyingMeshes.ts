import * as BABYLON from "babylonjs";
export default class Game {
  private _canvas: HTMLCanvasElement; //画布元素
  private _engine: BABYLON.Engine; //引擎
  private _scene!: BABYLON.Scene; //场景
  private fpsLabel:HTMLElement;

  constructor(canvasElement: string) {
    // 设置画布和创建引擎
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    //第二个参数：是否抗锯齿
    this._engine = new BABYLON.Engine(this._canvas, true);

    this.fpsLabel = document.getElementById("fpsLabel")!;
  }
  init(): void {
    // 创建场景
    this.createScene();
    // 开始循环渲染
    this.doRender();
  }
  /**
   * 创建场景
   */
  createScene(): void {
    //创建3D场景
    this._scene = new BABYLON.Scene(this._engine);
    //this._scene.debugLayer.show();
    //创建相机
    let camera = new BABYLON.ArcRotateCamera(
      'Camera', 
      -Math.PI / 2, 
      Math.PI / 2.5, 
      15, 
      BABYLON.Vector3.Zero(), 
      this._scene
    );
    //相机依附 第二个参数：不阻止默认行为
    camera.attachControl(this._canvas, true);
    //创建灯光
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(1, 1, 0), 
      this._scene
    );
    this.buildDwellings();
  }
  buildDwellings() {
    const ground = this.buildGround();
    // const house = this.buildHouse(1);
    // clonedHouse = house.clone('clonedHouse'); // 克隆网格
    // instanceHouse = house.createInstance('instanceHouse'); // 创建实例网格，材质指引到原始网格，并且不能更改
    const detached_house = this.buildHouse(1)!;
    detached_house.rotation.y = -Math.PI / 16;
    detached_house.position.x = -6.8;
    detached_house.position.z = 2.5;

    const semi_house = this.buildHouse(2)!;
    semi_house.rotation.y = -Math.PI / 16;
    semi_house.position.x = -4.5;
    semi_house.position.z = 3;

    const places = []; // [house type, rotation, x, z]
    places.push([1, -Math.PI / 16, -6.8, 2.5 ]); // 与detached_house重叠
    places.push([2, -Math.PI / 16, -4.5, 3 ]); // 与semi_house重叠
    places.push([2, -Math.PI / 16, -1.5, 4 ]);
    places.push([2, -Math.PI / 3, 1.5, 6 ]);
    places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
    places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
    places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
    places.push([1, 5 * Math.PI / 4, 0, -1 ]);
    places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
    places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
    places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
    places.push([2, Math.PI / 1.9, 4.75, -1 ]);
    places.push([1, Math.PI / 1.95, 4.5, -3 ]);
    places.push([2, Math.PI / 1.9, 4.75, -5 ]);
    places.push([1, Math.PI / 1.9, 4.75, -7 ]);
    places.push([2, -Math.PI / 3, 5.25, 2 ]);
    places.push([1, -Math.PI / 3, 6, 4 ]);

    const houses = [];
    for (let i = 0; i < places.length; i++) {
      houses[i] = places[i][0] === 1 ? detached_house.createInstance('house'+i):semi_house.createInstance('house'+i);
      houses[i].rotation.y = places[i][1];
      houses[i].position.x = places[i][2];
      houses[i].position.z = places[i][3];
    }
  }
  buildGround() {
    const  groundMat = new BABYLON.StandardMaterial('groundMat',this._scene);
    // 漫射
    groundMat.diffuseColor = new BABYLON.Color3(0,1,0);
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 10, height: 10}); 
    ground.material = groundMat;

    return ground;
  }
  buildHouse(width: number) {
    const box = this.buildBox(width);
    const roof = this.buildRoof(width);
    return BABYLON.Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
  }
  buildBox(width: number = 1) {
    const boxMat = new BABYLON.StandardMaterial('boxMat', this._scene);
    boxMat.diffuseTexture = new BABYLON.Texture(width == 2?'static/texture/semihouse.png':'static/texture/cubehouse.png',this._scene);

    const faceUV = [];
    // faceUV 0:back,1:front,2:left,3:right,4:top,5:bottom;
    // 左下坐标-右上坐标 左下x，左下y，右上x，右上y 值为0-1之前的比值
    faceUV[0] = width == 2?new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0):new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); // back face
    faceUV[1] = width == 2?new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0):new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); // front face
    faceUV[2] = width == 2?new BABYLON.Vector4(0.4, 0, 0.6, 1.0):new BABYLON.Vector4(0.25, 0.0, 0.5, 1.0); // right face
    faceUV[3] = width == 2?new BABYLON.Vector4(0.4, 0, 0.6, 1.0):new BABYLON.Vector4(0.75, 0.0, 1.0, 1.0); // left face
    // wrap:boolean（BJS 大于等于 4.0），当所有垂直边（0、1、2、3），值为true时，将垂直应用图像纹理，而不产生旋转
    const box = BABYLON.MeshBuilder.CreateBox('box', {width: width,faceUV:faceUV, wrap: true});
    box.position.y = 0.5;
    box.material = boxMat;
    return box;
  }
  buildRoof(width: number = 1) {
    const roofMat = new BABYLON.StandardMaterial('roofMat', this._scene);
    roofMat.diffuseTexture = new BABYLON.Texture('static/texture/roof.jpg',this._scene);
    
    const roof = BABYLON.MeshBuilder.CreateCylinder('roof', {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.scaling.y = width;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
    return roof;
  }
  /**
   * 实时渲染
   */
  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();
      this.fpsLabel!.innerHTML = this._engine.getFps().toFixed() + " fps";
    });

    // The canvas/window resize event handler.
    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }
}