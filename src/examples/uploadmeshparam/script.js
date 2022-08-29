import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js";
import { Rhino3dmLoader } from "https://unpkg.com/three@0.137.5/examples/jsm/loaders/3DMLoader.js";
import { TransformControls } from "https://unpkg.com/three@0.137.5/examples/jsm/controls/TransformControls.js";
import { RGBELoader } from "https://unpkg.com/three@0.137.5/examples/jsm/loaders/RGBELoader.js";
import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@7.11.1/rhino3dm.module.js";
import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";

// set up loader for converting the results to threejs
const loader = new Rhino3dmLoader();
loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@7.14.0/");

//3 Mesh inputs


const showOriginalMesh = document.getElementById( 'RH_IN:showOriginalMesh' )
showOriginalMesh.addEventListener( 'change', onSliderChange, false )


//3 Arc Creation inputs


const showGridshellWireframe = document.getElementById( 'RH_IN:showGridshellWireframe' )
showGridshellWireframe.addEventListener( 'change', onSliderChange, false )

const showGridshell = document.getElementById( 'RH_IN:showGridshell' )
showGridshell.addEventListener( 'change', onSliderChange, false )



const gridAngle = document.getElementById( 'RH_IN:gridAngle' )
var gridAngleOutput = document.getElementById("gridAnglevalue");
gridAngleOutput.innerHTML = gridAngle.value + "m";
gridAngle.oninput = function() { gridAngleOutput.innerHTML = this.value;}

gridAngle.addEventListener( 'mouseup', onSliderChange, false )
gridAngle.addEventListener( 'touchend', onSliderChange, false )

const gridSize = document.getElementById( 'RH_IN:gridSize' )
var gridSizeOutput = document.getElementById("gridSizevalue");
gridSizeOutput.innerHTML = gridSize.value + "m";
gridSize.oninput = function() { gridSizeOutput.innerHTML = this.value;}

gridSize.addEventListener( 'mouseup', onSliderChange, false )
gridSize.addEventListener( 'touchend', onSliderChange, false )

const showTerrain = document.getElementById( 'RH_IN:showTerrain' )
showTerrain.addEventListener( 'change', onSliderChange, false )

const showPeople = document.getElementById( 'RH_IN:showPeople' )
showPeople.addEventListener( 'change', onSliderChange, false )

const showTrees = document.getElementById( 'RH_IN:showTrees' )
showTrees.addEventListener( 'change', onSliderChange, false )


// initialise 'data' object that will be used by compute()
let data = {};
data.definition = "PrototypingOrganic_meshupload.gh";
data.inputs = {
  'RH_IN:showOriginalMesh': showOriginalMesh.checked,



     
  'RH_IN:showGridshellWireframe': showGridshellWireframe.checked,
  'RH_IN:showGridshell': showGridshell.checked,
  'RH_IN:gridAngle': gridAngle.valueAsNumber,
  'RH_IN:gridSize': gridSize.valueAsNumber,


  'RH_IN:showTerrain': showTerrain.checked, 
  'RH_IN:showPeople':showPeople.checked, 
  'RH_IN:showTrees': showTrees.checked, 

  meshes: [],


};






// globals
let rhino, definition, doc;

rhino3dm().then(async (m) => {
  rhino = m;

  init();
  //compute();
});

const downloadButton = document.getElementById("downloadButton");
downloadButton.onclick = download;

/////////////////////////////////////////////////////////////////////////////
//                            HELPER  FUNCTIONS                            //
/////////////////////////////////////////////////////////////////////////////
async function readSingleFile(e) {
  // get file
  var file = e.target.files[0];
  if (!file) {
    document.getElementById("msg").innerText = "Something went wrong...";
    return;
  }

  // try to open 3dm file
  const buffer = await file.arrayBuffer();
  const uploadDoc = rhino.File3dm.fromByteArray(new Uint8Array(buffer));

  if (uploadDoc === null) {
    document.getElementById("msg").innerText = "Must be a .3dm file!";
    return;
  }

  // get geometry from file
  const objs = uploadDoc.objects();
  const geometry = [];
  for (let i = 0; i < objs.count; i++) {
    const geom = objs.get(i).geometry();
    // filter for geometry of a specific type
    geometry.push(JSON.stringify(geom));
  }

  // solve!
  data.inputs.meshes = geometry;
  compute();
}

// register event listener for file input
document
  .getElementById("file-input")
  .addEventListener("change", readSingleFile, false);

// more globals
let scene, camera, renderer,container, controls;

/**
 * Sets up the scene, camera, renderer, lights and controls and starts the animation
 */
function init() {
  // Rhino models are z-up, so set this as the default
  
    

  container = document.querySelector(".scene");
    // Rhino models are z-up, so set this as the default
    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );
    const aspect = container.clientWidth/ container.clientHeight;

    scene = new THREE.Scene()
    //scene.background = new THREE.Color(0xdaedfa)
    //scene.fog = new THREE.Fog( 0xffffff, 40, 100 )
    camera = new THREE.PerspectiveCamera( 75, aspect, 1, 1000 )
    camera.lookAt(0,0,0);
    camera.position.set(0,0,70)
    
    

      // create the renderer and add it to the html
     // const canvas = document.querySelector('#c');
     //  renderer = new THREE.WebGLRenderer({canvas, alpha: true});
    renderer = new THREE.WebGLRenderer({antialias: true, alpha:true})
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( container.clientWidth, container.clientHeight )
    container.appendChild(renderer.domElement)


    //scene.background = hdrEquirect;


   // add some controls to orbit the camera
    controls = new OrbitControls( camera, renderer.domElement  )
    controls.target.set(0, 0, 0);
    controls.update();
  
    // add a directional light
    scene.add( new THREE.AmbientLight( 0xf1e3c9, 3 ) )
      //const light = new THREE.DirectionalLight( 0xf1e3c9, 3 )
    
     // scene.add( light );
  
  // handle changes in the window size
  //  window.addEventListener( 'resize', onWindowResize, false )
  
    animate()
  }

/**
 * Call appserver
 */
async function compute() {
  showSpinner(true);

  // // construct url for GET /solve/definition.gh?name=value(&...)
  // const url = new URL("/solve/" + data.definition, window.location.origin);
  // Object.keys(data.inputs).forEach((key) =>
  //   url.searchParams.append(key, data.inputs[key])
  // );
  // console.log(url.toString());

  // try {
  //   const response = await fetch(url);
  // use POST request
  const request = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch("/solve", request);

    if (!response.ok) {
      // TODO: check for errors in response json
      throw new Error(response.statusText);
    }

    const responseJson = await response.json();

    collectResults(responseJson);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Parse response
 */
function collectResults(responseJson) {
  const values = responseJson.values;


//GET VALUES
let memberNumber = "????"
let shortestMember = "????"
let longestMember = "????"
let skyArea = "????"

  // clear doc
  if (doc !== undefined) doc.delete();

  //console.log(values)
  doc = new rhino.File3dm();

  // for each output (RH_OUT:*)...
  for (let i = 0; i < values.length; i++) {
    // ...iterate through data tree structure...
    for (const path in values[i].InnerTree) {
      const branch = values[i].InnerTree[path];
      // ...and for each branch...
      for (let j = 0; j < branch.length; j++) {
        // ...load rhino geometry into doc
        const rhinoObject = decodeItem(branch[j]);


        if (values[i].ParamName == "RH_OUT:member_number") {
          //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
          memberNumber = Math.round(branch[j].data)
          console.log(`memberNumber is ${memberNumber}`)
        }

        if (values[i].ParamName == "RH_OUT:shortest_member") {
          //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
          shortestMember = Math.round(branch[j].data)
          console.log(`shortestMember is ${shortestMember}`)
        }

        if (values[i].ParamName == "RH_OUT:longest_member") {
          //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
          longestMember = Math.round(branch[j].data)
          console.log(`longestMember is ${longestMember}`)
        }



        if (values[i].ParamName == "RH_OUT:sky_visibility_area") {
          //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
          skyArea = Math.round(branch[j].data)
          console.log(`sky area is ${skyArea}`)
        }





        if (rhinoObject !== null) {
          doc.objects().add(rhinoObject, null);
        }
      }
    }
  }


  //GET VALUES
  document.getElementById('memberNumbervalue').innerText =  memberNumber 
  document.getElementById('shortestMembervalue').innerText =  shortestMember + " m"
  document.getElementById('longestMembervalue').innerText =  longestMember + " m"

  document.getElementById('skyVisibilityAreavalue').innerText =  skyArea + " m2"

  if (doc.objects().count < 1) {
    console.error("No rhino objects to load!");
    showSpinner(false);
    return;
  }

  // hack (https://github.com/mcneel/rhino3dm/issues/353)
  const sphereAttrs = new rhino.ObjectAttributes();
  sphereAttrs.mode = rhino.ObjectMode.Hidden;
  doc.objects().addSphere(new rhino.Sphere([0, 0, 0], 0.001), sphereAttrs);

  // load rhino doc into three.js scene
  const buffer = new Uint8Array(doc.toByteArray()).buffer;
  loader.parse(buffer, function (object) {
    // debug

    object.traverse((child) => {
      if (child.isMesh)
        child.material = new THREE.MeshNormalMaterial({
          wireframe: true,
        });
    }, false);

    // clear objects from scene. do this here to avoid blink
    scene.traverse((child) => {
      if (!child.isLight) {
        scene.remove(child);
      }
    });

    // add object graph from rhino model to three.js scene
    scene.add(object);

    // hide spinner and enable download button
    showSpinner(false);
    downloadButton.disabled = false;

    // zoom to extents
    zoomCameraToSelection(camera, controls, scene.children);
  });
}

/**
 * Attempt to decode data tree item to rhino geometry
 */
function decodeItem(item) {
  const data = JSON.parse(item.data);
  if (item.type === "System.String") {
    // hack for draco meshes
    try {
      return rhino.DracoCompression.decompressBase64String(data);
    } catch {} // ignore errors (maybe the string was just a string...)
  } else if (typeof data === "object") {
    return rhino.CommonObject.decode(data);
  }
  return null;
}

/**
 * Called when a slider value changes in the UI. Collect all of the
 * slider values and call compute to solve for a new scene
 */
function onSliderChange() {
  showSpinner(true);
  // get slider values
  let inputs = {};
  for (const input of document.getElementsByTagName("input")) {
    switch (input.type) {
      case "number":
        inputs[input.id] = input.valueAsNumber;
        break;
      case "range":
        inputs[input.id] = input.valueAsNumber;
        break;
      case "checkbox":
        inputs[input.id] = input.checked;
        break;
    }
  }

  data.inputs = inputs;

  compute();
}

/**
 * The animation loop!
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

/**
 * Helper function for window resizes (resets the camera pov and renderer size)
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  animate();
}

/**
 * Helper function that behaves like rhino's "zoom to selection", but for three.js!
 */
function zoomCameraToSelection(camera, controls, selection, fitOffset = 1.2) {
  const box = new THREE.Box3();

  for (const object of selection) {
    if (object.isLight) continue;
    box.expandByObject(object);
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance =
    maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

  const direction = controls.target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance);
  controls.maxDistance = distance * 10;
  controls.target.copy(center);

  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
  camera.position.copy(controls.target).sub(direction);

  controls.update();
}

/**
 * This function is called when the download button is clicked
 */
function download() {
  // write rhino doc to "blob"
  const bytes = doc.toByteArray();
  const blob = new Blob([bytes], { type: "application/octect-stream" });

  // use "hidden link" trick to get the browser to download the blob
  const filename = data.definition.replace(/\.gh$/, "") + ".3dm";
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

/**
 * Shows or hides the loading spinner
 */
function showSpinner(enable) {
  if (enable) document.getElementById("loader").style.display = "block";
  else document.getElementById("loader").style.display = "none";
}


document.getElementById("btn-perspective").addEventListener("click", () => {
  // backup original rotation
  var startRotation = camera.quaternion.clone();
  // final rotation (with lookAt)
  
  camera.position.set(30,-5,2);
  camera.lookAt( -1,0,15 );
  var endRotation = camera.quaternion.clone();
  // revert to original rotation
  camera.quaternion.copy( startRotation );
  // Tween
  var lookAtTween = new TWEEN.Tween( camera.quaternion ).to( endRotation, 1000 )
  .easing(TWEEN.Easing.Quadratic.Out)
  .start();
  

});







document.getElementById("btn-plan").addEventListener("click", () => {
// backup original rotation
var startRotation = camera.quaternion.clone();
// final rotation (with lookAt)

camera.position.set(0,10,80);
camera.lookAt( 0,0,0 );
var endRotation = camera.quaternion.clone();
// revert to original rotation
camera.quaternion.copy( startRotation );
// Tween
var lookAtTween = new TWEEN.Tween( camera.quaternion ).to( endRotation, 1000 )
.easing(TWEEN.Easing.Quadratic.Out)
.start();

});


      // register event listener for file input
      document
        .getElementById("file-input")
        .addEventListener("change", readSingleFile, false);








// remove hide when dropdown layer button clicked
const dropdownBtn = document.querySelector(".dropdown_button");
const dropdownMenu = document.querySelector(".dropdown_menu");

dropdownBtn.addEventListener("click",() =>{
dropdownMenu.classList.toggle("hide");
});

document.getElementById("return").addEventListener("click", () => {
  window.location.href= '../index.html';

  });
