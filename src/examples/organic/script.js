import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/TransformControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/3DMLoader.js'
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/RGBELoader.js';

// set up loader for converting the results to threejs
const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' )

const definition = 'prototypingOrganicTESTING.gh'



var hdrEquirect = new RGBELoader()
.setPath('textures/')
.load('chinese_garden_4k.hdr', function () {

  hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

} );



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


//3 Arc Creation inputs
const gridAngle = document.getElementById( 'RH_IN:gridAngle' )
var gridAngleOutput = document.getElementById("gridAnglevalue");
gridAngleOutput.innerHTML = gridAngle.value;
gridAngle.oninput = function() { gridAngleOutput.innerHTML = this.value;}

gridAngle.addEventListener( 'mouseup', onSliderChange, false )
gridAngle.addEventListener( 'touchend', onSliderChange, false )

const gridSize = document.getElementById( 'RH_IN:gridSize' )
var gridSizeOutput = document.getElementById("gridSizevalue");
gridSizeOutput.innerHTML = gridSize.value + "m";
gridSize.oninput = function() { gridSizeOutput.innerHTML = this.value;}

gridSize.addEventListener( 'mouseup', onSliderChange, false )
gridSize.addEventListener( 'touchend', onSliderChange, false )



//7 Layer Options inputs

const showArcs = document.getElementById( 'RH_IN:showFrame' )
showArcs.addEventListener( 'change', onSliderChange, false )


document.getElementById("return").addEventListener("click", () => {
  window.location.href= '../index.html';

  });






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

  

  


/**
 * Call appserver
 */
 async function compute () {
    const data = {
      definition: definition,
      inputs: {
       
    
       'RH_IN:gridAngle': gridAngle.valueAsNumber,
       'RH_IN:gridSize': gridSize.valueAsNumber,
       

     
          

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
  
    console.log(values)

    //GET VALUES
    let planLength = "????"
    let planWidth = "????"
    let surfaceArea = "????"
    let memberNumber = "????"
    let shortestMember = "????"
    let longestMember = "????"
    
  
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
          if (values[i].ParamName == "RH_OUT:planLength") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            planLength = Math.round(branch[j].data)
            console.log(`Length of site is ${planLength}`)
          }

           if (values[i].ParamName == "RH_OUT:planWidth") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            planWidth = Math.round(branch[j].data)
            console.log(planWidth)
          }

            if (values[i].ParamName == "RH_OUT:surfaceArea") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            surfaceArea = branch[j].data
            console.log(surfaceArea)
          }


           if (values[i].ParamName == "RH_OUT:memberNumber") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            memberNumber = branch[j].data
            console.log(memberNumber)
          }

           if (values[i].ParamName == "RH_OUT:shortestMember") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            shortestMember = Math.round(branch[j].data)
            console.log(shortestMember)
          }

           if (values[i].ParamName == "RH_OUT:longestMember") {
            //area = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            longestMember = Math.round(branch[j].data)
            console.log(longestMember)
          }

      

          
          //console.log(values[i].ParamName)

          if (rhinoObject !== null) {
            doc.objects().add(rhinoObject, null)
          }
        }
      }
    }
     //GET VALUES
     document.getElementById('planLengthvalue').innerText =  planLength + " m"
     document.getElementById('planWidthvalue').innerText =  planWidth + " m"
     document.getElementById('planWidthvalue').innerText =  surfaceArea + " m" 
     document.getElementById('memberNumber').innerText =   memberNumber
     document.getElementById('shortestMembervalue').innerText =   shortestMember + " m"
     document.getElementById('longestMembervalue').innerText =  longestMember + " m"
    
     
  

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
    camera.position.set(0,0,30)
    
    

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