// Slide Deck Navigation and Interactive Elements Controller

document.addEventListener('DOMContentLoaded', () => {
  // --- Slide Deck Logic ---
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const slideIndicator = document.getElementById('slide-indicator');
  
  let currentSlideIndex = 1;
  const totalSlides = slides.length;

  // Create dot indicators
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('indicator-dot');
    if (i === 1) dot.classList.add('active');
    dot.setAttribute('data-target', i);
    dot.setAttribute('aria-label', `Go to slide ${i}`);
    slideIndicator.appendChild(dot);
    
    dot.addEventListener('click', () => {
      goToSlide(i);
    });
  }

  const dots = document.querySelectorAll('.indicator-dot');

  function updateControls() {
    prevBtn.disabled = currentSlideIndex === 1;
    nextBtn.disabled = currentSlideIndex === totalSlides;
    
    dots.forEach((dot, idx) => {
      if (idx + 1 === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    if (index < 1 || index > totalSlides) return;
    
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    const activeSlide = document.getElementById(`slide-${index}`);
    if (activeSlide) {
      activeSlide.classList.add('active');
      currentSlideIndex = index;
      updateControls();
    }
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlideIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlideIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(currentSlideIndex - 1);
    }
  });

  // --- View Mode Toggle Logic (Clean vs Detailed) ---
  const modeToggle = document.getElementById('mode-toggle');
  
  modeToggle.addEventListener('change', () => {
    if (modeToggle.checked) {
      document.body.classList.remove('mode-clean');
      document.body.classList.add('mode-detailed');
    } else {
      document.body.classList.remove('mode-detailed');
      document.body.classList.add('mode-clean');
    }
  });

  // --- Fullscreen Toggle Logic ---
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // --- Facility Image Gallery Logic ---
  const facilityImages = [
    '1000015877.jpg',
    '1000015883.jpg',
    '1000015885.jpg',
    '1000015879.jpg',
    '1000015882.jpg',
    '1000015884.jpg',
    '1000015881.jpg',
    '1000015880.jpg',
    '1000015899.jpg',
    '1000015894.jpg',
    '1000015896.jpg',
    '1000015900.jpg',
    '1000015901.jpg',
    '1000015895.jpg',
    '1000015893.jpg'
  ];

  const mainImg = document.getElementById('gallery-main-img');
  const prevImgBtn = document.getElementById('gallery-prev');
  const nextImgBtn = document.getElementById('gallery-next');
  const counterSpan = document.getElementById('gallery-counter');
  const thumbsContainer = document.getElementById('gallery-thumbs');
  
  let currentImgIndex = 0;

  // Build thumbnails
  facilityImages.forEach((imgFile, idx) => {
    const imgElement = document.createElement('img');
    imgElement.src = `assets/images/${imgFile}`;
    imgElement.alt = `Thumbnail ${idx + 1}`;
    imgElement.classList.add('thumb');
    if (idx === 0) imgElement.classList.add('active');
    
    imgElement.addEventListener('click', () => {
      selectImage(idx);
    });
    thumbsContainer.appendChild(imgElement);
  });

  const thumbs = document.querySelectorAll('.thumb');

  function selectImage(index) {
    if (index < 0 || index >= facilityImages.length) return;
    currentImgIndex = index;
    mainImg.src = `assets/images/${facilityImages[currentImgIndex]}`;
    counterSpan.textContent = `Image ${currentImgIndex + 1} of ${facilityImages.length}`;
    
    thumbs.forEach((thumb, idx) => {
      if (idx === currentImgIndex) {
        thumb.classList.add('active');
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  prevImgBtn.addEventListener('click', () => {
    let nextIndex = currentImgIndex - 1;
    if (nextIndex < 0) nextIndex = facilityImages.length - 1;
    selectImage(nextIndex);
  });

  nextImgBtn.addEventListener('click', () => {
    let nextIndex = currentImgIndex + 1;
    if (nextIndex >= facilityImages.length) nextIndex = 0;
    selectImage(nextIndex);
  });

  // --- SVG Financial Projections Chart Logic ---
  function drawProjectionsChart() {
    const chartDiv = document.getElementById('projection-chart');
    if (!chartDiv) return;

    // Financial numbers from CSV summary
    // Base Case: Net Rev $4.58M, OpEx $1.75M, NOI $2.83M
    // Low Case: Net Rev $3.57M, OpEx $1.75M, NOI $1.82M
    // High Case: Net Rev $5.27M, OpEx $1.75M, NOI $3.52M
    const data = [
      { label: 'Low (78%)', netRev: 2.92, opex: 2.19, noi: 0.73 },
      { label: 'Base Case', netRev: 3.75, opex: 2.19, noi: 1.56 },
      { label: 'High (115%)', netRev: 4.31, opex: 2.19, noi: 2.12 }
    ];

    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const maxVal = 5.0; // Max vertical scale in $ Millions

    let svgHtml = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;

    // Draw Grid Lines & Y Axis Labels
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const val = (maxVal / gridLines) * i;
      const y = chartHeight + paddingTop - (chartHeight * (val / maxVal));
      svgHtml += `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
        <text x="${paddingLeft - 8}" y="${y + 4}" fill="rgba(255, 255, 255, 0.4)" font-size="8" text-anchor="end">$${val.toFixed(1)}M</text>
      `;
    }

    const groupWidth = chartWidth / data.length;
    const barSpacing = 6;
    const barWidth = (groupWidth - barSpacing * 4) / 3;

    data.forEach((group, groupIdx) => {
      const groupX = paddingLeft + (groupIdx * groupWidth);
      
      // Calculate Bar Heights (normalized to chartHeight)
      const revHeight = chartHeight * (group.netRev / maxVal);
      const opexHeight = chartHeight * (group.opex / maxVal);
      const noiHeight = chartHeight * (group.noi / maxVal);

      // X positions of individual bars inside the group
      const revX = groupX + barSpacing;
      const opexX = revX + barWidth + barSpacing;
      const noiX = opexX + barWidth + barSpacing;

      // Y positions
      const revY = chartHeight + paddingTop - revHeight;
      const opexY = chartHeight + paddingTop - opexHeight;
      const noiY = chartHeight + paddingTop - noiHeight;

      svgHtml += `
        <!-- Net Revenue Bar (Base color or subtle tint) -->
        <rect x="${revX}" y="${revY}" width="${barWidth}" height="${revHeight}" class="chart-bar-base" rx="2" />
        <text x="${revX + barWidth/2}" y="${revY - 4}" class="chart-value">$${group.netRev.toFixed(2)}M</text>

        <!-- OpEx Bar (Greyed out) -->
        <rect x="${opexX}" y="${opexY}" width="${barWidth}" height="${opexHeight}" class="chart-bar-low" rx="2" />
        <text x="${opexX + barWidth/2}" y="${opexY - 4}" class="chart-value">$${group.opex.toFixed(2)}M</text>

        <!-- NOI Bar (Highlight Yellow) -->
        <rect x="${noiX}" y="${noiY}" width="${barWidth}" height="${noiHeight}" class="chart-bar-high" rx="2" />
        <text x="${noiX + barWidth/2}" y="${noiY - 4}" class="chart-value">$${group.noi.toFixed(2)}M</text>

        <!-- Group Label -->
        <text x="${groupX + groupWidth/2}" y="${chartHeight + paddingTop + 18}" class="chart-label">${group.label}</text>
      `;
    });

    // Draw Legend
    const legendY = paddingTop - 12;
    svgHtml += `
      <g transform="translate(${width - 240}, ${legendY})">
        <rect x="0" y="-6" width="8" height="8" fill="var(--color-blue)" rx="1"/>
        <text x="12" y="1" class="chart-legend">Net Revenue</text>
        
        <rect x="80" y="-6" width="8" height="8" fill="rgba(255,255,255,0.15)" rx="1"/>
        <text x="92" y="1" class="chart-legend">OpEx</text>
        
        <rect x="140" y="-6" width="8" height="8" fill="var(--color-yellow)" rx="1"/>
        <text x="152" y="1" class="chart-legend">Ecosystem NOI</text>
      </g>
    `;

    svgHtml += `</svg>`;
    chartDiv.innerHTML = svgHtml;
  }

  // Initial draw
  drawProjectionsChart();
  
  // Redraw on window resize to ensure responsiveness
  window.addEventListener('resize', drawProjectionsChart);
});
