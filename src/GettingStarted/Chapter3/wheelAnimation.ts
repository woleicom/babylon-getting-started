import * as BABYLON from "@babylonjs/core/Legacy/legacy";
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
      3, 
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
    
    const car = this.buildCar();
    car.rotation.x = -Math.PI / 2;
    
  }
  buildCar() {
     /* 
      (-0.3,0.1) (0, 0.1)   
      -------------\
      |             | radius: 0.2
      --------------|
      (-0.3,-0.1)   (0.2,-0.1)
    */

    //base
    const outline = [
      new BABYLON.Vector3(-0.3, 0 , -0.1),
      new BABYLON.Vector3(0.2, 0 , -0.1),
    ]
    //curved front
    for (let i = 0;i < 20; i++) {
      outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1))
    };
    //top
    outline.push(new BABYLON.Vector3(0, 0, 0.1));
    outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

    const faceUV = [];
    //对于挤出的多边形和圆柱面：0为底面，2为顶面，1是连接顶部和底部中间的面
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
    faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);
    const carMat = new BABYLON.StandardMaterial('carMat', this._scene);
    carMat.diffuseTexture = new BABYLON.Texture('static/texture/car.png', this._scene);
    // 依赖earcut库
    const car = BABYLON.MeshBuilder.ExtrudePolygon('car', {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true});
    car.material = carMat;

    const wheelUV = [];
    wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
    const wheelMat = new BABYLON.StandardMaterial('wheelMat', this._scene);
    wheelMat.diffuseTexture = new BABYLON.Texture('static/texture/wheel.png',this._scene);
    //右后
    const wheelRB = BABYLON.MeshBuilder.CreateCylinder('wheelRB', {diameter:0.125, height:0.05, faceUV: wheelUV});
    wheelRB.material = wheelMat;
    wheelRB.parent = car;
    wheelRB.position.z = -0.1;
    wheelRB.position.x = -0.2;
    wheelRB.position.y = 0.035;

    //右前
    const wheelRF = wheelRB.clone("wheelRF");
    wheelRF.position.x = 0.1;
    //左后
    const wheelLB = wheelRB.clone("wheelLB");
    wheelLB.position.y = -0.2 - 0.035;
    //左前
    const wheelLF = wheelRF.clone("wheelLF");
    wheelLF.position.y = -0.2 - 0.035;

    const animWheel = new BABYLON.Animation('wheelAnimation', 'rotation.y', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const wheelKeys = [];

    wheelKeys.push({
      frame: 0,
      value: 0
    });
    wheelKeys.push({
      frame: 30,
      value: 2 * Math.PI
    });

    animWheel.setKeys(wheelKeys);

    wheelRB.animations = [];
    wheelRB.animations.push(animWheel);
    
    this._scene.beginAnimation(wheelRB, 0, 30, true);
    return car;
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