/**
 * MARK ZAP UI MANAGER MODULE
 * Handles DOM rendering, filtering, search, and proposal modal popups
 */
import { LEADS_DATA } from './data.js';
import { exportLeadsToPDF } from './pdfExporter.js';

let activeFilter = 'all';

export function initApp() {
  renderLeads(LEADS_DATA);

  // Setup Event Listeners for Filters
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.dataset.region || 'all';
      filterAndSearch();
    });
  });

  // Setup Live Search Listener
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterAndSearch);
  }

  // Setup PDF Export Button Listener
  const pdfBtn = document.getElementById('downloadPdfBtn');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => exportLeadsToPDF(LEADS_DATA));
  }

  // Modal Close Listeners
  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeProposalModal);
  }

  const copyBtn = document.getElementById('modalCopyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyModalProposal);
  }
}

function filterAndSearch() {
  const query = (document.getElementById('searchInput')?.value || '').toLowerCase();
  
  const filtered = LEADS_DATA.filter(lead => {
    const matchesRegion = activeFilter === 'all' || lead.region === activeFilter;
    const matchesQuery = 
      lead.name.toLowerCase().includes(query) || 
      lead.loc.toLowerCase().includes(query) || 
      lead.type.toLowerCase().includes(query);

    return matchesRegion && matchesQuery;
  });

  renderLeads(filtered);
}

function renderLeads(leads) {
  const grid = document.getElementById('leadsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  if (leads.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.5); padding: 40px;">No matching prospect leads found.</div>`;
    return;
  }

  leads.forEach(lead => {
    const card = document.createElement('div');
    card.className = 'lead-card';
    card.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div class="card-title">${lead.name}</div>
            <div class="card-location">${lead.type} • ${lead.loc}</div>
          </div>
          <span class="status-badge">❌ No Website</span>
        </div>
        <div class="card-meta" style="margin-top:14px;">
          <div class="meta-item"><strong>Est. Revenue:</strong> <span>${lead.rev}</span></div>
          <div class="meta-item"><strong>Rating:</strong> <span>${lead.rating}</span></div>
          <div class="meta-item"><strong>Phone:</strong> <span>${lead.phone}</span></div>
          <div class="meta-item"><strong>Email:</strong> <span>${lead.email}</span></div>
        </div>
      </div>
      <div class="why-box">
        <strong>💡 Why They Will Build From Us:</strong> ${lead.why}
      </div>
      <div class="card-actions">
        <a href="${lead.gmaps}" target="_blank" rel="noopener noreferrer" class="btn-maps">📍 Google Maps</a>
        <button class="btn-proposal" data-id="${lead.id}">✅ Generate Proposal</button>
      </div>
    `;

    const propBtn = card.querySelector('.btn-proposal');
    if (propBtn) {
      propBtn.addEventListener('click', () => openProposalModal(lead));
    }

    grid.appendChild(card);
  });
}

function openProposalModal(lead) {
  const modal = document.getElementById('proposalModal');
  const title = document.getElementById('modalTitle');
  const meta = document.getElementById('modalMeta');
  const text = document.getElementById('modalText');

  if (!modal || !title || !meta || !text) return;

  title.innerText = `✉️ Custom Sales Proposal for ${lead.name}`;
  meta.innerText = `Target: ${lead.name} (${lead.email}) • ${lead.loc}`;
  text.innerText = 
`Subject: High-converting website proposal for ${lead.name}

Hi Team ${lead.name},

I came across ${lead.name} on Google Maps in ${lead.loc}. You have an impressive reputation with ${lead.rating}, but I noticed you currently do not have a dedicated online booking website.

At Mark Zap, we build modern, high-speed websites for local businesses. Based on your location and lead volume, a custom website with online appointment booking can capture an estimated 30+ new customer bookings every week.

Would you be open to a 5-minute preview of a custom website design concept we prepared for ${lead.name}?

Best regards,
Mark Zap Digital Agency
Phone: ${lead.phone}`;

  modal.style.display = 'flex';
}

function closeProposalModal() {
  const modal = document.getElementById('proposalModal');
  if (modal) modal.style.display = 'none';
}

function copyModalProposal() {
  const text = document.getElementById('modalText')?.innerText || '';
  navigator.clipboard.writeText(text);
  alert('Proposal text copied to clipboard!');
}

document.addEventListener('DOMContentLoaded', initApp);
