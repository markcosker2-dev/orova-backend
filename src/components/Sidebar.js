export default class Sidebar {
    render() {
        const aside = document.createElement('aside');
        aside.className = 'glass-panel';
        aside.style.cssText = `
            width: var(--nav-width);
            height: 96vh;
            margin: 2vh;
            display: flex;
            flex-direction: column;
            padding: 32px 24px;
        `;

        aside.innerHTML = `
            <div class="logo" style="margin-bottom: 48px; display:flex; align-items:center; gap:12px;">
                <div style="width:36px; height:36px; background:white; border-radius:8px; display:grid; place-items:center;">
                    <i class="fas fa-bolt" style="color:var(--bg-dark); font-size:20px;"></i>
                </div>
                <h2 style="font-weight:700; font-size:1.4rem; letter-spacing:-0.5px;">OROVA <span style="font-size:0.8rem; opacity:0.5; font-weight:500;">v4</span></h2>
            </div>

            <nav style="display:flex; flex-direction:column; gap:8px;">
                <button class="nav-btn active" data-route="dashboard">
                    <i class="fas fa-grid-2"></i> Command Center
                </button>
                <button class="nav-btn" data-route="new-campaign">
                    <i class="fas fa-rocket"></i> Launchpad
                </button>
                <button class="nav-btn" data-route="intelligence">
                    <i class="fas fa-brain"></i> Intelligence
                </button>
            </nav>

            <div style="margin-top:auto">
                 <button class="nav-btn">
                    <i class="fas fa-cog"></i> Settings
                </button>
            </div>
            
            <style>
                .nav-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    padding: 14px 16px;
                    border-radius: 12px;
                    text-align: left;
                    font-size: 0.95rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s;
                    font-family: inherit;
                    font-weight: 500;
                }
                
                .nav-btn:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                
                .nav-btn.active {
                    background: rgba(59, 130, 246, 0.15);
                    color: #60a5fa;
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }
                
                .nav-btn i {
                    width: 20px;
                    text-align: center;
                }
            </style>
        `;

        // Event Delegation
        aside.querySelectorAll('.nav-btn[data-route]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                aside.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Dispatch Event
                window.dispatchEvent(new CustomEvent('navigate', {
                    detail: { route: btn.dataset.route }
                }));
            });
        });

        return aside;
    }
}
