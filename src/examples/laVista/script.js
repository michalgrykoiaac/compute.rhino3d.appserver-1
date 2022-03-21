
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js";
import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@7.11.1/rhino3dm.module.js";
import { Rhino3dmLoader } from "https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js";

// set up loader for converting the results to threejs
const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' )

// initialise 'data' object that will be used by compute()
const definition= 'street_node_v4.gh'
  


// globals
let rhino, doc

rhino3dm().then(async m => {
    rhino = m

    init()
    compute()
})

const downloadButton = document.getElementById("downloadButton")
downloadButton.onclick = download



//3  site inputs
const siteLength = document.getElementById( 'RH_IN:siteLength' )
var siteLengthOutput = document.getElementById("siteLengthValue");
siteLengthOutput.innerHTML = siteLength.value + "m";
siteLength.oninput = function() { siteLengthOutput.innerHTML = this.value;}

siteLength.addEventListener( 'mouseup', onSliderChange, false )
siteLength.addEventListener( 'touchend', onSliderChange, false )

const siteWidth = document.getElementById( 'RH_IN:siteWidth' )
var siteWidthOutput = document.getElementById("siteWidthValue");
siteWidthOutput.innerHTML = siteWidth.value + "m";
siteWidth.oninput = function() { siteWidthOutput.innerHTML = this.value;}

siteWidth.addEventListener( 'mouseup', onSliderChange, false )
siteWidth.addEventListener( 'touchend', onSliderChange, false )



//3  Creation inputs
const streetPosition = document.getElementById( 'RH_IN:streetPosition' )
var streetPositionOutput = document.getElementById("streetPositionValue");
streetPositionOutput.innerHTML = streetPosition.value + "m";
streetPosition.oninput = function() { streetPositionOutput.innerHTML = this.value;}

streetPosition.addEventListener( 'mouseup', onSliderChange, false )
streetPosition.addEventListener( 'touchend', onSliderChange, false )


const streetAngle = document.getElementById( 'RH_IN:streetAngle' )
var streetAngleOutput = document.getElementById("streetAngleValue");
streetAngleOutput.innerHTML = streetAngle.value + "degrees";
streetAngle.oninput = function() { streetAngleOutput.innerHTML = this.value;}

streetAngle.addEventListener( 'mouseup', onSliderChange, false )
streetAngle.addEventListener( 'touchend', onSliderChange, false )

const streetWidth = document.getElementById( 'RH_IN:streetWidth' )
var streetWidthOutput = document.getElementById("streetWidthValue");
streetWidthOutput.innerHTML = streetWidth.value + "m";
streetWidth.oninput = function() { streetWidthOutput.innerHTML = this.value;}

streetWidth.addEventListener( 'mouseup', onSliderChange, false )
streetWidth.addEventListener( 'touchend', onSliderChange, false )







const buildingDepth = document.getElementById( 'RH_IN:buildingDepth' )
var buildingDepthOutput = document.getElementById("buildingDepthValue");
buildingDepthOutput.innerHTML = buildingDepth.value + "m";
buildingDepth.oninput = function() { buildingDepthOutput.innerHTML = this.value;}

buildingDepth.addEventListener( 'mouseup', onSliderChange, false )
buildingDepth.addEventListener( 'touchend', onSliderChange, false )


const buildingGapWidth = document.getElementById( 'RH_IN:buildingGapWidth' )
var buildingGapWidthOutput = document.getElementById("buildingGapWidthValue");
buildingGapWidthOutput.innerHTML = buildingGapWidth.value + "m";
buildingGapWidth.oninput = function() { buildingGapWidthOutput.innerHTML = this.value;}

buildingGapWidth.addEventListener( 'mouseup', onSliderChange, false )
buildingGapWidth.addEventListener( 'touchend', onSliderChange, false )







const podiumHeight = document.getElementById( 'RH_IN:podiumHeight' )
var podiumHeightOutput = document.getElementById("podiumHeightValue");
podiumHeightOutput.innerHTML = podiumHeight.value + "m";
podiumHeight.oninput = function() { podiumHeighthOutput.innerHTML = this.value;}

podiumHeight.addEventListener( 'mouseup', onSliderChange, false )
podiumHeight.addEventListener( 'touchend', onSliderChange, false )


const floorHeight = document.getElementById( 'RH_IN:floorHeight' )
var floorHeightOutput = document.getElementById("floorHeightValue");
floorHeightOutput.innerHTML = floorHeight.value + "m";
floorHeight.oninput = function() { floorHeightOutput.innerHTML = this.value;}

floorHeight.addEventListener( 'mouseup', onSliderChange, false )
floorHeight.addEventListener( 'touchend', onSliderChange, false )


const levelNumber = document.getElementById( 'RH_IN:levelNumber' )
var levelNumberOutput = document.getElementById("levelNumberValue");
levelNumberOutput.innerHTML = levelNumber.value;
levelNumber.oninput = function() { levelNumberOutput.innerHTML = this.value;}

levelNumber.addEventListener( 'mouseup', onSliderChange, false )
levelNumber.addEventListener( 'touchend', onSliderChange, false )




document.getElementById("return").addEventListener("click", () => {
  window.location.href= '../index.html';

  });

  /////////////////////////////////////////////////////////////////////////////
 //                            HELPER  FUNCTIONS                            //
/////////////////////////////////////////////////////////////////////////////

/**
 * Gets <input> elements from html and sets handlers
 * (html is generated from the grasshopper definition)
 */


// more globals
let scene, camera, renderer, controls

/**
 * Sets up the scene, camera, renderer, lights and controls and starts the animation
 */
function init() {

    // Rhino models are z-up, so set this as the default
    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );

    // create a scene and a camera
    scene = new THREE.Scene()
   
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 1) // like perspective view

    // very light grey for background, like rhino
  //scene.background = new THREE.Color('whitesmoke')

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true })
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // add some controls to orbit the camera
    controls = new OrbitControls(camera, renderer.domElement)

    // add a directional light
    const directionalLight = new THREE.DirectionalLight( 0xffffff )
    directionalLight.intensity = 2
    scene.add( directionalLight )

    const ambientLight = new THREE.AmbientLight()
    ambientLight.intensity =3
    scene.add( ambientLight )

    // handle changes in the window size
    window.addEventListener( 'resize', onWindowResize, false )

    animate()
}

/**
 * Call appserver
 */
 
 async function compute () {
    const data = {
      definition: definition,
      inputs: {
       
    
       'RH_IN:siteLength': siteLength.valueAsNumber,
       'RH_IN:siteWidth': siteWidth.valueAsNumber,

       'RH_IN:streetPosition': streetPosition.valueAsNumber,
    
       'RH_IN:streetAngle': streetAngle.valueAsNumber,
        'RH_IN:streetWidth': streetWidth.valueAsNumber,
       'RH_IN:buildingDepth': buildingDepth.valueAsNumber,
       'RH_IN:buildingGapWidth': buildingGapWidth.valueAsNumber,

       
     'RH_IN:podiumHeight': podiumHeight.valueAsNumber,
       'RH_IN:floorHeight': floorHeight.valueAsNumber,
       'RH_IN:levelNumber': levelNumber.valueAsNumber,

       
      }
    }
  
    showSpinner(true)
  
    console.log(data.inputs)
    
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
/**
 * Parse response
 */
function collectResults(responseJson) {

    const values = responseJson.values

    //GET VALUES
    let greenArea = "????"
    let apartmentArea = "????"
    let podiumArea = "????"






    // clear doc
    if( doc !== undefined)
        doc.delete()

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
        



            
          //GET VALUES
          if (values[i].ParamName == "RH_OUT:greenArea") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            greenArea = Math.round(branch[j].data)
            console.log(`sky area is ${greenArea}`)
          }

           if (values[i].ParamName == "RH_OUT:podiumArea") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
           podiumArea = Math.round(branch[j].data)
            console.log(podiumArea)
          }

            if (values[i].ParamName == "RH_OUT:apartmentArea") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
           apartmentArea = Math.round(branch[j].data)
            console.log(apartmentArea)
          }


          if (rhinoObject !== null) {
            doc.objects().add(rhinoObject, null)


          }
        }
      }
    }

     //GET VALUES
     document.getElementById('greenValues').innerText =  greenArea + " m2"
     document.getElementById('apartmentValues').innerText =  apartmentArea + " m2"
     document.getElementById('podiumValues').innerText =  podiumArea + " m2"



    if (doc.objects().count < 1) {
      console.error('No rhino objects to load!')
      showSpinner(false)
      return
    }

    // load rhino doc into three.js scene
    const buffer = new Uint8Array(doc.toByteArray()).buffer
    loader.parse( buffer, function ( object ) 
    {

      

        // debug 
        /*
        object.traverse(child => {
          if (child.material !== undefined)
            child.material = new THREE.MeshNormalMaterial()
        }, false)
        */

        // clear objects from scene. do this here to avoid blink
        scene.traverse(child => {
            if (!child.isLight) {
                scene.remove(child)
            }
        })

        // add object graph from rhino model to three.js scene
        scene.add( object )

        // hide spinner and enable download button
        showSpinner(false)
        downloadButton.disabled = false

        // zoom to extents
        zoomCameraToSelection(camera, controls, scene.children)
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


  compute()
}

/**
 * The animation loop!
 */
function animate() {
  requestAnimationFrame( animate )
  controls.update()
  renderer.render(scene, camera)
}

/**
 * Helper function for window resizes (resets the camera pov and renderer size)
  */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
  animate()
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

/**
 * This function is called when the download button is clicked
 */
function download () {
    // write rhino doc to "blob"
    const bytes = doc.toByteArray()
    const blob = new Blob([bytes], {type: "application/octect-stream"})

    // use "hidden link" trick to get the browser to download the blob
    const filename = data.definition.replace(/\.gh$/, '') + '.3dm'
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
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