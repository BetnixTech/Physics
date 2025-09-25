// shapes.js
class Shape {
  constructor(x, y, type, size = 50) {
    this.x = x;
    this.y = y;
    this.type = type; // "circle", "box", "triangle", "polygon", "line"
    this.size = size;
    this.vx = 0;
    this.vy = 0;
    this.color = this.randomColor();
  }

  randomColor() {
    const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(gravity, canvas) {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    // ground collision
    if (this.y + this.size > canvas.height) {
      this.y = canvas.height - this.size;
      this.vy *= -0.7;
    }
    // wall collision
    if (this.x < 0 || this.x + this.size > canvas.width) {
      this.vx *= -0.7;
      if (this.x < 0) this.x = 0;
      if (this.x + this.size > canvas.width) this.x = canvas.width - this.size;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    switch (this.type) {
      case "circle":
        ctx.beginPath();
        ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size/2, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        break;

      case "box":
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        break;

      case "triangle":
        ctx.beginPath();
        ctx.moveTo(this.x + this.size/2, this.y);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case "line":
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.size, this.y + this.size/2);
        ctx.stroke();
        break;

      case "polygon":
        ctx.beginPath();
        let sides = 5;
        let angle = (Math.PI * 2) / sides;
        for (let i = 0; i < sides; i++) {
          let px = this.x + this.size/2 + Math.cos(i * angle) * this.size/2;
          let py = this.y + this.size/2 + Math.sin(i * angle) * this.size/2;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
  }
}

// shapes.js

export const shapes = [];

export class Shape {
    constructor(x, y, type = "circle", size = 50, color = "white", mass = 1) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = size;
        this.color = color;
        this.mass = mass;

        // velocity
        this.vx = 0;
        this.vy = 0;

        // rotation
        this.rotation = 0; // radians
        this.angularVelocity = 0; // radians per frame
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;

        switch (this.type) {
            case "circle":
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case "square":
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;

            case "triangle":
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
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
}

// Factory functions for convenience
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
