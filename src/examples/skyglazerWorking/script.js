import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/TransformControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/3DMLoader.js'
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'

// set up loader for converting the results to threejs
const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' )

const definition = 'curve_control7.gh'
var panelTypeVal = 0;






//2 Site set-up inputs
const siteLength = document.getElementById("RH_IN:siteLength");
siteLength.addEventListener( 'mouseup', onSliderChange, false )
siteLength.addEventListener( 'touchend', onSliderChange, false )



const siteWidth = document.getElementById( 'RH_IN:siteWidth' )
siteWidth.addEventListener( 'mouseup', onSliderChange, false )
siteWidth.addEventListener( 'touchend', onSliderChange, false )

//3 Arc Creation inputs
const arcRadius1 = document.getElementById( 'RH_IN:arcRadius1' )
arcRadius1.addEventListener( 'mouseup', onSliderChange, false )
arcRadius1.addEventListener( 'touchend', onSliderChange, false )
const arcRadius2 = document.getElementById( 'RH_IN:arcRadius2' )
arcRadius2.addEventListener( 'mouseup', onSliderChange, false )
arcRadius2.addEventListener( 'touchend', onSliderChange, false )
const arcRadius3 = document.getElementById( 'RH_IN:arcRadius3' )
arcRadius3.addEventListener( 'mouseup', onSliderChange, false )
arcRadius3.addEventListener( 'touchend', onSliderChange, false )
const arcRadius4 = document.getElementById( 'RH_IN:arcRadius4' )
arcRadius4.addEventListener( 'mouseup', onSliderChange, false )
arcRadius4.addEventListener( 'touchend', onSliderChange, false )


//4 Panel Creation inputs


const quadPanels = document.getElementById('RH_IN:quadPanels');
quadPanels.addEventListener('click', radioClick);
const triPanels = document.getElementById('RH_IN:triPanels');
triPanels.addEventListener('click', radioClick);
const diamondPanels = document.getElementById('RH_IN:diamondPanels');
diamondPanels.addEventListener('click', radioClick);


const uDivisions = document.getElementById( 'RH_IN:uDivisions' )
uDivisions.addEventListener( 'mouseup', onSliderChange, false )
uDivisions.addEventListener( 'touchend', onSliderChange, false )
const vDivisions = document.getElementById( 'RH_IN:vDivisions' )
vDivisions.addEventListener( 'mouseup', onSliderChange, false )
vDivisions.addEventListener( 'touchend', onSliderChange, false )



function radioClick() {

 
  const panelTypeButtons = document.querySelectorAll('input[name="panelTypeRadio"]');
  for (const panelTypeButton of panelTypeButtons) {
    if (panelTypeButton.checked) {
      panelTypeVal = panelTypeButton.value;
      console.log(panelTypeVal);
    } 
  }


  
   // show spinner
   document.getElementById('loader').style.display = 'block'
 
    compute();
  }

let cameraRig, activeCamera, activeHelper;
let cameraPerspective, cameraOrtho;
let cameraPerspectiveHelper, cameraOrthoHelper;
let rhino, doc

let points = []

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
        //'points': points,
       'RH_IN:siteLength': siteLength.valueAsNumber,
       'RH_IN:siteWidth': siteWidth.valueAsNumber,
       'RH_IN:arcRadius1': arcRadius1.valueAsNumber,
       'RH_IN:arcRadius2': arcRadius2.valueAsNumber,
       'RH_IN:arcRadius3': arcRadius3.valueAsNumber,
       'RH_IN:arcRadius4': arcRadius4.valueAsNumber,
        'RH_IN:uDivisions': uDivisions.valueAsNumber,
        'RH_IN:vDivisions': vDivisions.valueAsNumber,
        'RH_IN:panelType': parseInt(panelTypeVal),
        
        
 
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
  

/**
 * Parse response
 */
 function collectResults(responseJson) {

    const values = responseJson.values
  
    console.log(values)

    //GET VALUES
    let skyArea = "????"

  
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
          


    

             //GET VALUES
             if (values[i].ParamName == "RH_OUT:sky_visibility_area") {
              //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
              skyArea = Math.round(branch[j].data)
  
              console.log(skyArea)
            }
            //console.log(area)

          
          //console.log(values[i].ParamName)

          if (rhinoObject !== null) {
            doc.objects().add(rhinoObject, null)
          }
        }
      }
    }
     //GET VALUES
     document.getElementById('skyVisibilityAreavalue').innerText =  skyArea + " m2"


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
        object.traverse(child => {
          if (child.isLine) {
            if (child.userData.attributes.geometry.userStringCount > 0) {
              //console.log(child.userData.attributes.geometry.userStrings[0][1])
              const col = child.userData.attributes.geometry.userStrings[0][1]
              const threeColor = new THREE.Color( "rgb(" + col + ")")
              const mat = new THREE.LineBasicMaterial({color:threeColor})
              child.material = mat
            }
          }
        })
  
        ///////////////////////////////////////////////////////////////////////
        // add object graph from rhino model to three.js scene
        scene.add( object )
  
        // hide spinner and enable download button
        //showSpinner(false)
       // downloadButton.disabled = false
  
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
    camera = new THREE.PerspectiveCamera( 75, aspect, 1, 10000 )
    camera.position.set(0,0,300);

      // create the renderer and add it to the html
     // const canvas = document.querySelector('#c');
     //  renderer = new THREE.WebGLRenderer({canvas, alpha: true});
    renderer = new THREE.WebGLRenderer({antialias: true, alpha:true})
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( container.clientWidth, container.clientHeight )
    container.appendChild(renderer.domElement)





   // add some controls to orbit the camera
    controls = new OrbitControls( camera, renderer.domElement  )
    controls.target.set(100, 100, 100);
    controls.update();
  
    // add a directional light
    scene.add( new THREE.AmbientLight( 0xf1e3c9, 2 ) )
      const light = new THREE.DirectionalLight( 0xf1e3c9, 3 )
    
      scene.add( light );
  
  // handle changes in the window size
  //  window.addEventListener( 'resize', onWindowResize, false )
  
    animate()
  }
  
  var animate = function () {
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
  }
    
  /* function onWindowResize() {
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
      const filename = data.definition.replace(/\.gh$/, '') + '.3dm'
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