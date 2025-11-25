class Controls {
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case 'KEYS':
        this.#addKeyboardListerners();
        break;
      case 'DUMMY':
        this.forward = true;
        break;
    }
  }

  #addKeyboardListerners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.forward = true;
          break;
        case 'ArrowDown':
          this.reverse = true;
          break;
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
      }
    };

    document.onkeyup = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.forward = false;
          break;
        case 'ArrowDown':
          this.reverse = false;
          break;
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
      }
    };
  }
}
