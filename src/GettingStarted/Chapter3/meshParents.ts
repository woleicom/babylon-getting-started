import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import {showAxis, localAxis} from '../../Tools/axis';
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
      -Math.PI / 2.2, 
      Math.PI / 2.5, 
      15, 
      BABYLON.Vector3.Zero(), 
      this._scene
    );
    //相机依附 第二个参数：不阻止默认行为
    camera.attachControl(this._canvas, true);
    //创建灯光1
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(0, 1, 0), 
      this._scene
    );
    
    const faceColors = [];
    faceColors[0] = BABYLON.Color4.FromColor3(BABYLON.Color3.Blue(), 1);
    faceColors[1] = BABYLON.Color4.FromColor3(BABYLON.Color3.Teal(), 1);
    faceColors[2] = BABYLON.Color4.FromColor3(BABYLON.Color3.Red(), 1);
    faceColors[3] = BABYLON.Color4.FromColor3(BABYLON.Color3.Purple(), 1);
    faceColors[4] = BABYLON.Color4.FromColor3(BABYLON.Color3.Green(), 1);
    faceColors[5] = BABYLON.Color4.FromColor3(BABYLON.Color3.Yellow(), 1);

    const boxParent = BABYLON.MeshBuilder.CreateBox('box', {faceColors: faceColors});
    const boxChild = BABYLON.MeshBuilder.CreateBox('box', {size: 0.5, faceColors: faceColors});
    // boxChild.parent = boxParent;
    boxChild.setParent(boxParent);

    boxChild.position.x = 0;
    boxChild.position.y = 2;
    boxChild.position.z = 0;
    
    boxChild.rotation.x = Math.PI / 4;
    boxChild.rotation.y = Math.PI / 4;
    boxChild.rotation.z = Math.PI / 4;

    boxParent.position.x = 2;
    boxParent.position.y = 0;
    boxParent.position.z = 0;

    boxParent.rotation.x = 0;
    boxParent.rotation.y = 0;
    boxParent.rotation.z = -Math.PI / 4;

    const boxChildAxis = localAxis(1, this._scene);
    boxChildAxis.parent = boxChild;
    showAxis(6, this._scene);
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