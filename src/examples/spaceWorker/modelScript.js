
// Import libraries
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js";
import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@7.11.1/rhino3dm.module.js";
import { RhinoCompute } from "https://cdn.jsdelivr.net/npm/compute-rhino3d@0.13.0-beta/compute.rhino3d.module.js";
import { Rhino3dmLoader } from "https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js";
 

//Define grasshopper script
const definition = "workstationFinal.gh";


var growVal = 1;

      /* Shows or hides the loading spinner
    */
 
   
// Set up texts
const level1 = document.getElementById('level1');
level1.addEventListener('click', radioClick,);
const level2 = document.getElementById('level2');
level2.addEventListener('click', radioClick);
const level3 = document.getElementById('level3');
level3.addEventListener('click', radioClick);
const level4 = document.getElementById('level4');
level4.addEventListener('click', radioClick);
//const level5 = document.getElementById('level5');
//level5.addEventListener('click', radioClick);

const loader = new Rhino3dmLoader();
loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/");


function radioClick(){

  const growButtons = document.querySelectorAll('input[name="growLevel"]');
    for (const growButton of growButtons){
        if (growButton.checked){
          growVal = growButton.value;
          console.log(growVal)
        }
      
    }
    
  // show spinner
  document.getElementById('loader').style.display = 'block'
  compute()
}


let rhino, doc



rhino3dm().then(async m => {
    console.log('Loaded rhino3dm.')
    rhino = m // global
    
    init()
    
    compute()
  })

  



/**
 * Call appserver
 */
 async function compute () {
    const data = {
      definition: definition,
      inputs: {
       
    
       'RH_IN:level': parseInt(growVal),

      }
    }
  
    showSpinner(true)
  
    console.log(data.inputs)
    console.log(growVal)

    const request = {
      'method':'POST',
      'body': JSON.stringify(data),
      'headers': {'Content-Type': 'application/json'}
    }
  
    try {
      const response = await fetch('/solve', request)
  
      if(!response.ok)
        throw new Error(response.statusText)
  
      const responseJson = await response.json()
      collectResults(responseJson)
  
    } catch(error){
      console.error(error)
    }
  }
  


  function collectResults(responseJson) {

    const values = responseJson.values
  
    console.log(values)

    //GET VALUES

  
  //let colourVal = 111





    // clear doc
    try {
      if( doc !== undefined)
          doc.delete()
    } catch {}
  
    //console.log(values)
    doc = new rhino.File3dm()
  
    // for each output (RH_OUT:*)...
    for ( let i = 0; i < values.length; i ++ ) {
      // ...iterate through data tree structure...
      for (const path in values[i].InnerTree) {
        const branch = values[i].InnerTree[path]
        // ...and for each branch...
        for( let j = 0; j < branch.length; j ++) {
          // ...load rhino geometry into doc
          const rhinoObject = decodeItem(branch[j])
          


          if (rhinoObject !== null) {
            doc.objects().add(rhinoObject, null)
          }
        }
      }
    }
     //GET VALUES
  
     
  

    if (doc.objects().count < 1) {
      console.error('No rhino objects to load!')
      showSpinner(false)
      return
    }
  
    // load rhino doc into three.js scene
    const buffer = new Uint8Array(doc.toByteArray()).buffer
    loader.parse( buffer, function ( object ) 
    {
  
        // clear objects from scene
        scene.traverse(child => {
          if ( child.userData.hasOwnProperty( 'objectType' ) && child.userData.objectType === 'File3dm') {
            scene.remove( child )
          }
        })
  
       
        ///////////////////////////////////////////////////////////////////////
       
        // color crvs
        object.traverse((child) => {
          if (child.isMesh) {
    
            if (child.userData.attributes.geometry.userStringCount > 0) {
              
              //get color from userStrings
              const col = child.userData.attributes.geometry.userStrings[0][1];
              
            // const colorData = child.userData.attributes.userStrings[0]
            //  const col = colorData[1];

              //convert color from userstring to THREE color and assign it
              const threeColor = new THREE.Color("rgb(" + col + ")");
              console.log(threeColor);
              //const mat = new THREE.MeshPhysicalMaterial({ color: threeColor });
              
            
                let panelMaterial = new THREE.MeshPhysicalMaterial( {color: threeColor,envMap: hdrEquirect,  clearcoat: 1.0,
                  clearcoatRoughness:0.1,
                  metalness: 0.5,
                  roughness:0.5,  ior: 2.5,  transparent: true, opacity: 0.6,  });
                child.material = panelMaterial;
              
              
              
              //console.log(child);
            }
          }
        })


  

        
        ///////////////////////////////////////////////////////////////////////
        // add object graph from rhino model to three.js scene
        scene.add( object )
  
        // hide spinner and enable download button
        showSpinner(false)
        
  
    })
  }
  
  /**
  * Attempt to decode data tree item to rhino geometry
  */
  function decodeItem(item) {
  const data = JSON.parse(item.data)
  if (item.type === 'System.String') {
    // hack for draco meshes
    try {
        return rhino.DracoCompression.decompressBase64String(data)
    } catch {} // ignore errors (maybe the string was just a string...)
  } else if (typeof data === 'object') {
    return rhino.CommonObject.decode(data)
  }
  return null
  }
  
  /**
   * Called when a slider value changes in the UI. Collect all of the
   * slider values and call compute to solve for a new scene
   */
   function onSliderChange () {
    showSpinner(true)
    // get slider values
    /*let inputs = {}
    for (const input of document.getElementsByTagName('input')) {
      switch (input.type) {
      case 'number':
        inputs[input.id] = input.valueAsNumber
        break
      case 'range':
        inputs[input.id] = input.valueAsNumber
        break
      case 'checkbox':
        inputs[input.id] = input.checked
        break
      }
    }
    
    data.inputs = inputs*/
  
    compute()
  }
  
  
  /**
   * Shows or hides the loading spinner
   */
   function showSpinner(enable) {
    if (enable)
      document.getElementById('loader').style.display = 'block'
    else
      document.getElementById('loader').style.display = 'none'
  }






// THREE BOILERPLATE //
let scene, camera, renderer, controls;

function init() {

  THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 )
  scene = new THREE.Scene()
  //scene.background = new THREE.Color(15,15,15)
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 )
  camera.position.set (0,0,10);
 //scene.background = new THREE.Color(0xdaedfa)
 scene.background = new THREE.Color(0x000000)

 
 // create the renderer and add it to the html
 renderer = new THREE.WebGLRenderer({ antialias: true });
 renderer.setSize(window.innerWidth, window.innerHeight);
 document.body.appendChild(renderer.domElement);

 // add some controls to orbit the camera
 controls = new OrbitControls(camera, renderer.domElement);

 // add a directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff);
 //directionalLight.intensity = 5;
 //scene.add(directionalLight);

 const ambientLight = new THREE.AmbientLight();
 ambientLight.intensity = 5;
 scene.add(ambientLight);



 animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// download button handler
function download () {
  let buffer = doc.toByteArray()
  let blob = new Blob([ buffer ], { type: "application/octect-stream" })
  let link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = 'AnalyzedTerrain.3dm'
  link.click()
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  animate();
}

function meshToThreejs(mesh, material) {
  const loader = new THREE.BufferGeometryLoader();
  const geometry = loader.parse(mesh.toThreejsJSON());
  return new THREE.Mesh(geometry, material);
}


document.getElementById("return").addEventListener("click", () => {
  window.location.href= 'main.html';

  });
