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
      new BABYLON.Vector3(1, 1, 0), 
      this._scene
    );

    const wireMat = new BABYLON.StandardMaterial('wireMat', this._scene);
    wireMat.wireframe = true;
    // 隐藏线框碰撞盒
    wireMat.alpha = 0;

    const hitBox = BABYLON.MeshBuilder.CreateBox('carbox', {width:0.5,height:0.6,depth:4.5});
    hitBox.material = wireMat;
    hitBox.position.x = 3.1;
    hitBox.position.y = 0.3;
    hitBox.position.z = -5;

    let carReady = false;

    BABYLON.SceneLoader.ImportMeshAsync('', 'static/babylon/car.glb').then(()=>{
      const car = this._scene.getMeshByName('car')!;
      carReady = true;
      car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
      car.position.y = 0.16;
      car.position.x = -3;
      car.position.z = 8;

      const animCar = new BABYLON.Animation('carAnimation', 'position.z', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

      const carKeys = []; 

        carKeys.push({
            frame: 0,
            value: 8
        });


        carKeys.push({
            frame: 150,
            value: -7
        });

        carKeys.push({
            frame: 200,
            value: -7
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
        this._scene.beginAnimation(wheelLF, 0, 30, true);
    });


    BABYLON.SceneLoader.ImportMeshAsync("", "static/babylon/", "village.glb");

    class walk {
      turn: number;
      dist: number;
      constructor(turn: number, dist: number) {
        this.turn = turn;
        this.dist = dist;
      }
    }
    const track:walk[] = [];
    track.push(new walk(180, 2.5));
    track.push(new walk(180, 5));

    BABYLON.SceneLoader.ImportMeshAsync('', 'static/babylon/Dude/', 'Dude.babylon', this._scene).then((result)=>{
      let dude = result.meshes[0];
      dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);
      dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
      //由于从.babylon文件导入的字符dude已使用rotationQuaternion而不是rotate进行了旋转设置，因此我们使用rotate方法重置字符方向。
      dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-90), BABYLON.Space.LOCAL);

      this._scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

      let distance = 0;
      let step = 0.015;
      let p = 0;

      this._scene.onBeforeRenderObservable.add(() => {
        if (carReady) {
          // Mesh.intersectMesh 判断两个网格是否相交，相交返回true
          if (!dude.getChildMeshes()[1].intersectsMesh(hitBox) && this._scene.getMeshByName('car')!.intersectsMesh(hitBox)) {
            return void 0;
          }
        }
        dude.movePOV(0, 0, step);
        distance += step;
        if (distance > track[p].dist) {
          dude.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(track[p].turn), BABYLON.Space.LOCAL);
          p +=1;
          p %= track.length;
          if (p === 0) {
              distance = 0;
              dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
          }
        }
      })


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