// Initialize Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Add pixel ratio for high-DPI displays
document.body.appendChild(renderer.domElement);

// Add post-processing for bloom effect
// Create high-resolution render target
const renderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth * window.devicePixelRatio,
  window.innerHeight * window.devicePixelRatio,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  }
);
const composer = new THREE.EffectComposer(renderer, renderTarget);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
  ),
  0.8, // strength (reduced from 1.5)
  0.2, // radius (reduced from 0.4)
  0.85 // threshold (unchanged)
);
composer.addPass(bloomPass);

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.minDistance = 3; // Minimum zoom distance
controls.maxDistance = 20; // Maximum zoom distance

// Create a particle system for flowing thoughts
const particleCount = 1000;
const particles = new THREE.BufferGeometry();

// Create a circular, soft-edged particle texture
const particleCanvas = document.createElement("canvas");
particleCanvas.width = 64;
particleCanvas.height = 64;
const particleContext = particleCanvas.getContext("2d");

// Create circular gradient for soft particles
const particleGradient = particleContext.createRadialGradient(
  32,
  32,
  0,
  32,
  32,
  32
);
particleGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
particleGradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
particleGradient.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
particleGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

particleContext.fillStyle = particleGradient;
particleContext.fillRect(0, 0, 64, 64);

const particleTexture = new THREE.Texture(particleCanvas);
particleTexture.needsUpdate = true;

const particleMaterial = new THREE.PointsMaterial({
  color: 0xcccccc, // Light gray particles
  size: 0.1,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
  map: particleTexture,
  depthWrite: false,
});

// Create particle positions
const positions = new Float32Array(particleCount * 3);
const velocities = [];
const particleSizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  // Create particles in a more enveloping spherical pattern
  const radius = 15 + Math.random() * 15; // Larger radius to enclose scene
  const angle = Math.random() * Math.PI * 2;
  const height = Math.random() * 20 - 10; // More vertical range
  const depth = Math.random() * Math.PI - Math.PI / 2; // Add depth variation

  // Position in a spherical pattern
  positions[i * 3] = Math.cos(angle) * Math.cos(depth) * radius; // x
  positions[i * 3 + 1] = height; // y
  positions[i * 3 + 2] = Math.sin(angle) * Math.cos(depth) * radius; // z

  // Store velocity for animation
  velocities.push({
    x: Math.cos(angle) * 0.01,
    y: 0.01 + Math.random() * 0.01,
    z: Math.sin(angle) * 0.01,
  });

  // Varied particle sizes
  particleSizes[i] = 0.1 + Math.random() * 0.2;
}

particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particles.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));

// Create the particle system
const particleSystem = new THREE.Points(particles, particleMaterial);
particleSystem.position.z = -5; // Moved forward to better enclose the scene
scene.add(particleSystem);

// Create a wireframe cube resembling the Cursor logo - larger and behind text
const cursorGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // Reduced size further
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff, // White wireframe
  wireframe: true,
  wireframeLinewidth: 0.5, // Thinner lines
  transparent: true,
  opacity: 0.2, // Lower opacity
});

// Create the wireframe cube
const cursorShape = new THREE.Mesh(cursorGeometry, wireframeMaterial);
cursorShape.position.z = 0; // Position in the middle of text
scene.add(cursorShape);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Position camera
camera.position.z = 5;

// Store text particles
const textParticles = [];

// Tao Te Ching quotes collection
const taoQuotes = [
  {
    title: "Chapter 1",
    lines: [
      "The Tao that can be trodden is not the enduring",
      "and unchanging Tao.",
      "The name that can be named",
      "is not the enduring and unchanging name.",
      "Conceived of as having no name,",
      "it is the Originator of heaven and earth;",
      "conceived of as having a name,",
      "it is the Mother of all things.",
    ],
  },
  {
    title: "Chapter 25",
    lines: [
      "There was something undefined and complete,",
      "coming into existence before Heaven and Earth.",
      "How still it was and formless,",
      "standing alone, and undergoing no change,",
      "reaching everywhere and in no danger of being exhausted!",
      "It may be regarded as the Mother of all things.",
      "I do not know its name,",
      "and I give it the designation of the Tao.",
    ],
  },
  {
    title: "Chapter 43",
    lines: [
      "The softest thing in the world",
      "dashes against and overcomes the hardest;",
      "that which has no substantial existence",
      "enters where there is no crevice.",
      "I know hereby what advantage belongs",
      "to doing nothing with a purpose.",
      "There are few in the world who attain",
      "to the teaching without words,",
      "and the advantage arising from non-action.",
    ],
  },
  {
    title: "Chapter 44",
    lines: [
      "Or fame or life,",
      "Which do you hold more dear?",
      "Or life or wealth,",
      "To which would you adhere?",
      "Keep life and lose those other things;",
      "Keep them and lose your life:",
      "which brings sorrow and pain more near?",
    ],
  },
  {
    title: "On Harmony",
    lines: [
      "He who is in harmony with the Tao",
      "is like a newborn child.",
      "Its bones are soft, its muscles are weak,",
      "but its grip is powerful.",
      "The Master's power is like this.",
      "He lets all things come and go",
      "effortlessly, without desire.",
      "He never expects results;",
      "thus he is never disappointed.",
    ],
  },
];

// Text rendering setup
const textGroup = new THREE.Group();
scene.add(textGroup);
textGroup.position.set(0, 0, 0); // Will be dynamically updated to keep newest line centered

let currentQuote = Math.floor(Math.random() * taoQuotes.length);
let currentLine = 0;
let displayTimer = 0;
let lineDisplayTime = 5; // Increased: seconds per line (was 3)
let titleFont, contentFont;
let lineMeshes = [];

// Load fonts - we'll use EB Garamond through CSS for the 2D text
// For 3D text, we'll use a local font file
const fontLoader = new THREE.FontLoader();
fontLoader.load(
  "https://j7dwymn73wqwkbwj.public.blob.vercel-storage.com/assets/eb-garamond-ZWuJZN295QCPY08HO82D8tdjEijPrS.json",
  function (font) {
    titleFont = font;
    contentFont = font; // Using the same font for both title and content
    displayQuote();

    // Add keydown event listener to advance next line instead of next quote
    document.addEventListener("keydown", (event) => {
      // If there are more lines in the current quote, display the next line
      if (currentLine < lineMeshes.length) {
        // Make all currently visible lines start fading out
        for (let i = 0; i < currentLine; i++) {
          const mesh = lineMeshes[i];
          if (mesh && mesh.userData.state === "visible") {
            mesh.userData.state = "fading-out";
          }
        }

        // Reset the display timer to trigger the next line immediately
        displayTimer = lineDisplayTime;
      } else {
        // If all lines in current quote have been shown, move to next quote
        currentQuote = (currentQuote + 1) % taoQuotes.length;
        displayQuote();
      }

      // Play a random note
      if (window.playLineSound) window.playLineSound();
    });
  }
);

// Display the current quote's lines without title
function displayQuote() {
  // Clear previous text
  while (textGroup.children.length > 0) {
    textGroup.remove(textGroup.children[0]);
  }

  // Reset line counter
  currentLine = 0;
  lineMeshes = [];

  // Pre-create all lines to calculate total height
  createAllQuoteLines();
}

// Create all lines of the current quote first to calculate total dimensions
function createAllQuoteLines() {
  const quote = taoQuotes[currentQuote];
  const allLines = [];
  const lineSpacing = 0.35;
  let totalHeight = 0;

  // First pass: create all line geometries and calculate dimensions
  for (let i = 0; i < quote.lines.length; i++) {
    const line = quote.lines[i];
    const lineGeometry = new THREE.TextGeometry(line, {
      font: contentFont,
      size: 0.25,
      height: 0.01,
    });

    // Calculate line dimensions
    lineGeometry.computeBoundingBox();
    const textWidth =
      lineGeometry.boundingBox.max.x - lineGeometry.boundingBox.min.x;
    const textHeight =
      lineGeometry.boundingBox.max.y - lineGeometry.boundingBox.min.y;

    allLines.push({
      text: line,
      width: textWidth,
      height: textHeight,
    });

    totalHeight += textHeight;
  }

  // Add spacing between lines (except after the last line)
  totalHeight += lineSpacing * (quote.lines.length - 1);

  // Second pass: position and create meshes for each line
  let currentYPosition = totalHeight / 2; // Start from the top of the centered block

  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    const lineGeometry = new THREE.TextGeometry(line.text, {
      font: contentFont,
      size: 0.25,
      height: 0.01,
    });

    const lineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Pure white text
      transparent: true,
      opacity: 0, // Start completely transparent
    });

    const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);

    // Start slightly offset from final position for animation
    lineMesh.position.set(
      -line.width / 2, // Center horizontally
      currentYPosition - line.height - 0.2, // Position slightly below final position
      -0.5 // Start slightly behind final position
    );

    // Compute bounding box for later particle creation
    lineGeometry.computeBoundingBox();

    // Store final position for animation
    lineMesh.userData = {
      finalY: currentYPosition - line.height,
      finalZ: 0,
      state: "waiting", // States: 'waiting', 'animating-in', 'visible', 'fading-out', 'removed'
      age: 0, // Track how long this line has been visible
      text: line.text, // Store the actual text
      convertedToParticles: false, // Track if already converted to particles
    };

    // Hide mesh by default (will be shown during animation)
    lineMesh.visible = false;

    textGroup.add(lineMesh);
    lineMeshes.push(lineMesh);

    // Move down by line height plus spacing for next line
    currentYPosition -= line.height + lineSpacing;
  }

  // Start displaying lines one by one
  currentLine = 0;
  displayNextLine();
}

// Display the next line of the current quote
function displayNextLine() {
  if (currentLine < lineMeshes.length) {
    // Make the current line visible as we start to animate it
    if (lineMeshes[currentLine]) {
      lineMeshes[currentLine].visible = true;
      lineMeshes[currentLine].userData.state = "animating-in";

      // Set previous lines to start fading out if they've been visible for a while
      for (let i = 0; i < currentLine; i++) {
        const mesh = lineMeshes[i];
        if (
          mesh &&
          mesh.userData.state === "visible" &&
          mesh.userData.age > 3
        ) {
          mesh.userData.state = "fading-out";
        }
      }
    }
    // Handle the fade-in
    currentLine++;
  } else {
    // The quote is complete, but we'll check if the last line is fully visible
    // in the animation loop instead of using a timeout
  }
}

// Initialize Tone.js with a more serene ambient sound
let isMuted = true; // Start muted by default
let audioAnalyzer = null;
let analyzerValues = new Uint8Array(0);
let lastAudioIntensity = 0;
let targetOpacity = 0.2; // Target opacity for smooth transitions
let audioInitialized = false;
let masterGain = null; // Master gain node for fade effects

// Initialize audio components but don't start playing
function setupAudio() {
  console.log("Setting up Tone.js audio");

  // Create master gain node for fade effects
  masterGain = new Tone.Gain(0).toDestination(); // Start at 0 gain

  // Create analyzer for audio reactivity
  audioAnalyzer = new Tone.Analyser("waveform", 1024);
  audioAnalyzer.connect(masterGain);

  // Create a more delicate synth for line transitions
  const synth = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.4,
      release: 2.0,
    },
  }).connect(audioAnalyzer);

  // Create enhanced reverb for more spacious ambience
  const reverb = new Tone.Reverb({
    decay: 10.0, // Longer decay for more spaciousness
    wet: 0.8, // More wet signal
    preDelay: 0.3, // Increased preDelay for more space
  }).connect(masterGain);

  // Add delay for ethereal quality
  const delay = new Tone.FeedbackDelay({
    delayTime: "8n.",
    feedback: 0.5,
    wet: 0.5,
  }).connect(reverb);

  // Add filter for softer tone
  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 1500, // Lower frequency for gentler tone
    Q: 0.5, // Softer resonance
  }).connect(delay);

  // Create a more serene ambient synth
  const ambient = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 1.2, // Lower harmonicity for less tension
    modulationIndex: 2.0, // Lower modulation for softer sound
    oscillator: {
      type: "sine", // Pure sine wave
    },
    envelope: {
      attack: 3.0, // Longer attack for gentler onset
      decay: 2.0, // Longer decay
      sustain: 0.8,
      release: 10.0, // Longer release for sustained resonance
    },
    modulation: {
      type: "triangle", // Less complex modulation
    },
    modulationEnvelope: {
      attack: 2.0, // Softer modulation attack
      decay: 1.0,
      sustain: 0.4,
      release: 5.0, // Extended release
    },
  })
    .connect(filter)
    .connect(audioAnalyzer);

  // Zen-oriented pentatonic scale
  const zenScale = ["G2", "Bb2", "C3", "D3", "F3", "G3", "Bb3", "C4", "D4"];

  // Play ambient notes with more thoughtful timing
  const ambientPart = new Tone.Pattern(
    (time, note) => {
      // Gentler velocity for softer notes
      const velocity = 0.05 + Math.random() * 0.15;
      ambient.triggerAttackRelease(note, "4n", time, velocity);
    },
    zenScale,
    "randomWalk"
  );

  // Slow down the tempo further for more meditative feeling
  Tone.Transport.bpm.value = 20;

  // Note: We don't start Transport until user interaction
  // Tone.Transport.start();
  // ambientPart.start();

  // Play a gentler note when a new line appears
  window.playLineSound = function () {
    if (!isMuted && audioInitialized) {
      // Use pentatonic notes for the line notification as well
      const noteIndex = Math.floor(Math.random() * zenScale.length);
      const randomNote = zenScale[noteIndex];
      synth.triggerAttackRelease(randomNote, "8n", undefined, 0.2);
    }
  };

  // Store the ambient part for later use
  window.ambientPart = ambientPart;

  // Mark audio as initialized
  audioInitialized = true;
}

// Initialize UI controls state
document.addEventListener("DOMContentLoaded", () => {
  // Add transition to UI controls for smooth fading
  document.querySelector(".controls").style.transition = "opacity 1s ease-out";
  document.querySelector("#fullscreen").style.transition =
    "opacity 1s ease-out";

  // Start with controls visible
  document.querySelector(".controls").style.opacity = "1";
  document.querySelector("#fullscreen").style.opacity = "1";

  // Fade out controls after initial display
  setTimeout(() => {
    document.querySelector(".controls").style.opacity = "0";
    document.querySelector("#fullscreen").style.opacity = "0";
  }, 3000);

  // Update the button text to reflect muted state
  const toggleAudioButton = document.getElementById("toggleAudio");
  if (toggleAudioButton) {
    toggleAudioButton.textContent = "Play Audio";
    toggleAudioButton.setAttribute("data-state", "play");
  }

  // Toggle audio button
  toggleAudioButton.addEventListener("click", () => {
    // Initialize audio on first click
    if (!audioInitialized) {
      // Fix for Safari: Create an empty buffer to play to unlock audio
      const unlockAudio = () => {
        // Create a temporary audio context
        const tempAudioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        // Create an empty buffer
        const buffer = tempAudioContext.createBuffer(1, 1, 22050);
        const source = tempAudioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(tempAudioContext.destination);

        // Play the empty sound (important for Safari)
        if (source.start) {
          source.start(0);
        } else {
          source.noteOn(0);
        }

        // Clean up
        setTimeout(() => {
          if (tempAudioContext.close) {
            tempAudioContext.close();
          }

          // Now initialize Tone.js
          initializeToneJS();
        }, 100);
      };

      // Function to initialize Tone.js after unlocking audio
      const initializeToneJS = () => {
        // First check if Tone.js context exists and resume it
        if (Tone.context && Tone.context.state !== "running") {
          Tone.context
            .resume()
            .then(() => {
              console.log("Tone context resumed successfully");
              startToneJS();
            })
            .catch((err) => {
              console.error("Failed to resume Tone context:", err);
            });
        } else {
          startToneJS();
        }
      };

      // Function to start Tone.js
      const startToneJS = () => {
        Tone.start()
          .then(() => {
            console.log("Tone.js initialized successfully");
            setupAudio();
            startAudio();
          })
          .catch((err) => {
            console.error("Error initializing Tone.js:", err);
            // Try a fallback approach for Safari
            console.log("Trying fallback audio initialization...");
            setupAudio();
            startAudio();
          });
      };

      // Start the audio initialization process
      unlockAudio();
    } else {
      // Toggle audio state on subsequent clicks
      if (isMuted) {
        startAudio();
      } else {
        pauseAudio();
      }
    }
  });

  // Function to start audio playback with fade in
  function startAudio() {
    // Set muted state first so other functions know audio is active
    isMuted = false;

    // Try to resume the Tone.js context if it's suspended (important for Safari)
    if (Tone.context && Tone.context.state !== "running") {
      Tone.context
        .resume()
        .then(() => {
          console.log("Tone context resumed");
          startTransport();
        })
        .catch((err) => {
          console.error("Failed to resume context:", err);
          // Try anyway
          startTransport();
        });
    } else {
      startTransport();
    }

    function startTransport() {
      try {
        // Make sure masterGain exists
        if (masterGain) {
          // Set gain to 0 initially
          masterGain.gain.value = 0;

          // Start transport before fading in
          Tone.Transport.start();
          if (window.ambientPart) {
            window.ambientPart.start();
          }

          // Fade in gradually over 1 second
          masterGain.gain.rampTo(1, 1);
        } else {
          console.error("Master gain node not initialized");
          // Fallback: start without fade
          Tone.Transport.start();
          if (window.ambientPart) {
            window.ambientPart.start();
          }
        }
      } catch (err) {
        console.error("Error starting transport:", err);
      }
    }

    // Update button appearance
    toggleAudioButton.textContent = "Mute Audio";
    toggleAudioButton.setAttribute("data-state", "mute");
  }

  // Function to pause audio playback with fade out
  function pauseAudio() {
    // Set muted flag immediately
    isMuted = true;

    try {
      // If we have a master gain node, fade out audio before stopping
      if (masterGain) {
        // Fade out over 1 second
        masterGain.gain.rampTo(0, 1);

        // Schedule pause after fade completes
        setTimeout(() => {
          Tone.Transport.pause();
        }, 1000);
      } else {
        // Fallback if no master gain node
        Tone.Transport.pause();
      }
    } catch (err) {
      console.error("Error pausing transport:", err);
    }

    // Update button appearance immediately
    toggleAudioButton.textContent = "Play Audio";
    toggleAudioButton.setAttribute("data-state", "play");
  }

  // Next quote button
  document.getElementById("nextQuote").addEventListener("click", () => {
    currentQuote = (currentQuote + 1) % taoQuotes.length;
    displayQuote();
  });

  // Fullscreen button
  document.getElementById("fullscreen").addEventListener("click", () => {
    toggleFullScreen();
  });
});

// Toggle fullscreen function
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    // Enter fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      // Safari
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      // IE11
      document.documentElement.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE11
      document.msExitFullscreen();
    }
  }
}

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let lastMouseMoveTime = Date.now();
let controlsFadeTimeout;

// Add mousewheel zoom functionality
document.addEventListener(
  "wheel",
  (event) => {
    // Prevent default scrolling behavior
    event.preventDefault();

    // Calculate zoom factor based on wheel delta
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;

    // Get current camera distance from center
    const currentDistance = camera.position.length();

    // Calculate new distance with limits
    const newDistance = Math.max(3, Math.min(20, currentDistance * zoomFactor));

    // Apply new position while maintaining direction
    const direction = camera.position.clone().normalize();
    camera.position.copy(direction.multiplyScalar(newDistance));

    // Keep camera looking at center
    camera.lookAt(scene.position);
  },
  { passive: false }
);

// Add mouse move event listener
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX - windowHalfX) / 200; // Reduced sensitivity (increased divisor)
  mouseY = (event.clientY - windowHalfY) / 200; // Reduced sensitivity (increased divisor)

  // Show UI controls when mouse moves
  document.querySelector(".controls").style.opacity = "1";
  document.querySelector("#fullscreen").style.opacity = "1";

  // Reset the last mouse move time
  lastMouseMoveTime = Date.now();

  // Clear any existing timeout
  clearTimeout(controlsFadeTimeout);

  // Set timeout to fade controls if mouse stops moving
  controlsFadeTimeout = setTimeout(() => {
    // Fade out controls when mouse is inactive for 3 seconds
    document.querySelector(".controls").style.opacity = "0";
    document.querySelector("#fullscreen").style.opacity = "0";
  }, 3000);
});

// Remove OrbitControls as we're using our custom mouse movement
controls.enabled = false;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Smooth mouse tracking for gentle camera movement
  targetX = mouseX * 0.25; // Reduced movement multiplier
  targetY = mouseY * 0.25; // Reduced movement multiplier

  // Apply smooth camera movement with limits
  camera.position.x += (targetX - camera.position.x) * 0.03; // Slower movement
  camera.position.y += (-targetY - camera.position.y) * 0.03; // Slower movement

  // Keep camera looking at center
  camera.lookAt(scene.position);

  // Update controls (just for damping if enabled)
  controls.update();

  // Rotate cursor shape - slower rotation for bigger cube
  cursorShape.rotation.x += 0.002; // Reduced rotation speed
  cursorShape.rotation.y += 0.002; // Reduced rotation speed

  // Audio reactivity for wireframe cube
  if (audioAnalyzer) {
    // Get audio data
    analyzerValues = audioAnalyzer.getValue();

    // Calculate average amplitude
    let sum = 0;
    for (let i = 0; i < analyzerValues.length; i++) {
      sum += Math.abs(analyzerValues[i]);
    }
    const average = sum / analyzerValues.length;

    // Map audio average to brightness intensity with a higher multiplier
    const intensity = Math.min(1, average * 20); // Amplify the effect more

    // Set the target opacity based on audio intensity
    targetOpacity = 0.2 + intensity * 0.8; // Base opacity + audio-reactive component

    // Smooth transition to target opacity (avoid flickering)
    wireframeMaterial.opacity +=
      (targetOpacity - wireframeMaterial.opacity) * 0.15;

    // Keep the color white but adjust the brightness
    const brightness = 0.7 + intensity * 0.3; // Range from 0.7 to 1.0
    wireframeMaterial.color.setRGB(brightness, brightness, brightness);
  }

  // Animate particles
  const positions = particleSystem.geometry.attributes.position.array;

  for (let i = 0; i < particleCount; i++) {
    // Create a flowing pattern like the Tao
    positions[i * 3] += velocities[i].x;
    positions[i * 3 + 1] += velocities[i].y;
    positions[i * 3 + 2] += velocities[i].z;

    // Create boundaries and circular flow
    if (positions[i * 3 + 1] > 10) {
      positions[i * 3 + 1] = -10;
    }

    // Add slight wave motion
    positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.01;
    positions[i * 3 + 2] += Math.cos(Date.now() * 0.001 + i) * 0.01;

    // Reset particles that move too far away
    const distance = Math.sqrt(
      positions[i * 3] * positions[i * 3] +
        positions[i * 3 + 2] * positions[i * 3 + 2]
    );

    if (distance > 40) {
      const angle = Math.random() * Math.PI * 2;
      const depth = Math.random() * Math.PI - Math.PI / 2;
      const radius = 15 + Math.random() * 5;
      positions[i * 3] = Math.cos(angle) * Math.cos(depth) * radius;
      positions[i * 3 + 2] = Math.sin(angle) * Math.cos(depth) * radius;
    }
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;

  // Text animation
  if (contentFont) {
    displayTimer += 0.016; // Approximately 60fps

    // Animate line appearance
    lineMeshes.forEach((mesh, i) => {
      if (!mesh.visible) return; // Skip invisible meshes

      // Update line state based on current state
      switch (mesh.userData.state) {
        case "animating-in":
          // Position animation for new lines
          const targetY = mesh.userData.finalY;
          const targetZ = mesh.userData.finalZ;

          // Move towards final position
          mesh.position.y += (targetY - mesh.position.y) * 0.05; // Reduced from 0.1 for slower movement
          mesh.position.z += (targetZ - mesh.position.z) * 0.05; // Reduced from 0.1 for slower movement

          // Fade in animation
          if (mesh.material.opacity < 1) {
            mesh.material.opacity += 0.01; // Reduced from 0.02 for slower fade-in
            // Line has finished animating in
            if (mesh.material.opacity >= 1) {
              mesh.userData.state = "visible";
              if (i === currentLine - 1) {
                // Play sound when line fully appears
                if (window.playLineSound) window.playLineSound();
              }
            }
          }
          break;

        case "visible":
          // Increment age counter for visible lines
          mesh.userData.age += 0.016;
          break;

        case "fading-out":
          // Convert to particles as soon as the text starts fading out
          if (!mesh.userData.convertedToParticles) {
            convertTextToParticles(mesh);
          }

          // Scroll up and fade out
          mesh.position.y += 0.005; // Reduced from 0.01 for slower scroll
          mesh.material.opacity -= 0.005; // Reduced from 0.01 for slower fade-out

          // Once fully faded, mark as removed
          if (mesh.material.opacity <= 0) {
            mesh.visible = false;
            mesh.userData.state = "removed";
          }
          break;
      }
    });

    // Check if we need to move to the next quote (all lines displayed and last line visible)
    if (currentLine >= lineMeshes.length && lineMeshes.length > 0) {
      // Get the last line
      const lastLine = lineMeshes[lineMeshes.length - 1];

      // If the last line has become fully visible, move to the next quote
      if (
        lastLine &&
        lastLine.userData.state === "visible" &&
        lastLine.userData.age >= 5
      ) {
        currentQuote = (currentQuote + 1) % taoQuotes.length;
        displayQuote();
      }
    }

    // Animate text particles
    for (let i = textParticles.length - 1; i >= 0; i--) {
      const particle = textParticles[i];

      // Update particle position based on velocity
      particle.position.x += particle.userData.velocity.x;
      particle.position.y += particle.userData.velocity.y;
      particle.position.z += particle.userData.velocity.z;

      // Add slight deceleration for more natural movement
      particle.userData.velocity.x *= 0.97; // Faster horizontal deceleration
      particle.userData.velocity.y *= 0.993; // Very slow vertical deceleration for rising effect
      particle.userData.velocity.z *= 0.97; // Faster horizontal deceleration

      // Add slight upward drift regardless of initial direction (mist rising effect)
      particle.position.y += 0.002;

      // Fade out based on age and adjust size for mist effect
      particle.userData.age += 0.016;
      const lifeRatio = particle.userData.age / particle.userData.maxAge;

      // First expand, then contract and fade
      if (lifeRatio < 0.3) {
        // Initial expansion phase - gentler expansion
        particle.material.size =
          particle.userData.initialSize * (1 + lifeRatio);
        particle.material.opacity = 0.7;
      } else {
        // Dissipation phase - maintain larger size longer for more blurry effect
        particle.material.size = particle.userData.initialSize * (1 + 0.3);
        particle.material.opacity = Math.max(
          0,
          0.7 * (1 - (lifeRatio - 0.3) / 0.7)
        );
      }

      // Remove particles that have exceeded their lifespan
      if (particle.userData.age >= particle.userData.maxAge) {
        scene.remove(particle);
        textParticles.splice(i, 1);
      }
    }

    // Display next line after a delay
    if (displayTimer >= lineDisplayTime && currentLine < lineMeshes.length) {
      displayTimer = 0;
      displayNextLine();
    }
  }

  // Function to center the text group based on current line
  centerTextOnCurrentLine();

  // Render using composer instead of direct renderer
  composer.render();
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update mouse tracking variables
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
});

// Start animation
animate();

// Function to center the text group based on current line
function centerTextOnCurrentLine() {
  if (currentLine > 0 && lineMeshes[currentLine - 1]) {
    // Get the newest visible line
    const newestLine = lineMeshes[currentLine - 1];

    // Calculate target position to center this line vertically
    const targetY = -newestLine.userData.finalY;

    // Smoothly move the text group to center the newest line
    textGroup.position.y += (targetY - textGroup.position.y) * 0.05;
  }
}

// Handle text-to-particles conversion
function convertTextToParticles(mesh) {
  // Only process if the mesh is in the correct state
  if (
    mesh.userData.state !== "fading-out" ||
    mesh.userData.convertedToParticles
  ) {
    return;
  }

  mesh.userData.convertedToParticles = true;
  mesh.visible = false; // Hide the original text

  // Create particles for each character (approximated)
  const width =
    mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x;
  const height =
    mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;
  const text = mesh.userData.text;

  // Use more particles for a misty effect
  const charCount = text ? text.length : Math.ceil(width * 20);
  const particlesPerChar = 8; // Reduced from 15 for a more subtle effect

  // Create character particles
  for (let i = 0; i < charCount; i++) {
    // For each character, create multiple particles
    for (let j = 0; j < particlesPerChar; j++) {
      // Calculate position based on character position in text with more randomness for diffuse effect
      const charX =
        (i / charCount) * width - width / 2 + (Math.random() - 0.5) * 0.2;
      const charY = mesh.position.y + (Math.random() - 0.5) * 0.2;
      const charZ = mesh.position.z + (Math.random() - 0.5) * 0.2;

      // Create a particle for this position
      createTextParticle(
        new THREE.Vector3(charX, charY, charZ),
        mesh.material.color
      );
    }
  }
}

// Create an individual text particle
function createTextParticle(position, color) {
  // Get world position (accounting for text group position)
  const worldPos = textGroup.localToWorld(position.clone());

  // Create a particle
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(3);
  vertices[0] = worldPos.x;
  vertices[1] = worldPos.y;
  vertices[2] = worldPos.z;

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  // Randomize particle size for mist effect - smaller sizes for mist-like appearance
  const particleSize = 0.03 + Math.random() * 0.05; // Significantly reduced size

  // Create a circular, soft-edged particle
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");

  // Create circular gradient for soft particles
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
  gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  const particleTexture = new THREE.Texture(canvas);
  particleTexture.needsUpdate = true;

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: particleSize,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    map: particleTexture,
    depthWrite: false,
  });

  const particle = new THREE.Points(geometry, material);

  // Calculate burst direction vector - favor upward motion for mist-like rising effect
  const burstDirection = new THREE.Vector3(
    (Math.random() - 0.5) * 1, // x: reduced horizontal spread
    Math.random() * 0.8 + 0.2, // y: strongly biased upward (0.2 to 1.0)
    (Math.random() - 0.5) * 1 // z: reduced depth spread
  ).normalize();

  // Add velocity for animation - gentler for more subtle burst effect
  const speed = 0.01 + Math.random() * 0.02; // Significantly reduced speed for calmer motion

  particle.userData = {
    velocity: new THREE.Vector3(
      burstDirection.x * speed,
      burstDirection.y * speed,
      burstDirection.z * speed
    ),
    age: 0,
    maxAge: 2.5 + Math.random() * 2.5, // Extended lifespan for slower dissipation (was 1.5 + 2)
    initialSize: particleSize,
  };

  // Add to scene
  scene.add(particle);
  textParticles.push(particle);
}
