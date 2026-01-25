import Sidebar from './components/Sidebar.js';
import Dashboard from './components/Dashboard.js';
import Wizard from './components/Wizard.js';
import Intelligence from './components/Intelligence.js';
import Settings from './components/Settings.js';

class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.init();
    }

    init() {
        // Layout Skeleton
        this.appElement.innerHTML = `
            <aside id="sidebar-container"></aside>
            <main id="main-content">
                <!-- Dynamic Content Load -->
            </main>
        `;

        // Load Sidebar
        const sidebar = new Sidebar();
        document.getElementById('sidebar-container').appendChild(sidebar.render());

        // Initial Route
        this.navigate('dashboard');

        // Listener for Navigation
        window.addEventListener('navigate', (e) => this.navigate(e.detail.route));
    }

    navigate(route) {
        const main = document.getElementById('main-content');
        main.innerHTML = ''; // Clear Content

        switch (route) {
            case 'dashboard':
                const dashboard = new Dashboard();
                main.appendChild(dashboard.render());
                break;
            case 'new-campaign':
                const wizard = new Wizard();
                main.appendChild(wizard.render());
                break;
            case 'intelligence':
                const intelligence = new Intelligence();
                main.appendChild(intelligence.render());
                break;
            case 'settings':
                const settings = new Settings();
                main.appendChild(settings.render());
                break;
            default:
                main.innerHTML = `<h1>404</h1>`;
        }
    }
}

// Start App
new App();
