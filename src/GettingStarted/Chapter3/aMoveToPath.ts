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
      -Math.PI / 1.5, 
      Math.PI / 5, 
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
    
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 0.25});
    sphere.position = new BABYLON.Vector3(2,0,2);

    const points = [];
    points.push(new BABYLON.Vector3(2,0,2));
    points.push(new BABYLON.Vector3(2,0,-2));
    points.push(new BABYLON.Vector3(-2,0,-2));
    points.push(points[0]);

    BABYLON.MeshBuilder.CreateLines('triangle', {points: points});

    class slide {
      turn: number;
      dist: number;
      constructor(turn: number, dist: number) {
        this.turn = turn;
        this.dist = dist;
      }
    }
    const track: slide[] = [];
    track.push(new slide(Math.PI / 2, 4));
    track.push(new slide(3 * Math.PI / 4, 8));
    track.push(new slide(3 * Math.PI / 4, 8 + 4 * Math.sqrt(2)));

    let distance = 0;
    let step = 0.05;
    let p = 0;

    this._scene.onBeforeRenderObservable.add(() => {
      // movePOV 将网格沿视角方向移动，物体创建后是面朝向-z轴，参数分别为向右(+x)、向上(+y)、向前(-z)
		  sphere.movePOV(0, 0, step); 
      distance += step;
      if (distance > track[p].dist) {       
        // 根据自身坐标(Space.LOCAL)或世界坐标(Space.WORLD)绕axis轴旋转amount角度 
        sphere.rotate(BABYLON.Axis.Y, track[p].turn, BABYLON.Space.LOCAL);
        // 移动一圈后重置位置和旋转， 防止浮点错误
        p +=1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          sphere.position = new BABYLON.Vector3(2, 0, 2); //reset to initial conditions
          sphere.rotation = BABYLON.Vector3.Zero();//prevents error accumulation
        }
      }
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