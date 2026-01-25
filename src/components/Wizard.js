import { CampaignStorage } from '../utils/storage.js';

export default class Wizard {
    constructor() {
        this.step = 1;
        this.data = {
            url: '',
            landingPageUrl: '',
            location: '',
            businessIntelligence: null,
            results: null
        };
        this.container = null;
    }

    render() {
        const container = document.createElement('div');
        container.id = 'wizard-container';
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            overflow: hidden;
        `;

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; max-width: 900px; margin: 0 auto; width: 100%; padding: 20px; box-sizing: border-box;">
                <header style="flex-shrink: 0; text-align: center; margin-bottom: 24px;">
                    <h1 style="font-size: 2rem; margin-bottom: 12px;">🤖 AI Campaign Launchpad</h1>
                    <div id="step-indicators" style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                        ${this.stepIndicator(1, 'Deep Analysis')}
                        ${this.stepIndicator(2, 'Location')}
                        ${this.stepIndicator(3, 'AI-Generated Ads')}
                    </div>
                </header>

                <div id="step-content" class="glass-panel" style="
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                    min-height: 0;
                ">
                    <!-- Dynamic Content -->
                </div>
            </div>
        `;

        this.container = container;
        setTimeout(() => this.renderStep(container.querySelector('#step-content')), 0);

        return container;
    }

    stepIndicator(num, label) {
        const isActive = num === this.step;
        const isComplete = num < this.step;

        return `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="
                    width: 32px; 
                    height: 32px; 
                    border-radius: 50%; 
                    background: ${isComplete ? 'rgba(16, 185, 129, 0.3)' : isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.1)'}; 
                    border: 2px solid ${isComplete ? '#34d399' : isActive ? '#60a5fa' : 'rgba(255,255,255,0.2)'};
                    display: grid; 
                    place-items: center;
                    font-weight: 700;
                    color: ${isComplete ? '#34d399' : isActive ? '#60a5fa' : 'var(--text-secondary)'};
                ">
                    ${isComplete ? '<i class="fas fa-check"></i>' : num}
                </div>
                <span style="font-size: 0.9rem; color: ${isActive ? 'white' : 'var(--text-secondary)'}; font-weight: ${isActive ? '600' : '400'};">
                    ${label}
                </span>
            </div>
        `;
    }

    renderStep(container) {
        container.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i></div>';

        if (this.step === 1) {
            this.renderStep1(container);
        } else if (this.step === 2) {
            this.renderStep2(container);
        } else if (this.step === 3) {
            this.renderStep3(container);
        }
    }

    updateWizard() {
        const stepContent = this.container.querySelector('#step-content');
        const indicators = this.container.querySelector('#step-indicators');

        indicators.innerHTML = `
            ${this.stepIndicator(1, 'Deep Analysis')}
            ${this.stepIndicator(2, 'Location')}
            ${this.stepIndicator(3, 'AI-Generated Ads')}
        `;

        this.renderStep(stepContent);
    }

    // ============ STEP 1: DEEP ANALYSIS ============
    renderStep1(container) {
        container.innerHTML = `
            <h2 style="margin-bottom: 8px;">🧠 Deep Business Intelligence</h2>
            <p style="color: var(--text-secondary); margin-bottom: 32px;">Enter your business website. AI will analyze your entire site to understand your business, audience, pain points, and unique value.</p>

            <div style="margin-bottom: 24px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Business Website URL</label>
                <div style="display: flex; gap: 12px;">
                    <input type="text" class="glass-input" id="urlInput" placeholder="https://yourbusiness.com" value="${this.data.url}">
                    <button class="btn-primary" id="analyzeBtn" style="white-space: nowrap;">
                        <i class="fas fa-brain"></i> Deep Analyze
                    </button>
                </div>
            </div>
            
            <div style="margin-bottom: 24px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Landing Page URL <span style="font-size: 0.85rem; color: var(--text-secondary);">(Optional)</span></label>
                <input type="text" class="glass-input" id="landingPageInput" placeholder="https://yourbusiness.com/signup" value="${this.data.landingPageUrl || ''}">
                <div style="margin-top: 8px; font-size: 0.8rem; color: var(--text-secondary);">
                    <i class="fas fa-info-circle"></i> We'll analyze this page for conversion optimization
                </div>
            </div>

            <div id="loading" style="display: none;">
                <div style="text-align: center; padding: 60px 20px; background: rgba(139, 92, 246, 0.05); border-radius: 16px;">
                    <i class="fas fa-brain spinner" style="font-size: 3rem; color: var(--accent-purple); margin-bottom: 24px;"></i>
                    <h3 style="margin-bottom: 12px; color: white;">🧠 Deep Learning Your Business...</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 32px;">This may take 10-15 seconds</p>
                    <div class="progress-steps" id="progressSteps" style="text-align: left; max-width: 400px; margin: 0 auto;">
                        <div class="step" style="padding: 8px 0; color: var(--text-secondary); opacity: 0.3; transition: all 0.3s;">📄 Scraping website content...</div>
                        <div class="step" style="padding: 8px 0; color: var(--text-secondary); opacity: 0.3; transition: all 0.3s;">🎯 Identifying target audience...</div>
                        <div class="step" style="padding: 8px 0; color: var(--text-secondary); opacity: 0.3; transition: all 0.3s;">💡 Extracting value propositions...</div>
                        <div class="step" style="padding: 8px 0; color: var(--text-secondary); opacity: 0.3; transition: all 0.3s;">🔍 Analyzing pain points...</div>
                        <div class="step" style="padding: 8px 0; color: var(--text-secondary); opacity: 0.3; transition: all 0.3s;">✅ Building intelligence profile...</div>
                    </div>
                </div>
            </div>

            <div id="results-container"></div>

            <div style="display: flex; justify-content: flex-end; margin-top: 40px;">
                <button class="btn-primary" id="nextBtn" disabled>Continue to Location <i class="fas fa-arrow-right"></i></button>
            </div>
        `;

        const analyzeBtn = container.querySelector('#analyzeBtn');
        const nextBtn = container.querySelector('#nextBtn');
        const loading = container.querySelector('#loading');
        const urlInput = container.querySelector('#urlInput');
        const landingPageInput = container.querySelector('#landingPageInput');

        analyzeBtn.addEventListener('click', async () => {
            const url = urlInput.value.trim();
            const landingPageUrl = landingPageInput.value.trim();

            if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
                alert('Please enter a valid URL starting with http:// or https://');
                return;
            }

            this.data.url = url;
            this.data.landingPageUrl = landingPageUrl;

            analyzeBtn.disabled = true;
            loading.style.display = 'block';

            // Animate progress steps
            const steps = loading.querySelectorAll('.step');
            steps.forEach((step, i) => {
                setTimeout(() => {
                    step.style.opacity = '1';
                    step.style.color = 'var(--accent-blue)';
                    step.style.fontWeight = '600';
                }, i * 1200);
            });

            try {
                const res = await fetch('/api/deep_analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });

                if (!res.ok) throw new Error("Analysis failed");

                const data = await res.json();
                this.data.businessIntelligence = data.intelligence;

                loading.style.display = 'none';

                // Show comprehensive results
                this.displayBusinessIntel(container.querySelector('#results-container'), data.intelligence);

                analyzeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Analysis Complete';
                analyzeBtn.style.background = 'rgba(16, 185, 129, 0.8)';
                nextBtn.disabled = false;

            } catch (e) {
                console.error(e);
                loading.style.display = 'none';
                analyzeBtn.disabled = false;

                // Enhanced error handling with specific messages
                const errorResponse = await e.response?.json().catch(() => null);

                if (errorResponse && errorResponse.error_code === 'MISSING_API_KEY') {
                    // Show detailed error message for missing API key
                    container.querySelector('#results-container').innerHTML = `
                        <div style="background: rgba(251, 146, 60, 0.1); border: 2px solid rgba(251, 146, 60, 0.3); padding: 24px; border-radius: 12px; margin-top: 24px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #fb923c;"></i>
                                <div>
                                    <div style="font-weight: 700; font-size: 1.2rem; color: #fb923c; margin-bottom: 4px;">AI Analysis Not Configured</div>
                                    <div style="color: var(--text-secondary); font-size: 0.9rem;">The GEMINI_API_KEY environment variable is not set on the server</div>
                                </div>
                            </div>
                            <div style="padding: 16px; background: rgba(0,0,0,0.3); border-radius: 8px; margin-top: 16px;">
                                <div style="font-size: 0.9rem; color: white; margin-bottom: 12px;"><strong>To enable AI-powered Deep Analysis:</strong></div>
                                <ol style="margin-left: 20px; color: var(--text-secondary); line-height: 1.8; font-size: 0.85rem;">
                                    <li>Get a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #60a5fa; text-decoration: none;">Google AI Studio →</a></li>
                                    <li>Set the <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">GEMINI_API_KEY</code> environment variable on your server</li>
                                    <li>Restart the Flask server</li>
                                </ol>
                            </div>
                            <div style="margin-top: 16px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary);">
                                <i class="fas fa-lightbulb" style="color: #60a5fa;"></i>
                                <strong>Alternative:</strong> You can still use the basic campaign wizard from the dashboard (legacy mode).
                            </div>
                        </div>
                    `;
                } else {
                    // Generic error message
                    alert('Analysis failed. ' + (errorResponse?.error || 'Please check the URL and try again.'));
                }
            }
        });

        nextBtn.addEventListener('click', () => {
            this.step++;
            this.updateWizard();
        });
    }

    displayBusinessIntel(container, intel) {
        container.innerHTML = `
            <div class="fade-in" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); padding: 32px; border-radius: 16px; margin-top: 24px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                    <div style="width: 50px; height: 50px; background: rgba(16, 185, 129, 0.2); border-radius: 50%; display: grid; place-items: center;">
                        <i class="fas fa-brain" style="color: #34d399; font-size: 1.5rem;"></i>
                    </div>
                    <div>
                        <div style="color: #34d399; font-weight: 700; font-size: 1.3rem;">Business Intelligence Extracted</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem;">Ready to generate AI-powered ads</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                    <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 1px; margin-bottom: 8px;">🏢 Business</div>
                        <div style="color: white; font-weight: 600; font-size: 1.1rem;">${intel.business_name}</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px;">${intel.industry}</div>
                    </div>
                    
                    <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 1px; margin-bottom: 8px;">🎯 Target Audience</div>
                        <div style="color: white; font-weight: 600;">${intel.target_audience}</div>
                    </div>
                    
                    <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px; grid-column: 1 / -1;">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 1px; margin-bottom: 8px;">😫 Pain Points Detected</div>
                        <div style="color: white; line-height: 1.6;">
                            ${intel.main_pain_points.map(p => `• ${p}`).join('<br>')}
                        </div>
                    </div>
                    
                    <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px; grid-column: 1 / -1;">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 1px; margin-bottom: 8px;">✨ Unique Value</div>
                        <div style="color: white; line-height: 1.6;">
                            ${intel.unique_value_props.map(v => `• ${v}`).join('<br>')}
                        </div>
                    </div>
                    
                    <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 1px; margin-bottom: 8px;">🎁 Current Offer</div>
                        <div style="color: #60a5fa; font-weight: 600;">${intel.current_offer}</div>
                    </div>
                    
                    <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 1px; margin-bottom: 8px;">💰 Price Tier</div>
                        <div style="color: #a78bfa; font-weight: 600;">${intel.price_point}</div>
                    </div>
                    
                    <div style="padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px;">
                        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 1px; margin-bottom: 8px;">🎭 Brand Voice</div>
                        <div style="color: white; font-weight: 600;">${intel.brand_voice}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // ============ STEP 2: LOCATION ============
    renderStep2(container) {
        container.innerHTML = `
            <h2 style="margin-bottom: 8px;">🌍 Target Market Location</h2>
            <p style="color: var(--text-secondary); margin-bottom: 32px;">Specify your target geographic market. AI will adapt ad copy, currency symbols, and cultural nuances automatically.</p>

            <div style="margin-bottom: 32px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">🌍 Target Location</label>
                <input type="text" class="glass-input" id="locInput" placeholder="e.g. Los Angeles, Bangkok, London, or Global" value="${this.data.location}" style="font-size: 1.1rem; padding: 16px;">
                <div style="margin-top: 12px; font-size: 0.85rem; color: var(--text-secondary);">
                    <i class="fas fa-lightbulb"></i> Examples: "Bangkok" (Thai Baht), "London" (British Pound), "New York" (US Dollar)
                </div>
            </div>

            <div style="padding: 20px; background: rgba(139, 92, 246, 0.1); border-radius: 12px; margin-bottom: 32px;">
                <div style="font-weight: 600; margin-bottom: 8px; color: #a78bfa;">
                    <i class="fas fa-magic"></i> What AI Will Do Next:
                </div>
                <ul style="color: var(--text-secondary); line-height: 1.8; margin-left: 20px;">
                    <li>Generate 3 persuasive ad variations (Cold, Warm, Hot traffic)</li>
                    <li>Create detailed creative briefs for each ad</li>
                    <li>Build multi-stage targeting strategy</li>
                    <li>Calculate location-aware budget recommendations</li>
                    ${this.data.landingPageUrl ? '<li>Validate your landing page for conversion optimization</li>' : ''}
                </ul>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                <button class="btn-ghost" id="backBtn"><i class="fas fa-arrow-left"></i> Back</button>
                <button class="btn-primary" id="generateBtn" style="font-size: 1.1rem; padding: 14px 28px;">
                    <i class="fas fa-wand-magic-sparkles"></i> Generate Perfect Ads with AI
                </button>
            </div>
        `;

        const locInput = container.querySelector('#locInput');

        container.querySelector('#backBtn').addEventListener('click', () => {
            this.step--;
            this.updateWizard();
        });

        container.querySelector('#generateBtn').addEventListener('click', async () => {
            this.data.location = locInput.value || 'Global';

            // Show AI working animation
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 500px;">
                    <i class="fas fa-wand-magic-sparkles spinner" style="font-size: 4rem; color: var(--accent-purple); margin-bottom: 32px;"></i>
                    <h3 style="font-size: 1.8rem; margin-bottom: 16px; color: white;">🤖 AI Copywriter Working...</h3>
                    <p style="color: var(--text-secondary); font-size: 1.1rem; max-width: 500px; text-align: center; line-height: 1.6; margin-bottom: 32px;">
                        Analyzing ${this.data.businessIntelligence.business_name}'s unique positioning to create 3 scroll-stopping ad variations optimized for ${this.data.location}
                    </p>
                    <div style="text-align: center; color: var(--text-secondary); font-size: 0.95rem;">
                        <div class="pulse" style="margin-bottom: 12px; animation: pulse 2s infinite;">✍️ Writing persuasive hooks...</div>
                        <div class="pulse" style="margin-bottom: 12px; animation: pulse 2s infinite; animation-delay: 0.5s;">🎨 Designing creative concepts...</div>
                        <div class="pulse" style="animation: pulse 2s infinite; animation-delay: 1s;">🎯 Calibrating targeting strategy...</div>
                    </div>
                </div>
                <style>
                    @keyframes pulse {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 1; }
                    }
                </style>
            `;

            try {
                const formData = new FormData();
                formData.append('business_intelligence', JSON.stringify(this.data.businessIntelligence));
                formData.append('location', this.data.location);
                formData.append('landing_page_url', this.data.landingPageUrl || '');

                const res = await fetch('/api/generate', {
                    method: 'POST',
                    body: formData
                });

                if (!res.ok) throw new Error("Generation failed");

                const data = await res.json();
                this.data.results = data;

                this.step++;
                this.updateWizard();

            } catch (e) {
                console.error(e);
                alert('AI generation failed. Make sure ANTHROPIC_API_KEY is set. Error: ' + e.message);
                this.step--;
                this.updateWizard();
            }
        });
    }

    // ============ STEP 3: AI-GENERATED ADS ============
    renderStep3(container) {
        const vars = this.data.results?.variations || [];
        const targeting = this.data.results?.targeting_strategy || {};
        const budget = this.data.results?.budget_recommendation || {};
        const lpAnalysis = this.data.results?.landing_page_analysis || null;

        container.innerHTML = `
            <h2 style="margin-bottom: 8px;">✨ AI-Generated Campaign</h2>
            <p style="color: var(--text-secondary); margin-bottom: 32px;">3 persuasive ad variations created by AI, each optimized for a different stage of the customer journey.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 32px;">
                ${vars.map((ad, i) => this.aiAdCard(ad, i)).join('')}
            </div>

            ${this.targetingDisplay(targeting)}

            ${this.budgetDisplay(budget)}

            ${lpAnalysis ? this.landingPageDisplay(lpAnalysis) : ''}

            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                <button class="btn-ghost" id="backBtn"><i class="fas fa-arrow-left"></i> Refine Location</button>
                <button class="btn-primary" id="downloadBtn">
                    <i class="fas fa-file-download"></i> Download CSV for Meta Ads Manager
                </button>
            </div>
        `;

        container.querySelector('#backBtn').addEventListener('click', () => {
            this.step--;
            this.updateWizard();
        });

        // Copy button handlers
        container.querySelectorAll('.copy-ad-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.copyAdText(index);
            });
        });

        // Creative brief toggle handlers
        container.querySelectorAll('.toggle-brief').forEach((btn) => {
            btn.addEventListener('click', () => {
                const briefContent = btn.nextElementSibling;
                const isVisible = briefContent.style.display !== 'none';
                briefContent.style.display = isVisible ? 'none' : 'block';
                btn.innerHTML = isVisible
                    ? '<i class="fas fa-chevron-down"></i> Show Creative Brief'
                    : '<i class="fas fa-chevron-up"></i> Hide Creative Brief';
            });
        });

        // Download CSV handler
        container.querySelector('#downloadBtn').addEventListener('click', async () => {
            const downloadBtn = container.querySelector('#downloadBtn');

            try {
                const campaignData = {
                    product: this.data.businessIntelligence.business_name,
                    location: this.data.location,
                    audience: this.data.businessIntelligence.target_audience,
                    variations: this.data.results.variations,
                    budget: this.data.results.budget_recommendation,
                    targeting: this.data.results.targeting_strategy.cold_audience || {}
                };

                const res = await fetch('/api/export_csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(campaignData)
                });

                if (res.ok) {
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${this.data.businessIntelligence.business_name.replace(/\s/g, '_')}_AI_Campaign_${Date.now()}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);

                    // Save campaign to localStorage
                    const campaignId = CampaignStorage.save({
                        productName: this.data.businessIntelligence.business_name,
                        location: this.data.location,
                        audience: this.data.businessIntelligence.target_audience,
                        url: this.data.url,
                        usp: this.data.businessIntelligence.unique_value_props[0],
                        variations: this.data.results.variations,
                        budget: this.data.results.budget_recommendation,
                        targeting: this.data.results.targeting_strategy,
                        aiGenerated: true
                    });

                    downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                    downloadBtn.style.background = 'rgba(16, 185, 129, 0.8)';

                    downloadBtn.insertAdjacentHTML('afterend', `
                        <div class="fade-in" style="color: #34d399; font-size: 0.85rem; margin-top: 12px; text-align: right;">
                            <i class="fas fa-check-circle"></i> Campaign saved to history (#${campaignId})
                        </div>
                    `);
                } else {
                    throw new Error('Export failed');
                }
            } catch (e) {
                console.error(e);
                alert('CSV export failed. Please try again.');
            }
        });
    }

    aiAdCard(ad, index) {
        const colors = [
            { accent: '#60a5fa', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', label: 'COLD' },
            { accent: '#a78bfa', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', label: 'WARM' },
            { accent: '#34d399', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', label: 'HOT' }
        ];
        const color = colors[index % 3];

        return `
            <div class="glass-panel" style="position: relative; padding: 24px; border: 2px solid ${color.border}; transition: all 0.3s;">
                <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 8px;">
                    <span style="padding: 4px 12px; background: ${color.bg}; color: ${color.accent}; border-radius: 6px; font-size: 0.7rem; font-weight: 700;">${color.label} TRAFFIC</span>
                    <button class="copy-ad-btn" data-index="${index}" style="padding: 6px 12px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>

                <div style="margin-top: 32px; margin-bottom: 16px;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; color: ${color.accent}; letter-spacing: 1px; margin-bottom: 8px;">${ad.angle}</div>
                    <h4 style="font-size: 1.2rem; color: white; font-weight: 700; margin-bottom: 12px;">"${ad.hook}"</h4>
                    <div style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">${ad.body}</div>
                    <div style="display: inline-block; padding: 8px 16px; background: ${color.bg}; color: ${color.accent}; border-radius: 8px; font-weight: 600; font-size: 0.9rem;">
                        <i class="fas fa-mouse-pointer"></i> ${ad.cta}
                    </div>
                </div>

                <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;">
                        <strong style="color: white;">Landing Page H1:</strong> ${ad.landing_page_headline}
                    </div>
                    <div style="font-size: 0.75rem; color: #60a5fa; font-style: italic;">
                        💡 ${ad.why_this_works}
                    </div>
                </div>

                <button class="toggle-brief" style="margin-top: 16px; width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); border-radius: 8px; cursor: pointer; font-size: 0.85rem;">
                    <i class="fas fa-chevron-down"></i> Show Creative Brief
                </button>
                <div class="creative-brief-content" style="display: none; margin-top: 12px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 1px; margin-bottom: 12px;">🎨 Creative Brief</div>
                    <div style="color: white; font-size: 0.85rem; line-height: 1.6;">
                        <div style="margin-bottom: 8px;"><strong>Format:</strong> ${ad.creative_brief.format}</div>
                        <div style="margin-bottom: 8px;"><strong>Visual:</strong> ${ad.creative_brief.visual_description}</div>
                        ${ad.creative_brief.text_overlay ? `<div style="margin-bottom: 8px;"><strong>Text Overlay:</strong> "${ad.creative_brief.text_overlay}"</div>` : ''}
                        <div style="margin-bottom: 8px;"><strong>Colors:</strong> ${ad.creative_brief.color_scheme}</div>
                        <div><strong>Mood:</strong> ${ad.creative_brief.mood}</div>
                    </div>
                </div>
            </div>
        `;
    }

    targetingDisplay(targeting) {
        return `
            <div style="margin-bottom: 32px;">
                <h3 style="margin-bottom: 16px;">🎯 Multi-Stage Targeting Strategy</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    ${this.targetingCard('Cold Audience', targeting.cold_audience, '#60a5fa')}
                    ${this.targetingCard('Warm Audience', targeting.warm_audience, '#a78bfa')}
                    ${this.targetingCard('Hot Audience', targeting.hot_audience, '#34d399')}
                </div>
            </div>
        `;
    }

    targetingCard(title, data, color) {
        if (!data) return '';

        return `
            <div class="glass-panel" style="padding: 20px; border-left: 3px solid ${color};">
                <div style="font-weight: 600; color: ${color}; margin-bottom: 12px; font-size: 1.05rem;">${title}</div>
                ${data.interests ? `<div style="font-size: 0.85rem; margin-bottom: 8px; color: var(--text-secondary);"><strong style="color: white;">Interests:</strong> ${data.interests}</div>` : ''}
                ${data.behaviors ? `<div style="font-size: 0.85rem; margin-bottom: 8px; color: var(--text-secondary);"><strong style="color: white;">Behaviors:</strong> ${data.behaviors}</div>` : ''}
                ${data.demographics ? `<div style="font-size: 0.85rem; margin-bottom: 8px; color: var(--text-secondary);"><strong style="color: white;">Demographics:</strong> ${data.demographics}</div>` : ''}
                ${data.exclude ? `<div style="font-size: 0.85rem; color: #f87171;"><strong>Exclude:</strong> ${data.exclude.join(', ')}</div>` : ''}
                ${data.retargeting ? `<div style="font-size: 0.85rem; color: var(--text-secondary);"><strong style="color: white;">Retargeting:</strong> ${data.retargeting}</div>` : ''}
                ${data.lookalike ? `<div style="font-size: 0.85rem; color: var(--text-secondary);"><strong style="color: white;">Lookalike:</strong> ${data.lookalike}</div>` : ''}
                ${data.engagement ? `<div style="font-size: 0.85rem; color: var(--text-secondary);"><strong style="color: white;">Engagement:</strong> ${data.engagement}</div>` : ''}
                ${data.email_list ? `<div style="font-size: 0.85rem; color: var(--text-secondary);"><strong style="color: white;">Email List:</strong> ${data.email_list}</div>` : ''}
            </div>
        `;
    }

    budgetDisplay(budget) {
        return `
            <div class="glass-panel" style="padding: 24px; margin-bottom: 32px;">
                <h3 style="margin-bottom: 16px;">💰 Budget Recommendation</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px;">Daily Spend</div>
                        <div style="font-size: 1.4rem; font-weight: 700; color: #60a5fa;">${budget.daily_spend}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px;">Expected CPL</div>
                        <div style="font-size: 1.4rem; font-weight: 700; color: #a78bfa;">${budget.expected_cpl}</div>
                    </div>
                </div>
                <div style="margin-top: 16px; padding: 16px; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;"><strong style="color: white;">Split:</strong> ${budget.split}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;"><strong style="color: white;">Testing Plan:</strong> ${budget.testing_plan}</div>
                    <div style="font-size: 0.85rem; color: #60a5fa;"><strong>Break-Even Math:</strong> ${budget.break_even_math}</div>
                </div>
            </div>
        `;
    }

    landingPageDisplay(analysis) {
        const scoreColor = analysis.page_score >= 70 ? '#34d399' : analysis.page_score >= 50 ? '#facc15' : '#f87171';

        return `
            <div class="glass-panel" style="padding: 24px; margin-bottom: 32px; border: 2px solid ${scoreColor};">
                <h3 style="margin-bottom: 16px;">🔍 Landing Page Analysis</h3>
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.1); display: grid; place-items: center; font-size: 1.8rem; font-weight: 700; color: ${scoreColor};">
                        ${analysis.page_score}
                    </div>
                    <div style="flex: 1;">
                        <div style="font- size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px;">Conversion Score</div>
                        <div style="font-size: 1rem; color: white;">Estimated CR: ${analysis.estimated_conversion_rate}</div>
                        <div style="font-size: 0.85rem; color: #f87171; margin-top: 4px;"><strong>Biggest Leak:</strong> ${analysis.biggest_leak}</div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <div style="font-size: 0.85rem; font-weight: 600; color: #f87171; margin-bottom: 8px;">⚠️ Critical Issues:</div>
                        <ul style="font-size: 0.85rem; color: var(--text-secondary); margin-left: 20px;">
                            ${analysis.critical_issues.map(issue => `<li>${issue}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; font-weight: 600; color: #60a5fa; margin-bottom: 8px;">✅ Recommendations:</div>
                        <ul style="font-size: 0.85rem; color: var(--text-secondary); margin-left: 20px;">
                            ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    copyAdText(index) {
        const ad = this.data.results.variations[index];
        const text = `🎯 ${ad.angle}

📝 Headline (${ad.hook.length} chars): ${ad.hook}

📄 Body (${ad.body.length} chars):
${ad.body}

🔘 CTA: ${ad.cta}

📍 Landing Page H1: ${ad.landing_page_headline}

🎨 Creative Brief:
- Format: ${ad.creative_brief.format}
- Visual: ${ad.creative_brief.visual_description}
- Colors: ${ad.creative_brief.color_scheme}
- Mood: ${ad.creative_brief.mood}

💡 Why this works: ${ad.why_this_works}`;

        navigator.clipboard.writeText(text).then(() => {
            const btns = document.querySelectorAll('.copy-ad-btn');
            const btn = btns[index];
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                btn.style.background = 'rgba(16, 185, 129, 0.6)';
                btn.style.color = '#34d399';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 2000);
            }
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('Copy failed. Please try manually.');
        });
    }
}
