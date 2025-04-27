function formatElectronConfiguration(config) {
  return config.replace(/([spdfg])(\d+)/g, (_, l, n) => `${l}<sup>${n}</sup>`);
}

function showElementDetails(element) {
  const modal = document.getElementById('element-modal');
  const modalBody = document.getElementById('modal-body');

  const modelPath = `/models/element_${String(element.number).padStart(3, '0')}_${element.name.toLowerCase()}.glb`;

  modalBody.innerHTML = `
    <span id="close-modal">&times;</span>
    <model-viewer src="${modelPath}" auto-rotate camera-controls background-color="#fff"
      style="width: 100%; height: 300px;"></model-viewer>
    <h1>${element.name} (${element.symbol})</h1>
    <p><strong>Atomic Number:</strong> ${element.number}</p>
    <p><strong>Atomic Mass:</strong> ${element.atomic_mass}</p>
    <p><strong>Category:</strong> ${element.category}</p>
    <p><strong>Electron Configuration:</strong> ${formatElectronConfiguration(element.electron_configuration)}</p>
    <p><strong>Phase:</strong> ${element.phase}</p>
    <p><strong>Shells:</strong> ${element.shells?.join(', ')}</p>
    <p><strong>Summary:</strong> ${element.summary}</p>
  `;

  modal.style.display = "flex";
  document.getElementById('close-modal').onclick = () => modal.style.display = "none";
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
}

function renderElements(elements) {
  const container = document.getElementById('periodic-table-container');
  container.innerHTML = '';

  elements.forEach(el => {
    const div = document.createElement('div');
    div.className = 'element';

    if (el.number === 57 || el.number === 89) {
      div.style.gridColumnStart = 3;
      div.style.gridRowStart = el.period;
    } else if (el.number >= 58 && el.number <= 71) {
      div.style.gridColumnStart = el.number - 54;
      div.style.gridRowStart = 8;
    } else if (el.number >= 90 && el.number <= 103) {
      div.style.gridColumnStart = el.number - 86;
      div.style.gridRowStart = 9;
    } else {
      div.style.gridColumnStart = el.group;
      div.style.gridRowStart = el.period;
    }

    const cat = el.category.toLowerCase();
    if (cat.includes('alkali') && !cat.includes('earth')) div.classList.add('alkali');
    else if (cat.includes('alkaline')) div.classList.add('alkaline');
    else if (cat.includes('transition')) div.classList.add('transition');
    else if (cat.includes('post')) div.classList.add('post-transition');
    else if (cat.includes('metalloid')) div.classList.add('metalloid');
    else if (cat.includes('reactive')) div.classList.add('reactive');
    else if (cat.includes('noble')) div.classList.add('noble');
    else if (cat.includes('lanthanide')) div.classList.add('lanthanide');
    else if (cat.includes('actinide')) div.classList.add('actinide');
    else div.classList.add('unknown');

    div.innerHTML = `
      <div class="number">${el.number}</div>
      <div class="symbol">${el.symbol}</div>
      <div class="name">${el.name}</div>
    `;

    div.onclick = () => showElementDetails(el);
    container.appendChild(div);
  });
}

function setupFilters(data) {
  const filters = document.getElementById('category-buttons');
  const categories = [
    'alkali', 'alkaline', 'transition', 'post-transition',
    'metalloid', 'reactive', 'noble', 'lanthanide', 'actinide', 'unknown'
  ];

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.replace('-', ' ');
    btn.className = cat;
    btn.onclick = () => {
      renderElements(data.elements.filter(e => e.category.toLowerCase().includes(cat)));
    };
    filters.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('/elements')
    .then(res => res.json())
    .then(data => {
      renderElements(data.elements);
      setupFilters(data);

      const search = document.getElementById('search-box');
      search.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        const filtered = data.elements.filter(el =>
          el.name.toLowerCase().includes(term) ||
          el.symbol.toLowerCase().includes(term) ||
          String(el.number) === term
        );
        renderElements(filtered);
      });
    });
});
