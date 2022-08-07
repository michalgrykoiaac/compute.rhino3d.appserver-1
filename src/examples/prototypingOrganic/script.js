import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.module.js";
      import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/controls/OrbitControls.js";
      import { Rhino3dmLoader } from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/loaders/3DMLoader.js";
      import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js";

import { TransformControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/TransformControls.js'
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/RGBELoader.js';

// set up loader for converting the results to threejs
const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' )

const definition = 'skyglazer final meshTESTINGv3.gh'
var panelTypeVal = 1;
var panelGroupTypeVal = 1;
var colourTypeVal = 1;


var hdrEquirect = new RGBELoader()
.setPath('textures/')
.load('chinese_garden_4k.hdr', function () {

  hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

} );

      // initialise 'data' object that will be used by compute()
      const data = {
        inputs: {
          mesh: [],
        },
      };



/**
 * Call appserver
 */
 async function compute () {
  const data = {
    definition: definition,
    inputs: {
     
  

     'RH_IN:showOriginalMesh': showOriginalMesh.checked,



     
     'RH_IN:showGridshellWireframe': showGridshellWireframe.checked,
     'RH_IN:showGridshell': showGridshell.checked,
     'RH_IN:gridAngle': gridAngle.valueAsNumber,
     'RH_IN:gridSize': gridSize.valueAsNumber,
     
    
      'RH_IN:uDivisions': uDivisions.valueAsNumber,
      'RH_IN:vDivisions': vDivisions.valueAsNumber,
      'RH_IN:panelType': parseInt(panelTypeVal),
      'RH_IN:panelGroupingType': parseInt(panelGroupTypeVal),
      'RH_IN:showGroupNumbers': showGroupNumbers.checked,
      'RH_IN:panelTypeNumber': panelTypeNumber.valueAsNumber,
      'RH_IN:showColour': showColour.checked,
      'RH_IN:colourType': parseInt(colourTypeVal),
    
    
        

    

   
    'RH_IN:showTerrain': showTerrain.checked, 
    'RH_IN:showPeople':showPeople.checked, 
    'RH_IN:showTrees': showTrees.checked, 
    'RH_IN:showWireframe': showWireframe.checked, 
    
     
    }
  }

  showSpinner(true)

  console.log(data.inputs)
  console.log(panelTypeVal)
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
    if (geom instanceof rhino.Brep || geom instanceof rhino.Mesh) {
      geometry.push(JSON.stringify(geom));
    }
  }

  // solve!
  data.inputs.mesh = geometry;
  compute();
}


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



/*1 Feeling lucky inputs

let luckyButton = document.getElementById('btn-1');
function colorValue(){
    return (Math.floor(Math.random() * 256));
}

function randomColor(event){
    let randomColor = 'rgb(' + colorValue() + ',' + colorValue() + ',' + colorValue() + ')';
    event.target.style.color =randomColor;
    console.log(randomColor);
}

luckyButton.addEventListener("click", randomColor);*/


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




//4 Panel Creation inputs


const quadPanels = document.getElementById('RH_IN:quadPanels');
quadPanels.addEventListener('click', radioClick);
const triPanels = document.getElementById('RH_IN:triPanels');
triPanels.addEventListener('click', radioClick);
const diamondPanels = document.getElementById('RH_IN:diamondPanels');
diamondPanels.addEventListener('click', radioClick);




const uDivisions = document.getElementById( 'RH_IN:uDivisions' )
var uDivisionsOutput = document.getElementById("uDivisionsvalue");
uDivisionsOutput.innerHTML = uDivisions.value;
uDivisions.oninput = function() { uDivisionsOutput.innerHTML = this.value;}

uDivisions.addEventListener( 'mouseup', onSliderChange, false )
uDivisions.addEventListener( 'touchend', onSliderChange, false )

const vDivisions = document.getElementById( 'RH_IN:vDivisions' )
var vDivisionsOutput = document.getElementById("vDivisionsvalue");
vDivisionsOutput.innerHTML = vDivisions.value;
vDivisions.oninput = function() { vDivisionsOutput.innerHTML = this.value;}

vDivisions.addEventListener( 'mouseup', onSliderChange, false )
vDivisions.addEventListener( 'touchend', onSliderChange, false )


//5 Panel Grouping inputs

const showGroupNumbers = document.getElementById( 'RH_IN:showGroupNumbers' )
showGroupNumbers.addEventListener( 'change', onSliderChange, false )

const curvature = document.getElementById( 'RH_IN:scattered' )
curvature.addEventListener( 'change', radioClick )
const Xaxis = document.getElementById( 'RH_IN:Xaxis' )
Xaxis.addEventListener( 'change', radioClick )
const scattered = document.getElementById( 'RH_IN:kmeans' )
scattered.addEventListener( 'change', radioClick )


const panelTypeNumber = document.getElementById( 'RH_IN:panelTypeNumber' )
var panelTypeNumberOutput = document.getElementById("panelTypeNumbervalue");
panelTypeNumberOutput.innerHTML = panelTypeNumber.value;
panelTypeNumber.oninput = function() { panelTypeNumberOutput.innerHTML = this.value;}

panelTypeNumber.addEventListener( 'mouseup', onSliderChange, false )
panelTypeNumber.addEventListener( 'touchend', onSliderChange, false )




//6 Panel Colouring inputs
const showColour = document.getElementById( 'RH_IN:showColour' )
showColour.addEventListener( 'change', onSliderChange, false )


const heat = document.getElementById( 'RH_IN:heat' )
heat.addEventListener( 'change', radioClick )
const rainbow = document.getElementById( 'RH_IN:rainbow' )
rainbow.addEventListener( 'change', radioClick )
const red = document.getElementById( 'RH_IN:red' )
red.addEventListener( 'change', radioClick)





//7 Layer Options inputs




const showTerrain = document.getElementById( 'RH_IN:showTerrain' )
showTerrain.addEventListener( 'change', onSliderChange, false )

const showPeople = document.getElementById( 'RH_IN:showPeople' )
showPeople.addEventListener( 'change', onSliderChange, false )

const showTrees = document.getElementById( 'RH_IN:showTrees' )
showTrees.addEventListener( 'change', onSliderChange, false )
    
const showWireframe = document.getElementById( 'RH_IN:showWireframe' )
showWireframe.addEventListener( 'change', onSliderChange, false )

document.getElementById("return").addEventListener("click", () => {
  window.location.href= '../index.html';

  });




function radioClick() {

 
  const panelTypeButtons = document.querySelectorAll('input[name="panelTypeRadio"]');
  for (const panelTypeButton of panelTypeButtons) {
    if (panelTypeButton.checked) {
      panelTypeVal = panelTypeButton.value;
      console.log(`panel type is ${panelTypeVal}`);
     
    }
    else{continue}
  }

  const panelGroupTypeButtons = document.querySelectorAll('input[name="panelTypeRadio2"]');
  for (const panelGroupTypeButton of panelGroupTypeButtons) {
    if (panelGroupTypeButton.checked) {
      panelGroupTypeVal = panelGroupTypeButton.value;
      console.log(`colour group is ${panelGroupTypeVal}`);
    }
    else{continue}
  }

  const colourTypeButtons = document.querySelectorAll('input[name="panelTypeRadio3"]');
  for (const colourTypeButton of colourTypeButtons) {
    if (colourTypeButton.checked) {
      colourTypeVal = colourTypeButton.value;
      console.log(`colour type is ${colourTypeVal}`);
    }
    else{continue}
  }


   // show spinner
   document.getElementById('loader').style.display = 'block'
 
    compute();
  }

let cameraRig, activeCamera, activeHelper;
let cameraPerspective, cameraOrtho;
let cameraPerspectiveHelper, cameraOrthoHelper;
let rhino, doc


rhino3dm().then(async m => {
    console.log('Loaded rhino3dm.')
    rhino = m // global
    
    init()
    
    compute()
  })

  

  const downloadButton = document.getElementById("downloadButton")
  downloadButton.onclick = download











/**
 * Parse response
 */
 function collectResults(responseJson) {

    const values = responseJson.values
  
    console.log(values)

    //GET VALUES
    let memberNumber = "????"
    let shortestMember = "????"
    let longestMember = "????"


    let skyArea = "????"
    let colourGradient = "????"
    let panelNumber = "????"
    let panelTypeNumber = "????"
    let panelType = "????"
    let groupingType = "????"
  
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
          
       

         // if (values[i].ParamName == "RH_OUT:color") {
           // meshes = branch[j].mesh
           // colourVal = meshes.material.clone(),
            
           // console.log(`the colour values are ${colourVal}`)
           
              //object.traverse(function(child) {
               // if (child.hasOwnProperty('name')){
                       // child.material=mainMat
                  //  }
                 // })
                

                





          //GET VALUES

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

            if (values[i].ParamName == "RH_OUT:panel_type") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
           panelType = branch[j].data
            console.log(panelType)
          }


           if (values[i].ParamName == "RH_OUT:colour_gradient") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
           colourGradient = branch[j].data
            console.log(colourGradient)
          }

           if (values[i].ParamName == "RH_OUT:panel_number") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
           panelNumber = Math.round(branch[j].data)
            console.log(panelNumber)
          }

           if (values[i].ParamName == "RH_OUT:panel_type_number") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
           panelTypeNumber = Math.round(branch[j].data)
            console.log(panelTypeNumber)
          }

          if (values[i].ParamName == "RH_OUT:grouping_type") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
           groupingType = branch[j].data
            console.log(groupingType)
          }

          
          //console.log(values[i].ParamName)

          if (rhinoObject !== null) {
            doc.objects().add(rhinoObject, null)
          }
        }
      }
    }
     //GET VALUES
     document.getElementById('memberNumbervalue').innerText =  memberNumber 
     document.getElementById('shortestMembervalue').innerText =  shortestMember + " m"
     document.getElementById('longestMembervalue').innerText =  longestMember + " m"


     document.getElementById('skyVisibilityAreavalue').innerText =  skyArea + " m2"
     document.getElementById('panelTypevalue').innerText =  panelType.slice(1, -1); 
     document.getElementById('colorGradientvalue').innerText =   colourGradient.slice(1, -1);
     document.getElementById('panelNumbervalue').innerText =   panelNumber
     document.getElementById('panelTypesNumbervalue').innerText =  panelTypeNumber
     document.getElementById('groupTypevalue').innerText =  groupingType.slice(1, -1);
     
  

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
        downloadButton.disabled = false
  
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
  
//add camera tween buttons




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














  // BOILERPLATE //
  
  var scene, camera, renderer, controls, container
  
  function init () {



    

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

  
  var animate = function () {
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
    TWEEN.update()
  }

  
    
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
    animate()
  }
  
  /**
   * This function is called when the download button is clicked
   */
   function download () {
    // write rhino doc to "blob"
    const bytes = doc.toByteArray()
    const blob = new Blob([bytes], {type: "application/octect-stream"})

    // use "hidden link" trick to get the browser to download the blob
    const filename = definition.replace(/\.gh$/, '') + '.3dm'
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
}
  
  /**
   * Helper function that behaves like rhino's "zoom to selection", but for three.js!
   */
   function zoomCameraToSelection( camera, controls, selection, fitOffset = 1.2 ) {
    
    const box = new THREE.Box3();
    
    for( const object of selection ) {
      if (object.isLight) continue
      box.expandByObject( object );
    }
    
    const size = box.getSize( new THREE.Vector3() );
    const center = box.getCenter( new THREE.Vector3() );
    
    const maxSize = Math.max( size.x, size.y, size.z );
    const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );
    
    const direction = controls.target.clone()
      .sub( camera.position )
      .normalize()
      .multiplyScalar( distance );
    controls.maxDistance = distance * 10;
    controls.target.copy( center );
    
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    camera.position.copy( controls.target ).sub(direction);
    
    controls.update();
    
  }