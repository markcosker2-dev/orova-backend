export default class Intelligence {
    render() {
        const container = document.createElement('div');
        container.style.cssText = `
            flex: 1;
            padding: 40px;
            overflow-y: auto;
        `;

        container.innerHTML = `
            <header style="margin-bottom: 40px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 8px;">Campaign Intelligence</h1>
                <p style="color: var(--text-secondary);">Advanced analytics and performance insights</p>
            </header>

            <!-- Analytics Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 40px;">
                ${this.metricCard('Avg. CTR', '2.8%', '+0.4% vs last week', 'rgba(59, 130, 246, 0.1)', '#60a5fa', 'fa-mouse-pointer')}
                ${this.metricCard('Cost Per Lead', '$18.50', '-$2.30 vs last week', 'rgba(16, 185, 129, 0.1)', '#34d399', 'fa-dollar-sign')}
                ${this.metricCard('Total Leads', '347', '+52 this week', 'rgba(139, 92, 246, 0.1)', '#a78bfa', 'fa-users')}
                ${this.metricCard('Engagement', '4.2%', '+1.1% vs last week', 'rgba(251, 146, 60, 0.1)', '#fb923c', 'fa-chart-line')}
            </div>

            <!-- Performance Chart -->
            <div class="glass-panel" style="padding: 32px; margin-bottom: 24px;">
                <h3 style="margin-bottom: 24px;">7-Day Performance Trend</h3>
                <div style="height: 250px; display: flex; align-items: flex-end; gap: 16px; padding: 20px 0;">
                    ${this.barChart([45, 62, 58, 77, 85, 92, 88])}
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 12px; color: var(--text-secondary); font-size: 0.85rem;">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>
            </div>

            <!-- Top Performing Campaigns -->
            <div class="glass-panel" style="padding: 32px;">
                <h3 style="margin-bottom: 24px;">Top Performing Campaigns</h3>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${this.campaignPerformanceRow('Summer Sale - Cold Traffic', 3.8, 247, '$15.20', 'success')}
                    ${this.campaignPerformanceRow('Product Launch - Warm', 2.9, 156, '$21.50', 'success')}
                    ${this.campaignPerformanceRow('Retargeting - Hot Traffic', 5.2, 89, '$12.80', 'excellent')}
                </div>
            </div>

            <!-- AI Insights -->
            <div class="glass-panel" style="padding: 32px; margin-top: 24px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <i class="fas fa-brain" style="font-size: 1.5rem; color: #a78bfa;"></i>
                    <h3 style="margin: 0;">AI Recommendations</h3>
                </div>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
                    <li style="display: flex; align-items: start; gap: 12px;">
                        <i class="fas fa-check-circle" style="color: #34d399; margin-top: 4px;"></i>
                        <span><strong>Increase budget on "Retargeting - Hot Traffic"</strong> - This campaign has the lowest CPL ($12.80). Consider allocating 30% more budget.</span>
                    </li>
                    <li style="display: flex; align-items: start; gap: 12px;">
                        <i class="fas fa-exclamation-triangle" style="color: #fb923c; margin-top: 4px;"></i>
                        <span><strong>Test new creative on "Product Launch"</strong> - CTR declined 0.8% this week. Fresh visuals may improve performance.</span>
                    </li>
                    <li style="display: flex; align-items: start; gap: 12px;">
                        <i class="fas fa-lightbulb" style="color: #60a5fa; margin-top: 4px;"></i>
                        <span><strong>Best posting time: 2-4pm weekdays</strong> - Your campaigns show 42% higher engagement during this window.</span>
                    </li>
                </ul>
            </div>
        `;

        return container;
    }

    metricCard(label, value, trend, bg, color, icon) {
        return `
            <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">${label}</span>
                    <i class="fas ${icon}" style="color: ${color}; opacity: 0.5;"></i>
                </div>
                <div style="font-size: 2.2rem; font-weight: 700; margin-bottom: 8px;">${value}</div>
                <div style="display: inline-block; padding: 4px 12px; border-radius: 100px; background: ${bg}; color: ${color}; font-size: 0.85rem; font-weight: 600; align-self: flex-start;">
                    <i class="fas fa-arrow-up"></i> ${trend}
                </div>
            </div>
        `;
    }

    barChart(data) {
        const max = Math.max(...data);
        return data.map(value => {
            const height = (value / max) * 100;
            return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <div style="width: 100%; height: ${height}%; background: linear-gradient(180deg, #60a5fa, #3b82f6); border-radius: 8px 8px 0 0; min-height: 20px; position: relative; transition: all 0.3s;">
                        <div style="position: absolute; top: -24px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap;">${value}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    campaignPerformanceRow(name, ctr, leads, cpl, status) {
        const statusColors = {
            excellent: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: '#34d399' },
            success: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' },
            warning: { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.3)', color: '#fb923c' }
        };
        const colors = statusColors[status] || statusColors.success;

        return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 12px; border-left: 3px solid ${colors.color};">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${name}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">
                        CTR: ${ctr}% • Leads: ${leads} • CPL: ${cpl}
                    </div>
                </div>
                <div style="padding: 6px 16px; background: ${colors.bg}; border: 1px solid ${colors.border}; color: ${colors.color}; border-radius: 20px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">
                    ${status}
                </div>
            </div>
        `;
    }
}
