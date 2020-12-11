import * as BABYLON from "@babylonjs/core/Legacy/legacy";
export const showAxis = (size: number, scene: BABYLON.Scene):void => {
  const makeTextPlane = (text:string, color:string, size:number) => {
    const dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    const plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    const material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    material.backFaceCulling = false;
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    material.diffuseTexture = dynamicTexture;
    plane.material = material;
    return plane;
  };

  const axisX = BABYLON.Mesh.CreateLines("axisX", [ 
    BABYLON.Vector3.Zero(),
    new BABYLON.Vector3(size, 0, 0),
    new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    new BABYLON.Vector3(size, 0, 0),
    new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
  ]);
  axisX.color = new BABYLON.Color3(1, 0, 0);
  const xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

  const axisY = BABYLON.Mesh.CreateLines("axisY", [
    BABYLON.Vector3.Zero(),
    new BABYLON.Vector3(0, size, 0),
    new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
    new BABYLON.Vector3(0, size, 0),
    new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
  ]);
  axisY.color = new BABYLON.Color3(0, 1, 0);
  const yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
  
  const axisZ = BABYLON.Mesh.CreateLines("axisZ", [
    BABYLON.Vector3.Zero(),
    new BABYLON.Vector3(0, 0, size),
    new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
    new BABYLON.Vector3(0, 0, size),
    new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
  ]); 
  axisZ.color = new BABYLON.Color3(0, 0, 1);
  const zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
}
export const localAxis = (size: number, scene: BABYLON.Scene):BABYLON.TransformNode=>{
  const local_axisX = BABYLON.Mesh.CreateLines("local_axisX", [
    BABYLON.Vector3.Zero(), 
    new BABYLON.Vector3(size, 0, 0), 
    new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
    new BABYLON.Vector3(size, 0, 0), 
    new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
  ], scene);
  local_axisX.color = new BABYLON.Color3(1, 0, 0);

  const local_axisY = BABYLON.Mesh.CreateLines("local_axisY", [
    BABYLON.Vector3.Zero(), 
    new BABYLON.Vector3(0, size, 0), 
    new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
    new BABYLON.Vector3(0, size, 0), 
    new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
  ], scene);
  local_axisY.color = new BABYLON.Color3(0, 1, 0);

  const local_axisZ = BABYLON.Mesh.CreateLines("local_axisZ", [
    BABYLON.Vector3.Zero(), 
    new BABYLON.Vector3(0, 0, size), 
    new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
    new BABYLON.Vector3(0, 0, size), 
    new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
  ], scene);
  local_axisZ.color = new BABYLON.Color3(0, 0, 1);

  const local_origin = new BABYLON.TransformNode("local_origin");

  local_axisX.parent = local_origin;
  local_axisY.parent = local_origin;
  local_axisZ.parent = local_origin;

  return local_origin;
}