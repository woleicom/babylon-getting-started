import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import '@babylonjs/loaders/glTF'

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
      -Math.PI / 2 * 3, 
      Math.PI / 2, 
      70, 
      BABYLON.Vector3.Zero(), 
      this._scene
    );
    // camera.upperBetaLimit = Math.PI / 2.2;
    //相机依附 第二个参数：不阻止默认行为
    camera.attachControl(this._canvas, true);
    //创建灯光1
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(0, 1, 0), 
      this._scene
    );
    const fountainProfile = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(10, 0, 0),
      new BABYLON.Vector3(10, 4, 0),
      new BABYLON.Vector3(8, 4, 0),
      new BABYLON.Vector3(8, 1, 0),
      new BABYLON.Vector3(1, 2, 0),
      new BABYLON.Vector3(1, 15, 0),
      new BABYLON.Vector3(3, 17, 0)
    ];
    //Create lathe
    const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this._scene);
    fountain.position.y = -5;

    const particleSystem = new BABYLON.ParticleSystem('particles', 5000, this._scene);

    particleSystem.particleTexture= new BABYLON.Texture('static/texture/flare.png', this._scene);

    // 发射粒子位置
    particleSystem.emitter = new BABYLON.Vector3(0,10,0);
    // 粒子不从一个点发射，而是从发射点周围box盒的最小点内发射
    particleSystem.minEmitBox = new BABYLON.Vector3(-1,0,0);
    // 从发射点周围box盒的最大点内发射
    particleSystem.maxEmitBox = new BABYLON.Vector3(1,0,0);
    // 此时设置的为在（-1，10，0）至（1，10，0）的直线间发射粒子

    // 每个粒子发射后在color1和color2向量之间随机设置颜色
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    // 粒子在其使用寿命结束时的着色
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    //发射粒子的最小和最大尺寸
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // 发射粒子的最短和最长使用寿命
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 3.5;

    // 最小的发射粒子寿命期间，每帧最大发射粒子数
    particleSystem.emitRate = 1500;

    // 用于渲染粒子的混合模式
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // 如果要给粒子定向，可以使用重力
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // 每个粒子发射后在方向1和方向2向量之间的随机方向
    particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
    particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

    // 发射粒子的最小和最大角速度（每个粒子的Z轴旋转）
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // 发射粒子的最小和最大功率
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    // 整体运动速度（0.01是默认更新速度，更新速度更快=动画速度更快）
    particleSystem.updateSpeed = 0.025;

    // 启动粒子系统并开始发射 delay:延迟发射时间（以毫秒为单位）
    particleSystem.start();
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