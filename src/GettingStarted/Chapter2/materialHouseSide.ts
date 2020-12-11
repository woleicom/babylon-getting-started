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

    const ground = this.buildGround();
    const box = this.buildBox();
    const roof = this.buildRoof();
    
  }
  buildGround() {
    const  groundMat = new BABYLON.StandardMaterial('groundMat',this._scene);
    // 漫射
    groundMat.diffuseColor = new BABYLON.Color3(0,1,0);
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 10, height: 10}); 
    ground.material = groundMat;

    return ground;
  }
  buildBox() {
    const boxMat = new BABYLON.StandardMaterial('boxMat', this._scene);
    boxMat.diffuseTexture = new BABYLON.Texture('static/texture/cubehouse.png',this._scene);
    // boxMat.diffuseTexture = new BABYLON.Texture('static/texture/semihouse.png',this._scene);

    const faceUV = [];
    // faceUV 0:back,1:front,2:left,3:right,4:top,5:bottom;
    // 左下坐标-右上坐标 左下x，左下y，右上x，右上y 值为0-1之前的比值
    faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); // back face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); // front face
    faceUV[2] = new BABYLON.Vector4(0.25, 0.0, 0.5, 1.0); // right face
    faceUV[3] = new BABYLON.Vector4(0.75, 0.0, 1.0, 1.0); // left face

    // faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); // back face
    // faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); // front face
    // faceUV[2] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0); // right face
    // faceUV[3] = new BABYLON.Vector4(0.4, 0.0, 0.6, 1.0); // left face

    // wrap:boolean（BJS 大于等于 4.0），当所有垂直边（0、1、2、3），值为true时，将垂直应用图像纹理，而不产生旋转
    const box = BABYLON.MeshBuilder.CreateBox('box', {faceUV:faceUV, wrap: true});
    // const box = BABYLON.MeshBuilder.CreateBox('box', {width: 2, faceUV: faceUV, wrap: true});
    box.position.y = 0.5;
    box.material = boxMat;
    return box;
  }
  buildRoof() {
    const roofMat = new BABYLON.StandardMaterial('roofMat', this._scene);
    roofMat.diffuseTexture = new BABYLON.Texture('static/texture/roof.jpg',this._scene);
    
    const roof = BABYLON.MeshBuilder.CreateCylinder('roof', {diameter: 1.3, height: 1.2, tessellation: 3});
    // const roof = BABYLON.MeshBuilder.CreateCylinder('roof', {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    // roof.scaling.y = 2;
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