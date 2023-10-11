const canvas = document.querySelector(".bug__game");
const scaleUP = document.querySelector("#scaleUP");
const scaleDown = document.querySelector("#scaleDown");

const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const WIDTH = window.innerWidth / 2;
const HEIGHT = window.innerHeight / 2;

const MARGIN = 40;
const PLAYER__WIDTH = 30;

const bugImg = new Image();
bugImg.src = "./bug.svg";
// const monoImage = new Image();
// monoImage.src = "./moni.svg";

class WorkSpace {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    // c.drawImage(this.image, this.position.x, this.position.y);
    c.beginPath();
    c.lineWidth = "5";
    c.rect(0, 0, WIDTH, HEIGHT);
    c.stroke();
  }
}

class Bug {
  constructor({ position, velocity, speed }) {
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    };
    this.speed = speed;
    this.angle = 90;
    this.rotation = this.angle;
    this.x = 0;
    this.y = 0;
    let f = 1;
    this.first_a = false;
    this.array = [];
    this.scale = 0.1;
    this.falg = false;
    const image = new Image();
    image.src = "./bug.svg";
    image.onload = () => {
      this.image = image;
      this.width = image.width * this.scale;
      this.height = image.height * this.scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  change_scale(r) {
    this.scale = this.scale + r;
    this.width += parseInt(this.width * r);
    this.height += parseInt(this.height * r);
  }

  draw() {
    c.save();
    c.translate(
      bug.position.x + bug.width / 2,
      bug.position.y + bug.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -bug.position.x - bug.width / 2,
      -bug.position.y - bug.height / 2
    );
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.array.push({ x: this.position.x, y: this.position.y });
    if (
      this.position.x + this.width > WIDTH + this.speed ||
      this.position.x <= -this.speed ||
      this.position.y + this.height > HEIGHT - MARGIN + this.speed ||
      this.position.y <= -this.speed
    ) {
      this.x =
        this.array[this.array.length - 1]?.x -
        this.array[this.array.length - 2]?.x;

      this.y =
        this.array[this.array.length - 1]?.y -
        this.array[this.array.length - 2]?.y;
      this.angle = parseInt((Math.atan(this.y / this.x) * 180) / Math.PI);

      if (!this.angle) {
        this.angle = this.previous_angle;
      } else {
        this.previous_angle = this.angle;
      }
    }
    // canvas roof
    if (this.position.y <= 0) {
      this.rotation = -this.angle * 2;
    }
    // canvas left wall
    else if (this.position.x <= 0) {
      if (this.angle < 0) {
        this.rotation = -this.angle * 2;
      } else {
        this.rotation = this.angle;
      }
      console.log(this.angle);
    }
    //  canvas floor
    else if (this.position.y + this.width > HEIGHT - MARGIN) {
      this.rotation = this.angle;
    }
    // canvas right wall
    else if (this.position.x + this.width > WIDTH) {
      if (this.angle < 0) {
        this.rotation = this.angle;
      } else this.rotation = -this.angle * 2;
    }

    //______________change bug direction in x axis __________________
    if (
      this.position.x + this.width > WIDTH + 2 * this.speed ||
      this.position.x <= -2 * this.speed
    ) {
      this.velocity.x = -this.velocity.x;
      this.array = [];
    }
    // change bug direction in y axis
    if (
      this.position.y + this.width > HEIGHT - MARGIN + 2 * this.speed ||
      this.position.y <= -2 * this.speed
    ) {
      this.velocity.y = -this.velocity.y;
      this.array = [];
    }
  }
}

class Player {
  constructor({ position }) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = {
      x: 2,
    };
  }

  draw() {
    c.beginPath();
    c.rect(this.position.x, this.position.y, 30, 30);
    c.fillStyle = "gray";
    c.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    if (this.position.x + PLAYER__WIDTH > WIDTH || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
    }
  }
}

class Projectile {
  constructor({ position, velocity, ball }) {
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    };
    this.ball = ball;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, 7, 0, Math.PI * 2, false);

    c.stroke();
  }

  update() {
    this.draw();
    this.position.y -= this.velocity.y;
  }
}
// ______________________________________
const workSpace = new WorkSpace();
let scl = false;
var speed = 1.1;
const bug = new Bug({
  speed: speed,
  position: {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  },
  velocity: { x: speed, y: speed },
});

const player = new Player({
  position: {
    x: WIDTH / 2 - PLAYER__WIDTH,
    y: HEIGHT - PLAYER__WIDTH,
  },
});

const projectiles = [];

// _______________________
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  workSpace.draw();
  bug.update();
  // ____________player
  player.update();

  // ____________projectile
  projectiles.map((projectile, index) => {
    projectile.update();

    const dist = Math.hypot(
      projectile.position.x - player.position.x,
      projectile.position.y - player.position.y
    );
  });
}

scaleUP.addEventListener("click", () => {
  scl = true;
  // bug.change_scale(0.1);

  let projectile = new Projectile({
    position: { x: player.position.x, y: player.position.y },
    velocity: { x: 1, y: 3 },
    ball: "0",
  });
  projectiles.push(projectile);
});
animate();
