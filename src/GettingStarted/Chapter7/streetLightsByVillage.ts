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
      -Math.PI / 2.2, 
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
    // 强度 [ɪnˈtensəti] 
    light.intensity = 0.1;
    
    BABYLON.SceneLoader.ImportMeshAsync("", "static/babylon/", "lamp.babylon").then(() =>{
      const lampLight = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), 0.8 * Math.PI, 0.01, this._scene);
      lampLight.diffuse = BABYLON.Color3.Yellow();
      lampLight.parent = this._scene.getMeshByName("bulb");

      const lamp = this._scene.getMeshByName("lamp")!;
      lamp.position = new BABYLON.Vector3(2, 0, 2); 
      lamp.rotation = BABYLON.Vector3.Zero();
      lamp.rotation.y = -Math.PI / 4;

      let lamp3 = lamp.clone("lamp3",this._scene.getNodeByName('__root__'))!;
      lamp3.position.z = -8;

      let lamp1 = lamp.clone("lamp1",this._scene.getNodeByName('__root__'))!;
      lamp1.position.x = -8;
      lamp1.position.z = 1.2;
      lamp1.rotation.y = Math.PI / 2;

      let lamp2 = lamp1.clone("lamp2",this._scene.getNodeByName('__root__'))!;
      lamp2.position.x = -2.7;
      lamp2.position.z = 0.8;
      lamp2.rotation.y = -Math.PI / 2;

    });

    //Skybox
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, this._scene);
	  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", this._scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    
    BABYLON.SceneLoader.ImportMeshAsync("", "static/babylon/", "valleyvillage.glb").then(() => {
      //CustomMaterial.maxSimultaneousLights 定义材料中可以使用的最大灯光数
      const ground = this._scene.getMeshByName("ground")!;
      const groundMat = <BABYLON.StandardMaterial> ground.material;
      groundMat.maxSimultaneousLights = 5;
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