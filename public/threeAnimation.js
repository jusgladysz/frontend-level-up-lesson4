import {visibleHeightAtZDepth, visibleWidthAtZDepth, lerp} from "./utils.js"
import {nextSlide, previousSlide} from "./main.js"

const raycaster = new THREE.Raycaster()
const objLoader = new THREE.OBJLoader()
let arrowBoxNext = null
let arrowBoxNextRotation = 0
let arrowBoxPrevious = null
let arrowBoxPreviousRotation = 0

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight)

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

document.body.append(renderer.domElement)

objLoader.load(
    'models/cube.obj',
    ({children}) => {
      const screenBorderRight = visibleWidthAtZDepth(-10, camera) / 2
      const screenBottom = -visibleHeightAtZDepth(-10, camera) / 2

      addCubeNext(children[0], nextSlide, screenBorderRight - 1.5, screenBottom + 1)

      animateNext()
    }
)

objLoader.load(
    'models/cube.obj',
    ({children}) => {
      const screenBorderLeft = -visibleWidthAtZDepth(-10, camera) / 2
      const screenBottom = -visibleHeightAtZDepth(-10, camera) / 2

      addCubePrevious(children[0], previousSlide, screenBorderLeft + 1.5 , screenBottom + 1)

      animatePrevious()
    }
)

const addCubeNext = (object, callbackFn, x, y) => {
  const cubeMesh = object.clone()

  cubeMesh.scale.setScalar(.3)
  cubeMesh.rotation.set(THREE.Math.degToRad(90), 0, 0)

  const boundingBox = new THREE.Mesh(
      new THREE.BoxGeometry(.7, .7, .7),
      new THREE.MeshBasicMaterial({transparent: true, opacity: 0})
  )

  boundingBox.position.x = x
  boundingBox.position.y = y
  boundingBox.position.z = -10

  boundingBox.add(cubeMesh)

  boundingBox.callbackFn = callbackFn

  arrowBoxNext = boundingBox
  scene.add(boundingBox)
}

const animateNext = () => {
  arrowBoxNextRotation = lerp(arrowBoxNextRotation, 0, .07)
  arrowBoxNext.rotation.set(THREE.Math.degToRad(arrowBoxNextRotation), 0, 0)

  renderer.render(scene, camera)
  requestAnimationFrame(animateNext)
}


const addCubePrevious = (object, callbackFn, x, y) => {
    const cubeMesh = object.clone()

    cubeMesh.scale.setScalar(.3)
    cubeMesh.rotation.set(THREE.Math.degToRad(90), 0, 0)

    const boundingBox = new THREE.Mesh(
        new THREE.BoxGeometry(.7, .7, .7),
        new THREE.MeshBasicMaterial({transparent: true, opacity: 0})
    )

    boundingBox.position.x = x
    boundingBox.position.y = y
    boundingBox.position.z = -10

    boundingBox.add(cubeMesh)

    boundingBox.callbackFn = callbackFn

    arrowBoxPrevious = boundingBox
    scene.add(boundingBox)
}

const animatePrevious = () => {
  arrowBoxPreviousRotation = lerp(arrowBoxPreviousRotation, 0, .07)
  arrowBoxPrevious.rotation.set(THREE.Math.degToRad(arrowBoxPreviousRotation), 0, 0)

  renderer.render(scene, camera)
  requestAnimationFrame(animatePrevious)
}

export const handleThreeAnimationNext = () => {
  arrowBoxNextRotation = 360
}

export const handleThreeAnimationPrevious = () => {
  arrowBoxPreviousRotation = 360
}

window.addEventListener('click', () => {
  const mousePosition = new THREE.Vector2()
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mousePosition, camera)

  const interesctedObjects = raycaster.intersectObjects([arrowBoxNext])
  interesctedObjects.length && interesctedObjects[0].object.callbackFn()
})

window.addEventListener('click', () => {
  const mousePosition = new THREE.Vector2()
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mousePosition, camera)

  const interesctedObjects = raycaster.intersectObjects([arrowBoxPrevious])
  interesctedObjects.length && interesctedObjects[0].object.callbackFn()
})
