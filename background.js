const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
const numStars = 200;
const speed = 0.1; // Base speed factor
let centerX, centerY;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    centerX = width / 2;
    centerY = height / 2;
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = (Math.random() - 0.5) * width * 2; // Spread wider so they don't just appear in center
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = Math.random() * width; // Depth
        this.pz = this.z; // Previous z for trail effect
    }

    update() {
        this.z = this.z - speed * 100; // Move closer

        if (this.z <= 0) {
            this.reset();
            this.z = width;
            this.pz = this.z;
        }
    }

    draw() {
        // Perspective projection
        let x = (this.x / this.z) * width + centerX;
        let y = (this.y / this.z) * height + centerY;

        let size = (1 - this.z / width) * 3; // Stars get bigger as they get closer

        // Trails
        let px = (this.x / this.pz) * width + centerX;
        let py = (this.y / this.pz) * height + centerY;

        this.pz = this.z;

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 243, 255, " + (1 - this.z / width) + ")"; // Neon Blue opacity based on distance
            ctx.lineWidth = size;
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
}

function init() {
    resize();
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
    animate();
}

function animate() {
    // Clear with slight opacity for trails (optional, but clean clear is better for this specific warp effect)
    ctx.fillStyle = "rgba(5, 10, 20, 0.5)"; // Dark background with trail fade
    ctx.fillRect(0, 0, width, height); 

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
// Wait for DOM to load if script is in head, or just run if at end of body
document.addEventListener('DOMContentLoaded', init);
