import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import '@babylonjs/loaders/glTF'
//https://github.com/mapbox/earcut
import earcut from 'earcut';
window.earcut = earcut;

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
      50, 
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

    BABYLON.SceneLoader.ImportMeshAsync('', 'static/babylon/Dude/', 'Dude.babylon', this._scene).then((result)=>{
      let dude = result.meshes[0];
      dude.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
      this._scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
    });
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