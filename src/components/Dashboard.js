import { CampaignStorage } from '../utils/storage.js';

export default class Dashboard {
    render() {
        const container = document.createElement('div');
        container.style.cssText = `
            flex: 1;
            padding: 40px;
            overflow-y: auto;
        `;

        // Load campaigns from localStorage
        const campaigns = CampaignStorage.getAll();
        const campaignsHTML = campaigns.length > 0
            ? campaigns.slice(-5).reverse().map(c => this.campaignRow(c)).join('')
            : '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No campaigns yet. <a href="#" onclick="window.dispatchEvent(new CustomEvent(\'navigate\', { detail: { route: \'new-campaign\' } })); return false;" style="color: var(--accent-blue); text-decoration: none;">Create your first campaign →</a></div>';

        container.innerHTML = `
            <header style="margin-bottom: 40px; display:flex; justify-content:space-between; align-items:flex-end;">
                <div>
                    <h1 style="font-size: 2.5rem; margin-bottom: 8px;">Command Center</h1>
                    <p style="color: var(--text-secondary);">Welcome back. System is <span style="color:#4ade80">● Operational</span></p>
                </div>
                <div>
                     <button class="btn-primary" onclick="window.dispatchEvent(new CustomEvent('navigate', { detail: { route: 'new-campaign' } }))">
                        <i class="fas fa-plus"></i> New Campaign
                    </button>
                </div>
            </header>

            <!-- Metrics Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 40px;">
                ${this.metricCard('Total Campaigns', campaigns.length.toString(), 'All Time', 'rgba(59, 130, 246, 0.1)', '#60a5fa')}
                ${this.metricCard('This Week', campaigns.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString(), '+' + campaigns.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, 'rgba(139, 92, 246, 0.1)', '#a78bfa')}
                ${this.metricCard('Storage Used', ((JSON.stringify(campaigns).length / 1024).toFixed(1)) + ' KB', '/ 5 MB', 'rgba(16, 185, 129, 0.1)', '#34d399')}
            </div>

            <!-- Campaign History -->
            <div class="glass-panel" style="padding: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h3 style="margin: 0;">Campaign History</h3>
                    ${campaigns.length > 0 ? `<button class="btn-ghost" onclick="if(confirm('Delete all campaigns?')) { window.dashboardClearAll(); }" style="padding: 8px 16px; font-size: 0.9rem;"><i class="fas fa-trash"></i> Clear All</button>` : ''}
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${campaignsHTML}
                </div>
            </div>
        `;

        //Store reference for global access
        window.dashboardClearAll = () => {
            CampaignStorage.clear();
            window.dispatchEvent(new CustomEvent('navigate', { detail: { route: 'dashboard' } }));
        };

        return container;
    }

    metricCard(label, value, trend, bg, color) {
        return `
            <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column;">
                <span style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 12px;">${label}</span>
                <div style="font-size: 2.2rem; font-weight: 700; margin-bottom: 8px;">${value}</div>
                <div style="display: inline-block; padding: 4px 12px; border-radius: 100px; background: ${bg}; color: ${color}; font-size: 0.85rem; font-weight: 600; align-self: flex-start;">
                    <i class="fas fa-chart-line"></i> ${trend}
                </div>
            </div>
        `;
    }

    campaignRow(campaign) {
        const date = new Date(campaign.createdAt);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeAgo = this.getTimeAgo(date);

        return `
            <div data-campaign-id="${campaign.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 12px; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.transform='translateX(0)'">
                <div style="display: flex; align-items: center; gap: 16px; flex: 1;" onclick="alert('Campaign viewer coming soon! ID: ${campaign.id}')">
                   <div style="width: 40px; height: 40px; background: var(--glass-highlight); border-radius: 8px; display: grid; place-items: center;">
                        <i class="fas fa-rocket" style="color: var(--accent-blue);"></i>
                   </div>
                   <div style="flex: 1;">
                        <div style="font-weight: 600; color: white;">${campaign.productName || 'Untitled Campaign'}</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fas fa-map-marker-alt"></i> ${campaign.location || 'Global'} • ${campaign.audience || 'General'}</div>
                   </div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${dateStr}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">${timeAgo}</div>
                    </div>
                    <button class="delete-campaign-btn" data-id="${campaign.id}" style="padding: 8px 12px; background: rgba(239, 68, 68, 0.1);  border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; border-radius: 6px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'" onclick="event.stopPropagation(); if(confirm('Delete this campaign?')) { window.dashboardDelete(${campaign.id}); }">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    }
}

// Global delete function
window.dashboardDelete = (id) => {
    CampaignStorage.delete(id);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { route: 'dashboard' } }));
};
