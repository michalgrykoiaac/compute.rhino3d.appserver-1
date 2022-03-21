// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { MapControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'
import { HDRCubeTextureLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/RGBELoader.js';
import { FlakesTexture } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/textures/FlakesTexture.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/libs/dat.gui.module.js';
// declare variables to store scene, camera, and renderer



// call functions

document.getElementById("return").addEventListener("click", () => {
  window.location.href= '../index.html';

  });

// function to setup the scene, camera, renderer, and load 3d model


    
   window.addEventListener( 'click', onClick, false);

    const model = 'plant2.3dm'
  


    let scene, camera, renderer, controls, raycaster, gui, pointlight;

  
    const mouse = new THREE.Vector2()
    window.addEventListener( 'click', onClick, false);
    

        // Rhino models are z-up, so set this as the default
        THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 )

       
        let INTERSECTED;


        
     
        
    







    function init() {
      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
      renderer.setSize(window.innerWidth,window.innerHeight);
      document.body.appendChild(renderer.domElement);

      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      camera = new THREE.PerspectiveCamera(30,window.innerWidth/window.innerHeight,1,1000);
      camera.position.set(0,0,60);


  

      raycaster = new THREE.Raycaster()



      //controls = new OrbitControls(camera, renderer.domElement);

      // controls

        controls = new MapControls( camera, renderer.domElement );

        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;

        controls.screenSpacePanning = false;

        controls.minDistance = 10;
        controls.maxDistance = 500;

        controls.maxPolarAngle = Math.PI / 2;



      pointlight = new THREE.PointLight(0xffffff,1);
      pointlight.position.set(200,200,200);
      scene.add(pointlight);

      let envmaploader = new THREE.PMREMGenerator(renderer);

   

      new RGBELoader().setPath('textures/').load('chinese_garden_4k.hdr', function(hdrmap) {

        let envmap = envmaploader.fromCubemap(hdrmap);
        let texture = new THREE.CanvasTexture(new FlakesTexture());
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = 100;
        texture.repeat.y = 100;

        const shapeMat = {
        
        };
        
      

        let mainMat = new THREE.MeshPhysicalMaterial({  
          clearcoat: 1.0,
          cleacoatRoughness:0.1,
          metalness: 0.9,
          roughness:0.5,
          color: 0x000000,
          normalMap: texture,
          normalScale: new THREE.Vector2(0.15,0.15),
          envMap: envmap.texture
        }); 
        






            //load the model
        const loader = new Rhino3dmLoader()
        loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

       
    
    
          
        loader.load( model, function ( object ) {

        object.traverse( function (child) {         
            child.material = mainMat.clone()
            }); 
 /* 
            object.traverse(function(child) {
              if (child.hasOwnProperty('name')){
                  if (child.name == '1'){
                      child.material=mainMat
                  }else if(child.name =='2') {
                      child.material=iMat
                  } else {
                      child.material=mainMat
                  }}
                          
              
          })*/

          
          showSpinner(true)
            scene.add( object )
            initGUI( object.userData.layers );
            
            showSpinner(false)
         } )
         

      });
    }
    /* Shows or hides the loading spinner
    */
    function showSpinner(enable) {
     if (enable)
       document.getElementById('loader').style.display = 'block'
     else
       document.getElementById('loader').style.display = 'none'
   }


    function onClick( event ) {

      console.log( `click! (${event.clientX}, ${event.clientY})`)
  
    // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
  
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
      
      raycaster.setFromCamera( mouse, camera )
  
    // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects( scene.children, true )
  
      let container = document.getElementById( 'container' )
      if (container) container.remove()
  
      





      // find intersections


  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[0].object;

      console.log(`this is ${INTERSECTED}`);

      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }






  
      if (intersects.length > 0) {
  
          // get closest object
          const object = intersects[0].object
          console.log(object) // debug
  
          
  
          // get user strings
          let data, count
          if (object.userData.attributes !== undefined) {
              data = object.userData.attributes.userStrings
          } else {
              // breps store user strings differently...
              data = object.parent.userData.attributes.userStrings
          }
  
          // do nothing if no user strings
          if ( data === undefined ) return
  
          console.log( data )
          
          // create container div with table inside
          container = document.createElement( 'div' )
          container.id = 'container'
          
          const table = document.createElement( 'table' )
          container.appendChild( table )
  
          for ( let i = 0; i < data.length; i ++ ) {
  
              const row = document.createElement( 'tr' )
              row.innerHTML = `<td>${data[ i ][ 0 ]}</td><td>${data[ i ][ 1 ]}</td>`
              table.appendChild( row )
          }
  
          document.body.appendChild( container )
      }

}


function initGUI( layers ) {

  gui = new GUI( { title: 'layers' } );

  for ( let i = 0; i < layers.length; i ++ ) {

      const layer = layers[ i ];
      gui.add( layer, 'visible' ).name( layer.name ).onChange( function ( val ) {

          const name = this.object.name;

          scene.traverse( function ( child ) {

              if ( child.userData.hasOwnProperty( 'attributes' ) ) {

                  if ( 'layerIndex' in child.userData.attributes ) {

                      const layerName = layers[ child.userData.attributes.layerIndex ].name;

                      if ( layerName === name ) {

                          child.visible = val;
                          layer.visible = val;

                      }

                  }

              }

          } );

      } );

  }

}



    function animate() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      controls.update()
    }
    
    init();
    animate();
    
    





