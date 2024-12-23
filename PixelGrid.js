class PixelGrid {
    constructor(containerId, width = 32, height = 32) {
        this.container = document.getElementById(containerId);
        this.width = width;
        this.height = height;
        this.isDrawing = false;
        this.currentColor = '#000000';
        this.currentTool = 'pencil';
        this.init();
    }

    init() {
        this.container.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
        this.createGrid();
        this.setupEventListeners();
    }

    createGrid() {
        this.container.innerHTML = '';
        for (let i = 0; i < this.width * this.height; i++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            this.container.appendChild(pixel);
        }
    }

    setupEventListeners() {
        this.container.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.handlePixelInteraction(e);
        });

        this.container.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                this.handlePixelInteraction(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
    }

    handlePixelInteraction(e) {
        const pixel = e.target;
        if (!pixel.classList.contains('pixel')) return;

        switch (this.currentTool) {
            case 'pencil':
                pixel.style.backgroundColor = this.currentColor;
                break;
            case 'eraser':
                pixel.style.backgroundColor = 'transparent';
                break;
            case 'fill':
                this.floodFill(pixel);
                break;
        }
    }

    floodFill(startPixel) {
        const targetColor = startPixel.style.backgroundColor || 'transparent';
        const fillColor = this.currentColor;
        if (targetColor === fillColor) return;

        const pixels = Array.from(this.container.children);
        const stack = [startPixel];
        const startIndex = pixels.indexOf(startPixel);

        while (stack.length) {
            const pixel = stack.pop();
            const index = pixels.indexOf(pixel);

            if (pixel.style.backgroundColor === targetColor) {
                pixel.style.backgroundColor = fillColor;

                // Check adjacent pixels
                const x = index % this.width;
                const y = Math.floor(index / this.width);

                // Right
                if (x < this.width - 1) {
                    const right = pixels[index + 1];
                    if (right.style.backgroundColor === targetColor) stack.push(right);
                }
                // Left
                if (x > 0) {
                    const left = pixels[index - 1];
                    if (left.style.backgroundColor === targetColor) stack.push(left);
                }
                // Down
                if (y < this.height - 1) {
                    const down = pixels[index + this.width];
                    if (down.style.backgroundColor === targetColor) stack.push(down);
                }
                // Up
                if (y > 0) {
                    const up = pixels[index - this.width];
                    if (up.style.backgroundColor === targetColor) stack.push(up);
                }
            }
        }
    }

    setColor(color) {
        this.currentColor = color;
    }

    setTool(tool) {
        this.currentTool = tool;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.init();
    }

    clear() {
        const pixels = this.container.children;
        for (let pixel of pixels) {
            pixel.style.backgroundColor = 'transparent';
        }
    }

    getPixelData() {
        return Array.from(this.container.children).map(pixel => pixel.style.backgroundColor || 'transparent');
    }
}