import * as THREE from 'three';

import { PointerLockControls } from
    'three/examples/jsm/controls/PointerLockControls.js';


// ==============================
// SCENE
// ==============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xeeeeee);

// ==============================
// LOADING SCREEN
// ==============================

const loadingScreen = document.createElement('div');

loadingScreen.style.position = 'fixed';
loadingScreen.style.top = '0';
loadingScreen.style.left = '0';
loadingScreen.style.width = '100%';
loadingScreen.style.height = '100%';

loadingScreen.style.display = 'flex';
loadingScreen.style.alignItems = 'center';
loadingScreen.style.justifyContent = 'center';

loadingScreen.style.background = '#111';
loadingScreen.style.color = 'white';

loadingScreen.style.fontFamily = 'Arial, sans-serif';
loadingScreen.style.fontSize = '28px';

loadingScreen.style.zIndex = '2000';

loadingScreen.innerHTML = 'Loading Art Gallery...';

document.body.appendChild(loadingScreen);

// ==============================
// MINIMAP
// ==============================

const minimap = document.createElement('div');

minimap.style.position = 'fixed';
minimap.style.top = '20px';
minimap.style.right = '20px';
minimap.style.width = '180px';
minimap.style.height = '180px';

minimap.style.background = 'rgba(20, 20, 20, 0.85)';
minimap.style.border = '2px solid white';
minimap.style.borderRadius = '10px';

minimap.style.zIndex = '1000';
minimap.style.overflow = 'hidden';

document.body.appendChild(minimap);


// ==============================
// MINIMAP HELPER
// ==============================

function mapPosition(x, z) {

    const mapSize = 180;
    const gallerySize = 30;

    return {
        x: ((x + 15) / gallerySize) * mapSize,
        z: ((z + 15) / gallerySize) * mapSize
    };

}


// ==============================
// GALLERY WALLS
// ==============================

function createMapWall(x, z, width, height) {

    const wall = document.createElement('div');

    const position = mapPosition(x, z);

    wall.style.position = 'absolute';

    wall.style.left =
        `${position.x - width / 2}px`;

    wall.style.top =
        `${position.z - height / 2}px`;

    wall.style.width = `${width}px`;
    wall.style.height = `${height}px`;

    wall.style.background = 'white';

    minimap.appendChild(wall);
}


// Back wall
createMapWall(0, -15, 180, 3);

// Front wall sections
createMapWall(-8.625, 15, 77, 3);
createMapWall(8.625, 15, 77, 3);

// Left wall
createMapWall(-15, 0, 3, 180);

// Right wall
createMapWall(15, 0, 3, 180);


// ==============================
// DOOR
// ==============================

const doorMarker = document.createElement('div');

const doorPosition = mapPosition(0, 15);

doorMarker.style.position = 'absolute';

doorMarker.style.left =
    `${doorPosition.x - 13}px`;

doorMarker.style.top =
    `${doorPosition.z - 2}px`;

doorMarker.style.width = '26px';
doorMarker.style.height = '4px';

doorMarker.style.background = 'gold';

minimap.appendChild(doorMarker);


// ==============================
// ARTWORK MARKERS
// ==============================

function createArtworkMarker(x, z) {

    const marker = document.createElement('div');

    const position = mapPosition(x, z);

    marker.style.position = 'absolute';

    marker.style.left =
        `${position.x - 4}px`;

    marker.style.top =
        `${position.z - 4}px`;

    marker.style.width = '8px';
    marker.style.height = '8px';

    marker.style.background = 'cyan';

    marker.style.borderRadius = '50%';

    minimap.appendChild(marker);
}


// Back wall artworks
createArtworkMarker(-8, -14.82);
createArtworkMarker(0, -14.82);
createArtworkMarker(8, -14.82);

// Front wall artworks
createArtworkMarker(-8, 14.82);
createArtworkMarker(8, 14.82);


// ==============================
// PLAYER MARKER
// ==============================

const playerMarker = document.createElement('div');

playerMarker.style.position = 'absolute';

playerMarker.style.width = '10px';
playerMarker.style.height = '10px';

playerMarker.style.background = 'red';

playerMarker.style.borderRadius = '50%';

playerMarker.style.transform =
    'translate(-50%, -50%)';

minimap.appendChild(playerMarker);

// ==============================
// UPDATE MINIMAP
// ==============================

function updateMinimap() {

    const position = mapPosition(
        camera.position.x,
        camera.position.z
    );

    playerMarker.style.left =
        `${position.x}px`;

    playerMarker.style.top =
        `${position.z}px`;
}

// ==============================
// CAMERA
// ==============================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 12);


// ==============================
// RENDERER
// ==============================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);


// ==============================
// FLOOR
// ==============================

const floorGeometry = new THREE.PlaneGeometry(
    30,
    30
);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc
});

const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
);

floor.rotation.x = -Math.PI / 2;

floor.receiveShadow = true;

scene.add(floor);


// ==============================
// WALLS
// ==============================

function createWall(
    width,
    height,
    x,
    y,
    z,
    rotationY = 0
) {

    const wallGeometry = new THREE.BoxGeometry(
        width,
        height,
        0.2
    );

    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff
    });

    const wall = new THREE.Mesh(
        wallGeometry,
        wallMaterial
    );

    wall.position.set(
        x,
        y,
        z
    );

    wall.rotation.y = rotationY;

    wall.receiveShadow = true;

    scene.add(wall);

    return wall;
}


// Back wall
createWall(
    30,
    5,
    0,
    2.5,
    -15
);


// ==============================
// FRONT WALL WITH DOOR OPENING
// ==============================

const doorWidth = 4.5;
const wallHeight = 5;

// Left section
createWall(
    (30 - doorWidth) / 2,
    wallHeight,
    -((30 - doorWidth) / 4),
    2.5,
    15
);

// Right section
createWall(
    (30 - doorWidth) / 2,
    wallHeight,
    ((30 - doorWidth) / 4),
    2.5,
    15
);


// Left wall
createWall(
    30,
    5,
    -15,
    2.5,
    0,
    Math.PI / 2
);


// Right wall
createWall(
    30,
    5,
    15,
    2.5,
    0,
    Math.PI / 2
);


// ==============================
// CEILING
// ==============================

const ceilingGeometry = new THREE.PlaneGeometry(
    30,
    30
);

const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    side: THREE.DoubleSide
});

const ceiling = new THREE.Mesh(
    ceilingGeometry,
    ceilingMaterial
);

ceiling.rotation.x = Math.PI / 2;

ceiling.position.y = 5;

scene.add(ceiling);


// ==============================
// LIGHTING
// ==============================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.4
);

scene.add(ambientLight);


// Spotlight function

function addSpotlight(
    x,
    y,
    z,
    targetX,
    targetY,
    targetZ
) {

    const spot = new THREE.SpotLight(
        0xffffff,
        1.2,
        20,
        Math.PI / 6,
        0.3
    );

    spot.position.set(
        x,
        y,
        z
    );

    spot.castShadow = true;

    spot.target.position.set(
        targetX,
        targetY,
        targetZ
    );

    scene.add(
        spot,
        spot.target
    );
}


// Gallery spotlights

addSpotlight(
    -8, 4, -5,
    0, 1.5, -5
);

addSpotlight(
    0, 4, -5,
    0, 1.5, -5
);

addSpotlight(
    8, 4, -5,
    0, 1.5, -5
);

addSpotlight(
    -8, 4, 5,
    0, 1.5, 5
);

addSpotlight(
    0, 4, 5,
    0, 1.5, 5
);

addSpotlight(
    8, 4, 5,
    0, 1.5, 5
);


// ==============================
// GALLERY BACKGROUND AUDIO
// ==============================

const listener = new THREE.AudioListener();

camera.add(listener);

const backgroundSound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();

audioLoader.load(
    '/audio/gallery.mp3',
    function (buffer) {

        backgroundSound.setBuffer(buffer);

        backgroundSound.setLoop(true);

        backgroundSound.setVolume(0.35);
    },
    undefined,
    function (error) {

        console.error(
            'Error loading gallery audio:',
            error
        );
    }
);


// ==============================
// ARTWORK
// ==============================

const textureLoader = new THREE.TextureLoader();

const artworks = [];


// ==============================
// ARTWORK SOUND EFFECTS
// ==============================

function addArtworkSound(
    artworkMesh,
    soundPath
) {

    const sound = new THREE.PositionalAudio(
        listener
    );

    audioLoader.load(
        soundPath,
        (buffer) => {

            sound.setBuffer(buffer);

            sound.setRefDistance(3);

            sound.setLoop(false);

            sound.setVolume(0.8);

        },
        undefined,
        (error) => {

            console.error(
                'Error loading artwork sound:',
                soundPath,
                error
            );

        }
    );

    artworkMesh.add(sound);

    return sound;
}


// ==============================
// CREATE FRAME
// ==============================

function createFrame(
    width,
    height,
    x,
    y,
    z,
    rotationY = 0
) {

    const frameMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x222222
        });

    const thickness = 0.15;
    const depth = 0.12;


    // Top

    const topGeometry = new THREE.BoxGeometry(
        width + 0.3,
        thickness,
        depth
    );

    const top = new THREE.Mesh(
        topGeometry,
        frameMaterial
    );

    top.position.set(
        x,
        y + height / 2 + 0.075,
        z
    );

    top.rotation.y = rotationY;

    scene.add(top);


    // Bottom

    const bottomGeometry = new THREE.BoxGeometry(
        width + 0.3,
        thickness,
        depth
    );

    const bottom = new THREE.Mesh(
        bottomGeometry,
        frameMaterial
    );

    bottom.position.set(
        x,
        y - height / 2 - 0.075,
        z
    );

    bottom.rotation.y = rotationY;

    scene.add(bottom);


    // Left

    const sideGeometry = new THREE.BoxGeometry(
        thickness,
        height + 0.3,
        depth
    );

    const left = new THREE.Mesh(
        sideGeometry,
        frameMaterial
    );

    left.position.set(
        x - width / 2 - 0.075,
        y,
        z
    );

    left.rotation.y = rotationY;

    scene.add(left);


    // Right

    const right = new THREE.Mesh(
        sideGeometry,
        frameMaterial
    );

    right.position.set(
        x + width / 2 + 0.075,
        y,
        z
    );

    right.rotation.y = rotationY;

    scene.add(right);
}


// ==============================
// EMPTY WALL FRAME
// ==============================

function addEmptyWallFrame(
    x,
    y,
    z,
    rotationY,
    width = 3.5,
    height = 2.5
) {

    createFrame(
        width,
        height,
        x,
        y,
        z,
        rotationY
    );
}


// ==============================
// ADD ARTWORK
// ==============================

function addArtwork(
    imagePath,
    x,
    y,
    z,
    rotationY,
    width,
    title,
    description,
    soundPath
) {

    textureLoader.load(
        imagePath,
        (texture) => {

            // Get original image dimensions

            const image = texture.image;

            const aspectRatio =
                image.width / image.height;

            // Calculate height from original ratio

            const height =
                width / aspectRatio;


            // Artwork

            const artworkGeometry =
                new THREE.PlaneGeometry(
                    width,
                    height
                );

            const artworkMaterial =
                new THREE.MeshStandardMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });

            const artwork = new THREE.Mesh(
                artworkGeometry,
                artworkMaterial
            );

            artwork.position.set(
                x,
                y,
                z
            );

            artwork.rotation.y =
                rotationY;


            // Artwork information

            artwork.userData = {

                isArtwork: true,

                title: title,

                description: description

            };


            scene.add(artwork);

            artworks.push(artwork);


            // Add positional sound

            artwork.userData.sound =
                addArtworkSound(
                    artwork,
                    soundPath
                );


            // Create frame

            createFrame(
                width,
                height,
                x,
                y,
                z - 0.05,
                rotationY
            );

        }
    );
}


// ==============================
// BACK WALL ARTWORK
// ==============================

addArtwork(
    '/assets/artwork1.jpg',
    -8,
    2.6,
    -14.82,
    0,
    4,
    'The Dream That Ate Itself',
    'A dark psychedelic composition filled with intricate organic forms, surreal creatures, vivid colors and dense interconnected patterns.',
    '/audio/artwork1.mp3'
);

addArtwork(
    '/assets/artwork2.jpg',
    0,
    2.6,
    -14.82,
    0,
    4,
    'SubMatrix',
    'A highly detailed psychedelic composition filled with geometric patterns, vivid colors and complex forms.',
    '/audio/artwork2.mp3'
);

addArtwork(
    '/assets/artwork3.jpg',
    8,
    2.6,
    -14.82,
    0,
    4,
    'Psychedelic Mandala',
    'A symmetrical psychedelic artwork built around a colorful central mandala-like design.',
    '/audio/artwork3.mp3'
);


// ==============================
// FRONT WALL ARTWORK
// ==============================

addArtwork(
    '/assets/artwork4.jpg',
    -8,
    2.6,
    14.82,
    Math.PI,
    3.5,
    'Psychedelic Portrait',
    'A dark psychedelic portrait surrounded by vivid neon colors and intricate visual patterns.',
    '/audio/artwork4.mp3'
);

addArtwork(
    '/assets/artwork5.jpg',
    8,
    2.6,
    14.82,
    Math.PI,
    3.5,
    'Cosmic Geometry',
    'A colorful abstract composition combining geometric shapes, patterns and cosmic imagery.',
    '/audio/artwork5.mp3'
);


// ==============================
// AESTHETIC FRONT DOOR
// ==============================

function createGalleryDoor() {

    const doorX = 0;
    const doorY = 2.25;
    const doorZ = 14.82;

    const doorWidth = 4;
    const doorHeight = 4.2;


    // --------------------------------
    // Door frame
    // --------------------------------

    const frameMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3a2415,
            roughness: 0.5,
            metalness: 0.1
        });

    const frameThickness = 0.25;


    // Left frame

    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(
            frameThickness,
            doorHeight,
            0.25
        ),
        frameMaterial
    );

    leftFrame.position.set(
        doorX - doorWidth / 2,
        doorY,
        doorZ
    );

    scene.add(leftFrame);


    // Right frame

    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(
            frameThickness,
            doorHeight,
            0.25
        ),
        frameMaterial
    );

    rightFrame.position.set(
        doorX + doorWidth / 2,
        doorY,
        doorZ
    );

    scene.add(rightFrame);


    // Top frame

    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(
            doorWidth + 0.5,
            frameThickness,
            0.25
        ),
        frameMaterial
    );

    topFrame.position.set(
        doorX,
        doorY + doorHeight / 2,
        doorZ
    );

    scene.add(topFrame);


    // --------------------------------
    // Main double doors
    // --------------------------------

    const doorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x4a2f1c,
            roughness: 0.65,
            metalness: 0.05
        });

    const doorPanelWidth =
        doorWidth / 2 - 0.12;

    const doorPanelHeight =
        doorHeight - 0.15;


    // Left door

    const leftDoor = new THREE.Mesh(
        new THREE.BoxGeometry(
            doorPanelWidth,
            doorPanelHeight,
            0.18
        ),
        doorMaterial
    );

    leftDoor.position.set(
        doorX - doorPanelWidth / 2 - 0.04,
        doorY - 0.05,
        doorZ + 0.08
    );

    scene.add(leftDoor);


    // Right door

    const rightDoor = new THREE.Mesh(
        new THREE.BoxGeometry(
            doorPanelWidth,
            doorPanelHeight,
            0.18
        ),
        doorMaterial
    );

    rightDoor.position.set(
        doorX + doorPanelWidth / 2 + 0.04,
        doorY - 0.05,
        doorZ + 0.08
    );

    scene.add(rightDoor);


    // --------------------------------
    // Decorative panels
    // --------------------------------

    const panelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2f1d12,
            roughness: 0.55
        });


    function createDoorPanel(
        x,
        y,
        width,
        height
    ) {

        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                0.06
            ),
            panelMaterial
        );

        panel.position.set(
            x,
            y,
            doorZ + 0.19
        );

        scene.add(panel);
    }


    // Left door panels

    createDoorPanel(
        doorX - 1.0,
        doorY + 1.05,
        1.25,
        1.45
    );

    createDoorPanel(
        doorX - 1.0,
        doorY - 0.75,
        1.25,
        1.35
    );


    // Right door panels

    createDoorPanel(
        doorX + 1.0,
        doorY + 1.05,
        1.25,
        1.45
    );

    createDoorPanel(
        doorX + 1.0,
        doorY - 0.75,
        1.25,
        1.35
    );


    // --------------------------------
    // Decorative horizontal strips
    // --------------------------------

    const stripMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x6b4327,
            roughness: 0.45,
            metalness: 0.15
        });


    function createStrip(x, y) {

        const strip = new THREE.Mesh(
            new THREE.BoxGeometry(
                1.25,
                0.08,
                0.08
            ),
            stripMaterial
        );

        strip.position.set(
            x,
            y,
            doorZ + 0.24
        );

        scene.add(strip);
    }


    createStrip(
        doorX - 1.0,
        doorY + 0.25
    );

    createStrip(
        doorX - 1.0,
        doorY - 0.05
    );

    createStrip(
        doorX + 1.0,
        doorY + 0.25
    );

    createStrip(
        doorX + 1.0,
        doorY - 0.05
    );


    // --------------------------------
    // Door handles
    // --------------------------------

    const handleMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xc9a227,
            roughness: 0.25,
            metalness: 0.8
        });

    const handleGeometry =
        new THREE.SphereGeometry(
            0.12,
            16,
            16
        );


    const leftHandle = new THREE.Mesh(
        handleGeometry,
        handleMaterial
    );

    leftHandle.position.set(
        doorX - 0.22,
        doorY,
        doorZ + 0.32
    );

    scene.add(leftHandle);


    const rightHandle = new THREE.Mesh(
        handleGeometry,
        handleMaterial
    );

    rightHandle.position.set(
        doorX + 0.22,
        doorY,
        doorZ + 0.32
    );

    scene.add(rightHandle);


    // --------------------------------
    // Arched top decoration
    // --------------------------------

    const archMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3a2415,
            roughness: 0.5,
            metalness: 0.1
        });


    const arch = new THREE.Mesh(
        new THREE.TorusGeometry(
            1.75,
            0.18,
            12,
            32,
            Math.PI
        ),
        archMaterial
    );

    arch.position.set(
        doorX,
        doorY + doorHeight / 2,
        doorZ + 0.05
    );

    arch.rotation.z = Math.PI;

    scene.add(arch);


    // --------------------------------
    // Small light above the door
    // --------------------------------

    const doorLight =
        new THREE.PointLight(
            0xffd9a0,
            1.5,
            6
        );

    doorLight.position.set(
        doorX,
        doorY + doorHeight / 2 + 0.7,
        doorZ - 0.5
    );

    scene.add(doorLight);


    // Decorative light fixture

    const lightFixture = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.8,
            0.12,
            0.12
        ),
        handleMaterial
    );

    lightFixture.position.set(
        doorX,
        doorY + doorHeight / 2 + 0.55,
        doorZ + 0.1
    );

    scene.add(lightFixture);
}


// Create the door

createGalleryDoor();


// ==============================
// ARTWORK RAYCASTING
// ==============================

const raycaster = new THREE.Raycaster();

const center = new THREE.Vector2(
    0,
    0
);

let currentArtwork = null;


// ==============================
// ARTWORK INFO BOX
// ==============================

const infoBox = document.createElement('div');

infoBox.style.position = 'fixed';

infoBox.style.left = '50%';

infoBox.style.bottom = '40px';

infoBox.style.transform =
    'translateX(-50%)';

infoBox.style.width = '420px';

infoBox.style.padding = '20px';

infoBox.style.background =
    'rgba(0, 0, 0, 0.85)';

infoBox.style.color = 'white';

infoBox.style.border =
    '1px solid rgba(255, 255, 255, 0.3)';

infoBox.style.borderRadius = '12px';

infoBox.style.fontFamily =
    'Arial, sans-serif';

infoBox.style.textAlign = 'center';

infoBox.style.display = 'none';

infoBox.style.zIndex = '1000';

document.body.appendChild(infoBox);


// ==============================
// CHECK ARTWORK FOCUS
// ==============================

function checkArtworkFocus() {

    raycaster.setFromCamera(
        center,
        camera
    );

    const intersects =
        raycaster.intersectObjects(
            artworks,
            false
        );


    if (intersects.length > 0) {

        const artwork =
            intersects[0].object;


        if (artwork.userData.isArtwork) {

            if (currentArtwork !== artwork) {

                currentArtwork = artwork;


                // Play artwork sound

                if (
                    artwork.userData.sound &&
                    artwork.userData.sound.buffer &&
                    !artwork.userData.sound.isPlaying
                ) {

                    artwork.userData.sound.play();

                }


                // Show artwork information

                infoBox.innerHTML = `

                    <h2 style="margin-top: 0;">
                        ${artwork.userData.title}
                    </h2>

                    <p style="margin-bottom: 0;">
                        ${artwork.userData.description}
                    </p>

                `;

                infoBox.style.display =
                    'block';
            }

            return;
        }
    }


    currentArtwork = null;

    infoBox.style.display = 'none';
}


// ==============================
// FIRST-PERSON CONTROLS
// ==============================

const controls =
    new PointerLockControls(
        camera,
        document.body
    );


// ==============================
// MOVEMENT
// ==============================

const move = {

    forward: false,

    backward: false,

    left: false,

    right: false

};

const speed = 4;

const velocity =
    new THREE.Vector3();

const direction =
    new THREE.Vector3();

const clock =
    new THREE.Clock();


// ==============================
// KEYBOARD INPUT
// ==============================

document.addEventListener(
    'keydown',
    (event) => {

        switch (event.code) {

            case 'KeyW':
                move.forward = true;
                break;

            case 'KeyS':
                move.backward = true;
                break;

            case 'KeyA':
                move.left = true;
                break;

            case 'KeyD':
                move.right = true;
                break;

        }

    }
);


document.addEventListener(
    'keyup',
    (event) => {

        switch (event.code) {

            case 'KeyW':
                move.forward = false;
                break;

            case 'KeyS':
                move.backward = false;
                break;

            case 'KeyA':
                move.left = false;
                break;

            case 'KeyD':
                move.right = false;
                break;

        }

    }
);

// ==============================
// MOBILE CONTROLS
// ==============================

const mobileControls = document.createElement('div');

mobileControls.style.position = 'fixed';
mobileControls.style.bottom = '30px';
mobileControls.style.left = '30px';
mobileControls.style.display = 'none';
mobileControls.style.zIndex = '1500';

document.body.appendChild(mobileControls);


// Create mobile button

function createMobileButton(text, action) {

    const button = document.createElement('button');

    button.innerText = text;

    button.style.width = '60px';
    button.style.height = '60px';
    button.style.margin = '5px';

    button.style.fontSize = '24px';
    button.style.border = 'none';
    button.style.borderRadius = '12px';

    button.style.background =
        'rgba(0, 0, 0, 0.7)';

    button.style.color = 'white';

    button.addEventListener(
        'touchstart',
        (event) => {

            event.preventDefault();

            move[action] = true;

        }
    );

    button.addEventListener(
        'touchend',
        (event) => {

            event.preventDefault();

            move[action] = false;

        }
    );

    mobileControls.appendChild(button);
}


// Movement buttons

createMobileButton('W', 'forward');

createMobileButton('A', 'left');

createMobileButton('S', 'backward');

createMobileButton('D', 'right');

// ==============================
// SHOW MOBILE CONTROLS
// ==============================

function checkMobile() {

    if (window.innerWidth <= 768) {

        mobileControls.style.display = 'block';

    } else {

        mobileControls.style.display = 'none';

    }
}

checkMobile();

window.addEventListener(
    'resize',
    checkMobile
);


// ==============================
// CLICK TO ENTER + START AUDIO
// ==============================

document.body.addEventListener(
    'click',
    () => {

        controls.lock();


        if (
            backgroundSound.buffer &&
            !backgroundSound.isPlaying
        ) {

            backgroundSound.play();

        }

    }
);


// ==============================
// MOVEMENT UPDATE
// ==============================

function updateMovement() {

    if (!controls.isLocked) {

        clock.getDelta();

        return;

    }


    const delta =
        Math.min(
            clock.getDelta(),
            0.1
        );


    direction.set(
        0,
        0,
        0
    );


    if (move.forward) {

        direction.z -= 1;

    }


    if (move.backward) {

        direction.z += 1;

    }


    if (move.left) {

        direction.x -= 1;

    }


    if (move.right) {

        direction.x += 1;

    }


    if (direction.lengthSq() > 0) {

        direction.normalize();

    }


    velocity.x =
        direction.x *
        speed *
        delta;

    velocity.z =
        direction.z *
        speed *
        delta;


    controls.moveRight(
        velocity.x
    );

    controls.moveForward(
        -velocity.z
    );


// ==============================
// WALL COLLISION
// ==============================

camera.position.x = THREE.MathUtils.clamp(
    camera.position.x,
    -13.5,
    13.5
);

camera.position.z = THREE.MathUtils.clamp(
    camera.position.z,
    -13.5,
    13.5
);
}


// ==============================
// RESIZE
// ==============================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// ==============================
// ANIMATION
// ==============================

function animate() {

    requestAnimationFrame(
        animate
    );

    updateMovement();

    checkArtworkFocus();

    updateMinimap();

    renderer.render(
        scene,
        camera
    );

}

// ==============================
// HIDE LOADING SCREEN
// ==============================

window.addEventListener('load', () => {

    setTimeout(() => {

        loadingScreen.style.display = 'none';

    }, 1000);

});

animate();