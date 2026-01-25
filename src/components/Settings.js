export default class Settings {
    render() {
        const container = document.createElement('div');
        container.style.cssText = `
            flex: 1;
            padding: 40px;
            overflow-y: auto;
        `;

        container.innerHTML = `
            <header style="margin-bottom: 40px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 8px;">Settings</h1>
                <p style="color: var(--text-secondary);">Configure your OROVA experience</p>
            </header>

            <!-- API Configuration -->
            <div class="glass-panel" style="padding: 32px; margin-bottom: 24px;">
                <h3 style="margin-bottom: 8px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-key" style="color: var(--accent-blue);"></i>
                    API Configuration
                </h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px;">
                    Configure your Google Gemini API key to enable AI-powered deep analysis
                </p>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem;">
                        Gemini API Key
                    </label>
                    <div style="display: flex; gap: 12px;">
                        <input 
                            type="password" 
                            id="api-key-input"
                            placeholder="Enter your API key..."
                            style="flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-family: 'Courier New', monospace;"
                        />
                        <button 
                            class="btn-primary" 
                            onclick="alert('API key management requires backend integration. Set GEMINI_API_KEY as an environment variable on the server.')"
                            style="padding: 12px 24px;"
                        >
                            Save
                        </button>
                    </div>
                    <div style="margin-top: 12px; padding: 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; font-size: 0.85rem;">
                        <i class="fas fa-info-circle" style="color: #60a5fa;"></i>
                        <strong>Note:</strong> For security, set the <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">GEMINI_API_KEY</code> environment variable on your server. 
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #60a5fa; text-decoration: none;">Get a free API key →</a>
                    </div>
                </div>
            </div>

            <!-- Preferences -->
            <div class="glass-panel" style="padding: 32px; margin-bottom: 24px;">
                <h3 style="margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-sliders-h" style="color: var(--accent-purple);"></i>
                    Preferences
                </h3>
                
                ${this.settingRow(
            'Dark Mode',
            'Always enabled for optimal viewing experience',
            'toggle',
            true,
            true
        )}
                
                ${this.settingRow(
            'Auto-save Campaigns',
            'Automatically save campaigns to local storage',
            'toggle',
            true,
            false
        )}
                
                ${this.settingRow(
            'Show Advanced Metrics',
            'Display additional analytics in Intelligence view',
            'toggle',
            false,
            false
        )}
            </div>

            <!-- Account Info -->
            <div class="glass-panel" style="padding: 32px;">
                <h3 style="margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-user-circle" style="color: var(--accent-green);"></i>
                    Account Information
                </h3>
                
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${this.infoRow('Version', 'OROVA v4.0.0')}
                    ${this.infoRow('Storage', localStorage.length + ' items stored')}
                    ${this.infoRow('Last Updated', new Date().toLocaleDateString())}
                </div>
                
                <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button 
                        class="btn-ghost" 
                        onclick="if(confirm('Clear all local data? This cannot be undone.')) { localStorage.clear(); alert('Data cleared!'); location.reload(); }"
                        style="width: 100%; padding: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171;"
                    >
                        <i class="fas fa-trash"></i> Clear All Data
                    </button>
                </div>
            </div>

            <!-- Footer Info -->
            <div style="margin-top: 40px; padding: 24px; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
                <p>OROVA V4 - Perfect Ad Manager</p>
                <p style="margin-top: 8px;">Powered by Google Gemini AI • Built with ❤️ for Marketers</p>
            </div>
        `;

        return container;
    }

    settingRow(title, description, type, value, disabled) {
        const disabledStyle = disabled ? 'opacity: 0.5; cursor: not-allowed;' : '';
        const checkedAttr = value ? 'checked' : '';

        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 12px; ${disabledStyle}">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">${description}</div>
                </div>
                <label class="toggle-switch" style="position: relative; display: inline-block; width: 52px; height: 28px;">
                    <input type="checkbox" ${checkedAttr} ${disabled ? 'disabled' : ''} style="opacity: 0; width: 0; height: 0;">
                    <span style="position: absolute; cursor: ${disabled ? 'not-allowed' : 'pointer'}; top: 0; left: 0; right: 0; bottom: 0; background: ${value ? '#3b82f6' : 'rgba(255,255,255,0.1)'}; border-radius: 28px; transition: 0.3s;"></span>
                </label>
            </div>
        `;
    }

    infoRow(label, value) {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                <span style="color: var(--text-secondary); font-size: 0.9rem;">${label}</span>
                <span style="font-weight: 600;">${value}</span>
            </div>
        `;
    }
}
