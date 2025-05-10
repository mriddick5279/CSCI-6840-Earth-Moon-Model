// Template from https://codesandbox.io/p/sandbox/threejs-starter-template-96kxr?file=%2Fsrc%2Findex.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Variables to change rotation and orbit speeds
var rot_speed = 1;
var prev_rot_speed;
var orb_speed = 1;
var prev_orb_speed;
var stop = false;

let app = {
  el: document.getElementById("app"),
  scene: null,
  renderer: null,
  camera: null
}

const init = () => {
  app.renderer = new THREE.WebGLRenderer();
  console.log(app.renderer);
  app.renderer.setSize ( window.innerWidth, window.innerHeight);
  app.el.appendChild (app.renderer.domElement);

  app.scene = new THREE.Scene();

  app.camera =  new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  // Load "earth.jpg" texture
  const textureLoader = new THREE.TextureLoader();
  const earth_texture = textureLoader.load('earth.jpg');

  // Add Earth to the scene
  const earth_geometry = new THREE.SphereGeometry(1, 32, 32);
  const earth_material = new THREE.MeshStandardMaterial({ map: earth_texture });
  const earth_sphere = new THREE.Mesh(earth_geometry, earth_material);
  app.scene.add(earth_sphere);

  // Loading "stars.jpg" texture
  const stars_texture = textureLoader.load('stars.jpg');

  // Add stars to the scene
  const star_geometry = new THREE.SphereGeometry(64, 32, 32);
  const star_material = new THREE.MeshBasicMaterial({side: THREE.BackSide, map: stars_texture});
  const stars_sphere = new THREE.Mesh(star_geometry, star_material);
  app.scene.add(stars_sphere);

  // Loading "moon.jpg" texture
  const moon_texture = textureLoader.load('moon.jpg');

  // Add Moon to the scene
  const moon_geometry = new THREE.SphereGeometry(0.2725, 32, 32);
  const moon_material = new THREE.MeshStandardMaterial({map: moon_texture});
  const moon_sphere = new THREE.Mesh(moon_geometry, moon_material);
  moon_sphere.position.set(5,0,0);
  app.scene.add(moon_sphere);

  // Move camera to view the sphere
  app.camera.position.z = 5;

  // Add white light to the scene
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 2);
  app.scene.add(light);

  // Adding ambient lighting
  const amb_light = new THREE.AmbientLight(0xFFFFFF, 0.05);
  app.scene.add(amb_light);

  // Adding line for Orbit Controls
  app.controls = new OrbitControls(app.camera, app.renderer.domElement);

  // Giving earth_sphere object name
  earth_sphere.name = "earth";

  // Giving moon_sphere object name
  moon_sphere.name = "moon";

};

const render = () => {
  requestAnimationFrame(render);
  app.renderer.render(app.scene, app.camera);

  // Adding line for Orbit Controls
  app.controls.update();

  // Grabbing time
  var time = Date.now() * 0.001;

  // If the system is not in "Pause" mode, then keep
  // rotating the spheres and orbiting the moon sphere
  if (stop == false) {
    app.scene.getObjectByName("earth").rotation.y = time * 15 * (3.14159/180) * rot_speed;
    app.scene.getObjectByName("moon").rotation.y = time * 0.54 * (3.14159/180) * rot_speed;

    // Making the Moon orbit the Earth
    moonOrbit(time);
  }

  // Listen to key input and adjust rotation and orbit speeds
  document.addEventListener("keydown", onDocKeyDown, false);
};

// Function to control the orbit of the Moon
function moonOrbit(time) {
  const moon_speed = time * 0.54 * (3.14159/180) * orb_speed;
  app.scene.getObjectByName("moon").position.x = 5 * Math.cos(moon_speed);
  app.scene.getObjectByName("moon").position.z = -5 * Math.sin(moon_speed);
};

// Will detect key inputs and adjust speed/system movement appropriately
function onDocKeyDown(event) {
  var keyCode = event.which;

  if (keyCode == 39 && rot_speed < 6) { // Right Arrow Key speeds up system
    rot_speed += 1;
    orb_speed += 5;
  }
  else if (keyCode == 37 && rot_speed > 1) { // Left Arrow Key slows down system
    rot_speed -= 1;
    orb_speed -= 5;
  }
  else if (keyCode == 32) { // Space has been pressed
    if (stop == false) { // Will stop movement in the system
      stop = true;
    }
    else if (stop == true) { // Will resume movement in the system 
      stop = false;
    }
  }
};

init();
render();
