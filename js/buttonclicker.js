let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  createTrail();
});

function createTrail() {
  const trail = document.createElement('div');
  trail.classList.add('trail');
  document.body.appendChild(trail);
  gsap.set(trail, {
    x: mouse.x - trail.offsetWidth / 2,
    y: mouse.y - trail.offsetHeight / 2,
    scale: 1,
    opacity: 1,
  });
  // Animate trail
  gsap.to(trail, {
    duration: 1,
    opacity: 0,
    scale: 0.5,
    ease: 'power2.out',
    onComplete: () => {
      trail.remove();
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let button = document.getElementById('button');

  // Define border radius (margin from screen edges)
  const borderRadius = 50; // pixels from edge

  let clicks = 0;

  button.addEventListener('click', () => {
    window.playButtonClick();
    clicks++;
    console.log(clicks);
    document.getElementById('clicks').innerHTML = clicks;

    // Get current window dimensions on each click
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;

    // Calculate bounds with border radius
    const minX = borderRadius;
    const maxX = containerWidth - buttonWidth - borderRadius;
    const minY = borderRadius;
    const maxY = containerHeight - buttonHeight - borderRadius;

    // Generate random position within bounds
    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    button.style.position = 'absolute';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';

    console.log(
      `Position: (${randomX}, ${randomY}) | Bounds: X(${minX}-${maxX}) Y(${minY}-${maxY})`
    );
  });

  // Handle window resize - keep button proportionally positioned
  window.addEventListener('resize', () => {
    const oldContainerWidth = window.innerWidth;
    const oldContainerHeight = window.innerHeight;

    // Get current button position
    const currentX = parseInt(button.style.left) || window.innerWidth / 2;
    const currentY = parseInt(button.style.top) || window.innerHeight / 2;

    // Calculate current position as percentages
    const xPercent = currentX / oldContainerWidth;
    const yPercent = currentY / oldContainerHeight;

    // Calculate new dimensions after resize
    setTimeout(() => {
      const newContainerWidth = window.innerWidth;
      const newContainerHeight = window.innerHeight;
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;

      // Calculate new position based on percentage
      let newX = xPercent * newContainerWidth;
      let newY = yPercent * newContainerHeight;

      // Get clicks counter dimensions for proper bounds
      const clicksElement = document.getElementById('clicks');
      const clicksHeight = clicksElement.offsetHeight;
      const clicksBottomMargin = 20;

      // Ensure button stays within bounds (including clicks counter)
      const minX = borderRadius;
      const maxX = newContainerWidth - buttonWidth - borderRadius;
      const minY = borderRadius + clicksHeight + clicksBottomMargin;
      const maxY = newContainerHeight - buttonHeight - borderRadius;

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      button.style.left = newX + 'px';
      button.style.top = newY + 'px';
    }, 10); // Small delay to ensure new dimensions are calculated
  });
});
