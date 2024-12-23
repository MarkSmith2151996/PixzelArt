document.addEventListener('DOMContentLoaded', () => {
    // Initialize PixelGrid
    const pixelGrid = new PixelGrid('pixelGrid');

    // Setup color picker
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('input', (e) => {
        pixelGrid.setColor(e.target.value);
    });

    // Setup preset colors
    const presetColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
                         '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
    const presetColorsContainer = document.getElementById('presetColors');
    
    presetColors.forEach(color => {
        const colorElement = document.createElement('div');
        colorElement.className = 'color-preset';
        colorElement.style.backgroundColor = color;
        colorElement.addEventListener('click', () => {
            colorPicker.value = color;
            pixelGrid.setColor(color);
        });
        presetColorsContainer.appendChild(colorElement);
    });

    // Setup tools
    const tools = {
        pencilTool: 'pencil',
        eraserTool: 'eraser',
        fillTool: 'fill'
    };

    Object.entries(tools).forEach(([id, tool]) => {
        const button = document.getElementById(id);
        button.addEventListener('click', () => {
            // Remove active class from all tools
            Object.keys(tools).forEach(toolId => {
                document.getElementById(toolId).classList.remove('tool-active');
            });
            // Add active class to selected tool
            button.classList.add('tool-active');
            pixelGrid.setTool(tool);
        });
    });

    // Setup clear canvas
    document.getElementById('clearCanvas').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the canvas?')) {
            pixelGrid.clear();
        }
    });

    // Setup grid size update
    document.getElementById('updateSize').addEventListener('click', () => {
        const width = parseInt(document.getElementById('gridWidth').value);
        const height = parseInt(document.getElementById('gridHeight').value);
        
        if (width >= 8 && width <= 64 && height >= 8 && height <= 64) {
            pixelGrid.resize(width, height);
        } else {
            alert('Grid size must be between 8 and 64');
        }
    });

    // Setup save functionality
    document.getElementById('saveButton').addEventListener('click', async () => {
        const data = {
            pixels: pixelGrid.getPixelData(),
            width: pixelGrid.width,
            height: pixelGrid.height,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/save-artwork', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);  // Log response for debugging
                alert('Artwork saved successfully!');
            } else {
                const errorText = await response.text();
                console.error('Save failed:', errorText);
                throw new Error('Failed to save artwork');
            }
        } catch (error) {
            console.error('Error saving artwork:', error);  // Log error for debugging
            alert('Error saving artwork: ' + error.message);
        }
    });
});
