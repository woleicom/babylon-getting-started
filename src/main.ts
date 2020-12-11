import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";
// import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh,Color4 } from "babylonjs";

//Getting Started
//  Chapter1
import FirstSceneAndModel from './GettingStarted/Chapter1/firstSceneAndModel';
import FirstImportModel from './GettingStarted/Chapter1/firstImportModel';
//  Chapter2
import GroundingTheWorld from './GettingStarted/Chapter2/groundingTheWorld';
import AddingSound from './GettingStarted/Chapter2/addingSound';
import PlaceScaleMesh from './GettingStarted/Chapter2/placeScaleMesh';
import ABasicHouse from './GettingStarted/Chapter2/aBasicHouse';
import AddTexture from './GettingStarted/Chapter2/addTexture';
import MaterialHouseSide from './GettingStarted/Chapter2/materialHouseSide';
import CombiningMeshes from './GettingStarted/Chapter2/combiningMeshes';
import CopyingMeshes from './GettingStarted/Chapter2/copyingMeshes';
//  Chapter3
import MeshParents from './GettingStarted/Chapter3/meshParents';
import BuildingTheCar from './GettingStarted/Chapter3/buildingTheCar';
import CarMaterial from './GettingStarted/Chapter3/carMaterial';
import WheelAnimation from './GettingStarted/Chapter3/wheelAnimation';
import CarAnimation from './GettingStarted/Chapter3/carAnimation';
import CharacterAnimation from './GettingStarted/Chapter3/characterAnimation';
import AMoveToPath from './GettingStarted/Chapter3/aMoveToPath';
import AWalkVillage from './GettingStarted/Chapter3/aWalkVillage';
// Chapter4
import AvoidingCarCrash from './GettingStarted/Chapter4/avoidingCarCrash';
// Chapter5
import DistantHills from './GettingStarted/Chapter5/distantHills';
import DistantHillsAddThing from './GettingStarted/Chapter5/distantHillsAddThing';
import SkysAvbove from './GettingStarted/Chapter5/skysAvbove';
import SpriteTrees from './GettingStarted/Chapter5/spriteTrees';
// Chapter6
import LatheTurnedFountain from './GettingStarted/Chapter6/latheTurnedFountain';
import ParticleSpray from './GettingStarted/Chapter6/particleSpray';
import switchOnEvent from './GettingStarted/Chapter6/switchOnEvent';
// Chapter7
import StreetLights from './GettingStarted/Chapter7/streetLights';
import StreetLightsByVillage from './GettingStarted/Chapter7/streetLightsByVillage';
import DayToNight from './GettingStarted/Chapter7/dayToNight';
import AddingShadows from './GettingStarted/Chapter7/addingShadows';
import AddingShadowsByVillage from './GettingStarted/Chapter7/addingShadowsByVillage';
// Chapter8
import HaveLookAround from './GettingStarted/Chapter8/haveLookAround';
import FollowThatCharacter from './GettingStarted/Chapter8/followThatCharacter';
import goingVirtual from './GettingStarted/Chapter8/goingVirtual';


window.addEventListener("DOMContentLoaded", () => { 
  let game = new FirstSceneAndModel('renderCanvas');
  game.init();
});
