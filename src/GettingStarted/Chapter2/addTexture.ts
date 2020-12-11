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
      10, 
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

    const  groundMat = new BABYLON.StandardMaterial('groundMat',this._scene);
    // 漫射
    groundMat.diffuseColor = new BABYLON.Color3(0,1,0);
    // new BABYLON.Color3.Red();
    // new BABYLON.Color3.Green();
    // new BABYLON.Color3.Blue();
    // new BABYLON.Color3.Black();
    // new BABYLON.Color3.White();
    // new BABYLON.Color3.Purple();
    // new BABYLON.Color3.Magenta();
    // new BABYLON.Color3.Yellow();
    // new BABYLON.Color3.Gray(),
    // new BABYLON.Color3.Teal();

    const roofMat = new BABYLON.StandardMaterial('roofMat', this._scene);
    roofMat.diffuseTexture = new BABYLON.Texture('static/texture/roof.jpg',this._scene);
    const boxMat = new BABYLON.StandardMaterial('boxMat', this._scene);
    boxMat.diffuseTexture = new BABYLON.Texture('static/texture/floor.png',this._scene);


    const box = BABYLON.MeshBuilder.CreateBox('box', {});
    box.position.y = 0.5;
    box.material = boxMat;
    const roof = BABYLON.MeshBuilder.CreateCylinder('roof', {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 10, height: 10}); 
    ground.material = groundMat;
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