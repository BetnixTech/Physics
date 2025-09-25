// shapes.js

// Array to hold all shapes in the simulation
export const shapes = [];

// Main Shape class
export class Shape {
    constructor(x, y, type = "circle", size = 50, color = "white", mass = 1) {
        this.x = x;               // X position
        this.y = y;               // Y position
        this.type = type;         // "circle", "square", "triangle", "polygon", "line"
        this.size = size;         // Width/height or radius
        this.color = color;       // Fill color
        this.mass = mass;         // Mass for physics calculations

        // Physics properties
        this.vx = 0;              // Horizontal velocity
        this.vy = 0;              // Vertical velocity
        this.rotation = 0;        // Rotation in radians
        this.angularVelocity = 0; // Rotation speed
        this.anchored = false;    // If true, shape does not move
    }

    // Draw the shape on the canvas context
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;

        switch (this.type) {
            case "circle":
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;

            case "square":
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;

            case "triangle":
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case "polygon":
                const sides = 5; // default pentagon
                ctx.beginPath();
                for (let i = 0; i < sides; i++) {
                    const angle = (i / sides) * 2 * Math.PI;
                    const px = Math.cos(angle) * this.size / 2;
                    const py = Math.sin(angle) * this.size / 2;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case "line":
                ctx.beginPath();
                ctx.moveTo(-this.size / 2, 0);
                ctx.lineTo(this.size / 2, 0);
                ctx.lineWidth = 3;
                ctx.strokeStyle = this.color;
                ctx.stroke();
                break;
        }

        ctx.restore();
    }

    // Update position and apply gravity
    update(gravity, canvas) {
        if (this.anchored) return;

        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;

        // Ground collision
        if (this.y + this.size > canvas.height) {
            this.y = canvas.height - this.size;
            this.vy *= -0.7; // bounce
        }

        // Wall collision
        if (this.x < 0 || this.x + this.size > canvas.width) {
            this.vx *= -0.7;
            if (this.x < 0) this.x = 0;
            if (this.x + this.size > canvas.width) this.x = canvas.width - this.size;
        }
    }
}

// Factory functions to create shapes
export function createCircle(x, y, size = 50, color = "white", mass = 1) {
    const c = new Shape(x, y, "circle", size, color, mass);
    shapes.push(c);
    return c;
}

export function createSquare(x, y, size = 50, color = "white", mass = 1) {
    const s = new Shape(x, y, "square", size, color, mass);
    shapes.push(s);
    return s;
}

export function createTriangle(x, y, size = 50, color = "white", mass = 1) {
    const t = new Shape(x, y, "triangle", size, color, mass);
    shapes.push(t);
    return t;
}

export function createPolygon(x, y, size = 50, color = "white", mass = 1) {
    const p = new Shape(x, y, "polygon", size, color, mass);
    shapes.push(p);
    return p;
}

export function createLine(x, y, size = 50, color = "white", mass = 1) {
    const l = new Shape(x, y, "line", size, color, mass);
    shapes.push(l);
    return l;
}
