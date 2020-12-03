import { $create, $id } from '@utils/dom';

// https://easings.net/#easeInOutCubic
const easeOutCubic = (x) => 1 - (1 - x) ** 4;
const makeUnitString = (numericValue, unit) => `${numericValue}${unit}`;
const makeFloat = (unitValue) => parseFloat(unitValue);

const GameObject = class {
  constructor({
    origin = null,
    position = null,
    parent = null,
    depth = 'auto',
    classes = [],
  } = {}) {
    this.createElement();
    this.animationFrame = null;
    this.originStyle = '';
    this.rotateStyle = '';

    this.angle = 0;
    this.position = [0, 0];

    this.setDepth(depth);
    if (origin) this.setOrigin(...origin);
    if (position) this.move(...position, 0);
    if (parent) this.attachToObject(parent);
    classes.forEach((className) => {
      this.setClass(className);
    });
  }

  attachToObject(parentObject) {
    if (parentObject) parentObject.appendChild(this);
    else this.attachToRoot();
  }

  delete(duration = 1) {
    this.instance.style.transition = `opacity ${duration}s`;
    this.instance.style.opacity = 0;
    setTimeout(() => this.instance.remove(), duration * 1000);
  }

  attachToRoot() {
    $id('root').appendChild(this.instance);
  }

  createElement() {
    const element = $create('div');
    this.setElement(element);
  }

  appendChild(object) {
    this.instance.appendChild(object.instance);
  }

  addClass(className) {
    this.instance.classList.add(className);
  }

  toggleClass(className) {
    this.instance.classList.toggle(className);
  }

  removeClass(className) {
    this.instance.classList.remove(className);
  }

  setElement(element) {
    this.instance = element;
  }

  setOriginCenter() {
    this.setOrigin();
  }

  setOrigin(x = '50%', y = '50%') {
    const numberY = makeFloat(y);
    const numberX = makeFloat(x);
    this.originStyle = `translate(-${x}, -${y})`;
    this.instance.style.transformOrigin = `${50 - numberX}% ${50 - numberY}%`;
    this.transform();
  }

  transform() {
    this.instance.style.transform = `${this.rotateStyle} ${this.originStyle}`;
  }

  setDepth(zIndex) {
    this.instance.style.zIndex = zIndex;
  }

  move(x = 0, y = 0, duration = 0.5) {
    this.position = [x, y];
    const xString = makeUnitString(x, '%');
    const yString = makeUnitString(y, '%');

    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (!xString && !yString) {
      this.instance.style.removeProperty('top');
      this.instance.style.removeProperty('left');
    }
    if (duration === 0) {
      this.instance.style.top = yString;
      this.instance.style.left = xString;
      return;
    }
    const initialY = makeFloat(this.instance.style.top) || 0;
    const initialX = makeFloat(this.instance.style.left) || 0;
    const targetY = y;
    const targetX = x;

    const miliseconds = duration * 1000;
    let start = null;
    const animateFunction = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      if (elapsed > miliseconds) {
        this.instance.style.top = yString;
        this.instance.style.left = xString;
        this.animationFrame = null;
        return;
      }
      const newY =
        initialY + (targetY - initialY) * easeOutCubic(elapsed / miliseconds);
      const newX =
        initialX + (targetX - initialX) * easeOutCubic(elapsed / miliseconds);
      // this.position = [newX, newY];

      this.instance.style.left = makeUnitString(newX, '%');
      this.instance.style.top = makeUnitString(newY, '%');

      requestAnimationFrame(animateFunction);
    };

    this.animationFrame = requestAnimationFrame(animateFunction);
  }

  rotate(angle = 0, duration = 0.2) {
    this.angle = angle;
    const angleString = makeUnitString(angle, 'deg');
    const keyframes = [
      { transform: this.instance.style.transform },
      { transform: `rotateZ(${angleString}) ${this.originStyle}` },
    ];
    const options = {
      duration: duration * 1000,
      easing: 'ease',
    };
    this.instance.animate(keyframes, options);

    this.instance.style.transform = `rotateZ(${angleString}) ${this.originStyle}`;
    this.rotateStyle = `rotateZ(${angleString})`;
  }
};

export default GameObject;
