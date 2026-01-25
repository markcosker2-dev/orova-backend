const API_GENERATE = '/api/generate';
const API_ANALYZE = '/api/analyze_url';

// State
let selectedFiles = [];

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const btnGenerate = document.querySelector('.btn-generate');

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    console.log("Adquisition V3 Loaded");
    setupEventListeners();
});

function setupEventListeners() {
    // File Input
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    if (!files) return;
    selectedFiles = Array.from(files);
    updatePreview();
}

function updatePreview() {
    if (selectedFiles.length > 0) {
        filePreview.textContent = `Selected ${selectedFiles.length} file(s): ` + selectedFiles.map(f => f.name).join(', ');
        dropZone.style.borderColor = 'var(--primary)';
        dropZone.style.backgroundColor = 'rgba(229, 46, 113, 0.05)';
    } else {
        filePreview.textContent = '';
        dropZone.style.borderColor = '#e2e8f0';
        dropZone.style.backgroundColor = 'transparent';
    }
}

// --- URL Analysis Logic ---
async function analyzeUrl() {
    const url = document.getElementById('businessUrl').value;
    const btn = document.querySelector('.btn-analyze');

    if (!url) {
        alert("Please enter a URL first.");
        return;
    }

    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
        const response = await fetch(API_ANALYZE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) throw new Error("Analysis failed");

        const data = await response.json();

        if (data.product_name) {
            const el = document.getElementById('productName');
            el.value = data.product_name;
            flashField(el);
        }

        if (data.usp) {
            const el = document.getElementById('usp');
            el.value = data.usp;
            flashField(el);
        }

    } catch (e) {
        console.error(e);
        alert("Could not analyze URL. Please fill details manually.");
    } finally {
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }
}

function flashField(element) {
    element.style.backgroundColor = '#e0f2fe';
    setTimeout(() => element.style.backgroundColor = '', 500);
}

// --- Main Generation Logic ---
async function generateAd() {
    const productName = document.getElementById('productName').value;
    const targetAudience = document.getElementById('targetAudience').value;
    const usp = document.getElementById('usp').value;

    // UI Loading State
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const resultsSection = document.getElementById('results');

    btnText.textContent = "Architecting Campaign...";
    loader.style.display = 'block';
    btnGenerate.disabled = true;

    try {
        const formData = new FormData();
        formData.append('product_name', productName);
        formData.append('target_audience', targetAudience);
        formData.append('usp', usp);

        // Safety check for selectedFiles
        const filesToSend = selectedFiles || [];
        filesToSend.forEach(file => {
            formData.append('media', file);
        });

        // Fallback: Check input directly if array is empty but input has files
        if (filesToSend.length === 0 && fileInput.files.length > 0) {
            Array.from(fileInput.files).forEach(file => formData.append('media', file));
        }

        const response = await fetch(API_GENERATE, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Generation failed");

        const data = await response.json();

        // Render Results
        await renderResults(data);

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the Personal Engine. Check console for details.');
    } finally {
        btnText.textContent = "Launch Campaign 🚀";
        loader.style.display = 'none';
        btnGenerate.disabled = false;
    }
}

async function renderResults(data) {
    await new Promise(r => setTimeout(r, 800));

    // 1. Render Variations (3 Columns)
    const grid = document.getElementById('variationsGrid');
    grid.innerHTML = '';

    if (data.variations) {
        data.variations.forEach((ad, index) => {
            const card = document.createElement('div');
            card.className = 'result-card glass-panel';
            // Animation delay
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="card-header">
                    <div style="background:var(--primary); color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:12px;">${['A', 'B', 'C'][index]}</div>
                    <h3>${ad.angle}</h3>
                </div>
                <div class="card-body">
                    <p style="font-size:0.9rem; color:#64748B; margin-bottom:12px;"><em>${ad.description}</em></p>
                    <p><strong>Hook:</strong> ${ad.hook}</p>
                    <p><strong>Body:</strong> ${ad.body.replace(/\n/g, '<br>')}</p>
                    <p style="margin-top:12px; padding:12px; background:rgba(0,0,0,0.03); border-radius:8px;"><strong>🎨 Creative:</strong> ${ad.creative}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // 2. Render Targeting
    if (data.targeting) {
        const t = data.targeting;
        const targetingHtml = `
            <p><strong>🎯 Interests:</strong> ${t.interests}</p>
            <p><strong>👥 Behaviors:</strong> ${t.behaviors}</p>
            <p><strong>📊 Demographics:</strong> ${t.demographics}</p>
        `;
        document.getElementById('resultTargeting').innerHTML = targetingHtml;
    }

    // 3. Render Budget
    if (data.budget) {
        const b = data.budget;
        const budgetHtml = `
            <div style="text-align:center; margin-bottom:16px;">
                <div style="font-size:2rem; font-weight:800; color:var(--primary);">${b.daily_spend}</div>
                <div style="font-size:0.9rem; color:#64748B;">Recommended Daily Spend</div>
            </div>
            <hr style="border:0; border-top:1px solid rgba(0,0,0,0.1); margin:16px 0;">
            <p><strong>📉 Split:</strong> ${b.split}</p>
            <p><strong>⏳ Duration:</strong> ${b.testing_duration}</p>
        `;
        document.getElementById('resultBudget').innerHTML = budgetHtml;
    }

    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}
