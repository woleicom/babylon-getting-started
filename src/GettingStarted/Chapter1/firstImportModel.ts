import * as BABYLON from "@babylonjs/core/Legacy/legacy";
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
    //创建相机
    let camera = new BABYLON.ArcRotateCamera(
      'Camera', 
      -Math.PI / 2, 
      Math.PI / 2.5, 
      15, 
      BABYLON.Vector3.Zero(), 
      this._scene
    );
    camera.attachControl(this._canvas, true);
    //创建灯光1
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(1, 1, 0), 
      this._scene
    );
    //从模型中添加指定网格物体
    // BABYLON.SceneLoader.ImportMeshAsync('semi_house', 'static/babylon/', 'both_houses_scene.babylon');
    //从模型中添加多个网格物体
    // BABYLON.SceneLoader.ImportMeshAsync(['ground', 'semi_house'], 'static/babylon/', 'both_houses_scene.babylon');
    //加载全部物体，并通过promise加载完成后修改指定网格物体
    BABYLON.SceneLoader.ImportMeshAsync('', 'static/babylon/', 'both_houses_scene.babylon').then((result)=>{
      /* 
        .babylon
          detached_house
          ground
          semi_house

        .glb
          _root_
            detached_house
                detached_house primitive0
                detached_house primitive1
            ground
            semi_house
                semi_house primitive0
                semi_house primitive1
      */
      const house1 = this._scene.getMeshByName('detached_house')!;
      house1.position.y = 2;
      const house2 =  result.meshes[2];
      house2.position.y = 1;
    })
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