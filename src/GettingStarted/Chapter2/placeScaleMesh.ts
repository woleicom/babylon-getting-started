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
    //创建灯光1
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(1, 1, 0), 
      this._scene
    );

    // const bounce = new BABYLON.Sound('bounce', 'static/media/bounce.wav', this._scene);
    // setInterval(() => bounce.play(), 3000);

    /* 
          | +Y
          |
          |_________ +X
          /
        /
      / -Z
    
    */

    const box1 = BABYLON.MeshBuilder.CreateBox('box1', {width: 2, height: 1.5, depth: 3});
    box1.position.y = 0.75;

    const box2 = BABYLON.MeshBuilder.CreateBox('box2', {});
    box2.scaling.x = 2;
    box2.scaling.y = 1.5;
    box2.scaling.z = 3;
    box2.position = new BABYLON.Vector3(-3, 0.75, 0);

    const box3 = BABYLON.MeshBuilder.CreateBox('box3', {});
    box3.scaling = new BABYLON.Vector3(2, 1.5, 3);
    box3.position.x = 3;
    box3.position.y = 0.75;
    box3.position.z = 0;
    
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width:10, height: 10});

    const box = BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
    box.position.z = -3;
    box.rotation.y = Math.PI / 4;
    box.rotation.y = BABYLON.Tools.ToDegrees(45);
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