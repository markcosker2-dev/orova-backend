// Campaign localStorage management
export const CampaignStorage = {
    save(campaign) {
        const campaigns = this.getAll();
        campaign.id = Date.now();
        campaign.createdAt = new Date().toISOString();
        campaigns.push(campaign);
        localStorage.setItem('orova_campaigns', JSON.stringify(campaigns));
        return campaign.id;
    },

    getAll() {
        try {
            const data = localStorage.getItem('orova_campaigns');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading campaigns:', e);
            return [];
        }
    },

    getById(id) {
        return this.getAll().find(c => c.id === parseInt(id));
    },

    delete(id) {
        const campaigns = this.getAll().filter(c => c.id !== parseInt(id));
        localStorage.setItem('orova_campaigns', JSON.stringify(campaigns));
    },

    clear() {
        localStorage.removeItem('orova_campaigns');
    }
};
