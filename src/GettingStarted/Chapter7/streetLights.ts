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
    // this._scene.debugLayer.show();
    //创建相机
    let camera = new BABYLON.ArcRotateCamera(
      'Camera', 
      -Math.PI / 2, 
      Math.PI / 2.2, 
      50, 
      BABYLON.Vector3.Zero(), 
      this._scene
    );
    // camera.upperBetaLimit = Math.PI / 2.2;
    //相机依附 第二个参数：不阻止默认行为
    camera.attachControl(this._canvas, true);
    //创建灯光1
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(0, 50, 0), 
      this._scene
    );
    // 强度 [ɪnˈtensəti] 
    light.intensity = 0.5;
    //angle: 光线以弧度表示的锥角
    //exponent: 光的衰减速度与到发射点的距离有关
    const lampLight = new BABYLON.SpotLight('lampLight',BABYLON.Vector3.Zero(), new BABYLON.Vector3(0,-1,0),Math.PI,1,this._scene);
    lampLight.diffuse = BABYLON.Color3.Yellow();

    // 共分为20段以1为半径的类圆形，作为挤出的基础面
    const lampShape = [];
    for (let i = 0; i < 20; i++) {
      lampShape.push(new BABYLON.Vector3(Math.cos(i * Math.PI / 10), Math.sin(i* Math.PI / 10), 0));
    }
    lampShape.push(lampShape[0]);
    // 计算出挤出面需要沿的线段
    /* 
        （1，11，0）  
          ---（3，11，0）
        /
        |（0，10，0）
        |
        |（0，0，0）
    */
    const lampPath:BABYLON.Vector3[] = [];
    lampPath.push(new BABYLON.Vector3(0,0,0));
    lampPath.push(new BABYLON.Vector3(0,10,0));
    for(let i = 0; i < 20; i++) {
      // cos计算前90度，用180度相减会得到负值，sin计算前90度，用180度相减值不变
      // 所以X轴因为是加1，所以需要得到负值，而Y轴是加10，所以需要正值，最后点为（1，11，0）
      // lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
      lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(i * Math.PI / 40), 0));
    }
    lampPath.push(new BABYLON.Vector3(3,11,0));

    const yellowMat = new BABYLON.StandardMaterial('yellowMat', this._scene);
    yellowMat.emissiveColor = BABYLON.Color3.Yellow();

    //挤压形状
    const lamp = BABYLON.MeshBuilder.ExtrudeShape('lamp', {
      cap: BABYLON.Mesh.CAP_END, // 封顶方式
      shape: lampShape, // 挤压的形状，沿着z轴被挤压
      path: lampPath, // 挤压沿着的轴线曲线
      scale: 0.5 // 缩放形状的值
    });
    const bulb = BABYLON.MeshBuilder.CreateSphere('bulb', {diameterX: 1.5, diameterZ: 0.8});
    bulb.material = yellowMat;
    bulb.parent = lamp;
    bulb.position.x = 2;
    bulb.position.y = 10.5;

    lampLight.parent = bulb;

    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 50, height: 50});

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