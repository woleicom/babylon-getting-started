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
      -Math.PI / 1.5, 
      Math.PI / 2.2, 
      15, 
      BABYLON.Vector3.Zero(), 
      this._scene
    );
    // camera.upperBetaLimit = Math.PI / 2.2;
    //相机依附 第二个参数：不阻止默认行为
    camera.attachControl(this._canvas, true);
    //创建灯光1
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(1, 1, 0), 
      this._scene
    );

    // const fountainProfile = [
    //   new BABYLON.Vector3(0, 0, 0),
    //   new BABYLON.Vector3(10, 0, 0), 
    //   new BABYLON.Vector3(10, 4, 0),
    //   new BABYLON.Vector3(8, 4, 0),
    //   new BABYLON.Vector3(8, 1, 0),
    //   new BABYLON.Vector3(1, 2, 0),
    //   new BABYLON.Vector3(1, 15, 0),
    //   new BABYLON.Vector3(3, 17, 0),
    //   // new BABYLON.Vector3(0, 17, 0), // 封口
    // ];
    const fountainProfile = [
      new BABYLON.Vector3(0, 0, 0),
		  new BABYLON.Vector3(0.5, 0, 0),
      new BABYLON.Vector3(0.5, 0.2, 0),
		  new BABYLON.Vector3(0.4, 0.2, 0),
      new BABYLON.Vector3(0.4, 0.05, 0),
      new BABYLON.Vector3(0.05, 0.1, 0),
		  new BABYLON.Vector3(0.05, 0.8, 0),
		  new BABYLON.Vector3(0.15, 0.9, 0)
    ];
    // 创建侧边线关键点，然后绕Y轴心旋转生成的类似车床旋转打磨的模型
    const fountain = BABYLON.MeshBuilder.CreateLathe('fountain', {
      shape: fountainProfile,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE
    });
    fountain.position.x = -4;
    fountain.position.z = -6;

    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, this._scene);
	  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("static/texture/skybox/skybox", this._scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	  skybox.material = skyboxMaterial;

    BABYLON.SceneLoader.ImportMeshAsync("", "static/babylon/", "valleyvillage.glb");

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