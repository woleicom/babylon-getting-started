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
    let camera = new BABYLON.FollowCamera(
      'Camera', 
      new BABYLON.Vector3(-6, 0, 0), 
      this._scene
    );
    // 跟踪相机应该跟踪目标的距离半径
    camera.radius = 1;
    // 定义相机与它跟随的对象之间的高度偏移。它可以帮助你从顶部跟踪一个物体(就像一辆汽车追着一架飞机一样)
    camera.heightOffset = 8;
    // 定义相机和它跟随的对象之间的旋转偏移
    camera.rotationOffset = 0;
    //定义相机加速跟随目标的速度
    camera.cameraAcceleration = 0.005
    //定义相机跟踪一个对象的最大速度限制
    camera.maxCameraSpeed = 10
    camera.attachControl(true);
    //创建灯光1
    let light = new BABYLON.HemisphericLight(
      'light', 
      new BABYLON.Vector3(1, 1, 0), 
      this._scene
    );

    class walk {
      turn: number;
      dist: number;
      constructor(turn: number, dist: number) {
        this.turn = turn;
        this.dist = dist;
      }
    }
    const track:walk[] = [];
    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47))

    BABYLON.SceneLoader.ImportMeshAsync('him', 'static/babylon/Dude/','Dude.babylon', this._scene).then((result)=>{
      const dude = result.meshes[0];
      dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);
      dude.position = new BABYLON.Vector3(-6, 0, 0);
      dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-95), BABYLON.Space.LOCAL);
      // 设置跟随相机的跟随目标
      camera.lockedTarget = dude;
      this._scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
      let distance = 0;
      let step = 0.01;
      let p = 0;
      this._scene.onBeforeRenderObservable.add(() => {
      dude.movePOV(0, 0, step);
        distance += step;
        if (distance > track[p].dist) {
          dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
          p +=1;
          p %= track.length; 
          if (p === 0) {
              distance = 0;
              dude.position = new BABYLON.Vector3(-6, 0, 0);
          }
        }
      })
    });

    const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "static/texture/palm.png", 2000, {width: 512, height: 1024},this._scene);

    //We create trees at random positions
    for (let i = 0; i < 500; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-30);
        tree.position.z = Math.random() * 20 + 8;
        tree.position.y = 0.5;
    }

    for (let i = 0; i < 500; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (25) + 7;
        tree.position.z = Math.random() * -35  + 8;
        tree.position.y = 0.5;
    } 

    //Skybox
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