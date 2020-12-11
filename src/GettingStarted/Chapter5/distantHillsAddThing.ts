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
      15, 
      BABYLON.Vector3.Zero(), 
      this._scene
    );
    //相机依附 第二个参数：不阻止默认行为
    camera.attachControl(this._canvas, true);
    //创建灯光1
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(4, 1, 0), 
      this._scene
    );

    BABYLON.SceneLoader.ImportMeshAsync("", "static/babylon/", "valleyvillage.glb",this._scene);
    BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "car.glb", this._scene).then(() => {
        const car = this._scene.getMeshByName("car")!;
        car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
        car.position.y = 0.16;
        car.position.x = -3;
        car.position.z = 8;

        const animCar = new BABYLON.Animation("carAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

      const carKeys = []; 

      carKeys.push({
        frame: 0,
        value: 10
      });


      carKeys.push({
        frame: 200,
        value: -15
      });

      animCar.setKeys(carKeys);

      car.animations = [];
      car.animations.push(animCar);

      this._scene.beginAnimation(car, 0, 200, true);
      
      //wheel animation
      const wheelRB = this._scene.getMeshByName("wheelRB");
      const wheelRF = this._scene.getMeshByName("wheelRF");
      const wheelLB = this._scene.getMeshByName("wheelLB");
      const wheelLF = this._scene.getMeshByName("wheelLF");
      
      this._scene.beginAnimation(wheelRB, 0, 30, true);
      this._scene.beginAnimation(wheelRF, 0, 30, true);
      this._scene.beginAnimation(wheelLB, 0, 30, true);
      this._scene.beginAnimation(wheelLF, 0, 30, true);
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