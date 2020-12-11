import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import * as GUI from '@babylonjs/gui'
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
      -Math.PI / 4 * 3, 
      Math.PI / 3, 
      50, 
      BABYLON.Vector3.Zero(), 
      this._scene
    );
    // camera.upperBetaLimit = Math.PI / 2.2;
    //相机依附 第二个参数：不阻止默认行为
    camera.attachControl(this._canvas, true);
    //创建灯光1
    let light = new BABYLON.DirectionalLight(
      'dir01', 
      new BABYLON.Vector3(0, -1, 1), 
      this._scene
    );
    light.position = new BABYLON.Vector3(0, 15, -30);
    // 不可更新平面
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width:100, height:100,subdivisions:1, updatable:false}, this._scene);
    // 接收阴影
    ground.receiveShadows = true;
    
    // 创建阴影生成器
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

    BABYLON.SceneLoader.ImportMeshAsync('him', 'static/babylon/Dude/','Dude.babylon', this._scene).then(({meshes,skeletons})=>{
      let dude = meshes[0];
      dude.scaling = new BABYLON.Vector3(0.2,0.2,0.2);
      //includeDescendants 指示是否应该添加后代
      // mapSize: 存储阴影的纹理的大小
      shadowGenerator.addShadowCaster(dude, true);
      this._scene.beginAnimation(skeletons[0], 0, 100, true);
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