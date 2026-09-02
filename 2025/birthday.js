        // Get the elements from the DOM
        const cardWrapper = document.querySelector('.birthdayCard');
        const cardInner = document.querySelector('.card-inner');
        const cardBody = document.querySelector('.body');
        const cardMessage = document.getElementById('card-message');

        // State variables for the drag functionality
        let isDragging = false;
        let startX = 0;
        let startRotation = 0;
        let maxDrag = 250; // The maximum drag distance in pixels to fully open the card (adjust as needed)

        // Function to handle both mouse and touch move events
        const handleDragMove = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent page scroll during drag

            // Get the current x position from either mouse or touch
            const currentX = e.touches ? e.touches[0].pageX : e.pageX;
            
            // Calculate the horizontal drag delta.
            // Dragging left (decreasing X) results in a positive delta.
            // Dragging right (increasing X) results in a negative delta.
            const dragDelta = startX - currentX;

            // Map the drag distance to a new rotation angle
            let newRotation = startRotation + (dragDelta / maxDrag) * 180;

            // Clamp the rotation angle so it stays within 0 and 180 degrees
            newRotation = Math.min(Math.max(newRotation, 0), 180);

            // Apply the new rotation transform to the card
            cardInner.style.transform = `rotateY(${newRotation}deg)`;
        };

        // Event listener for mouse down
        cardWrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            
            // Get the current rotation of the card when the drag starts
            const style = window.getComputedStyle(cardInner);
            const matrix = new DOMMatrix(style.transform);
            startRotation = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);
            
            // Prevent the transition from playing during drag for a smoother effect
            cardInner.style.transition = 'none';
            // Change cursor to indicate dragging
            cardWrapper.style.cursor = 'grabbing';
        });

        // Event listener for mouse move
        cardBody.addEventListener('mousemove', handleDragMove);

        // Event listener for mouse up
        cardBody.addEventListener('mouseup', () => {
            if (!isDragging) return;

            isDragging = false;
            // Restore the CSS transition for a smooth snapping effect
            cardInner.style.transition = 'transform 0.8s';
            // Restore the cursor
            cardWrapper.style.cursor = 'grab';

            // Get the final rotation angle
            const style = window.getComputedStyle(cardInner);
            const matrix = new DOMMatrix(style.transform);
            const rotation = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);
            
            // Update the message based on the card's final position
            if (rotation < 90) {
                cardMessage.textContent = 'Drag this card';
            } else {
                cardMessage.textContent = 'Happy Birthday!';
            }
        });

        // --- Touch events for mobile devices ---
        cardWrapper.addEventListener('touchstart', (e) => {
            isDragging = true;
            // Use the first touch point
            startX = e.touches[0].pageX;
            
            const style = window.getComputedStyle(cardInner);
            const matrix = new DOMMatrix(style.transform);
            startRotation = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);

            cardInner.style.transition = 'none';
        });

        cardBody.addEventListener('touchmove', handleDragMove);

        cardBody.addEventListener('touchend', () => {
            if (!isDragging) return;

            isDragging = false;
            cardInner.style.transition = 'transform 0.8s';

            const style = window.getComputedStyle(cardInner);
            const matrix = new DOMMatrix(style.transform);
            const rotation = Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI);

            if (rotation < 90) {
                cardMessage.textContent = 'Drag this card';
            } else {
                cardMessage.textContent = 'Happy Birthday!';
            }
        });
