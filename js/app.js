// Tasting note categories with colors
const TASTING_CATEGORIES = {
    'Earthy/Savory': { color: '#8B7355', notes: ['Savory', 'Tomato', 'Sweet Pea', 'Straw', 'Squash', 'Rhubarb', 'Mushroom', 'Leafy Greens', 'Green Pepper', 'Grassy', 'Carrot', 'Vegetal', 'Olive'] },
    'Nutty/Roasted': { color: '#D4A574', notes: ['Roasted', 'Bitter', 'Walnut', 'Pistachio', 'Penut', 'Macadamia', 'Hazelnut', 'Cashew', 'Almond', 'Wheat', 'Toasted Oats', 'Rye', 'Popcorn', 'Gummy Shark', 'Pastry', 'Malt', 'Graham Cracke', 'Fresh Bread', 'Barley', 'Tamarind'] },
    'Chocolate/Caramel': { color: '#6F4E37', notes: ['Chocolate', 'Caramel', 'Toffee', 'Sugarcane', 'Simple Syrup', 'Panela', 'Brown Sugar', 'Agave', 'Sugar', 'Praline', 'Nougat', 'Molasses', 'Marzipan', 'Marshmallow', 'Maple Syrup', 'Honey', 'Fudge', 'Cola', 'Butterscotch', 'Butter', 'Bubble Gum', 'Wite Pepper', 'Burnt Sugar'] },
    'Sweet/Syrup': { color: '#FFB347', notes: ['Sweet', 'Vanilla', 'Toast', 'Smoky', 'Carbon', 'Meaty', 'Leathery'] },
    'Spice': { color: '#D2691E', notes: ['Spicy', 'Black Pepper', 'Peppercorn', 'Nutmeg', 'Licorice', 'Ginger', 'Cumin', 'Coriander', 'Clove', 'Cinnamon', 'Anise', 'Sundried Tomat', 'Soy Sauce'] },
    'Berry': { color: '#E2416C', notes: ['Berry', 'Strawberry', 'Red Currant', 'Raspberry', 'Cranberry', 'Blueberry', 'Blackberry', 'Black Currant'] },
    'Stone/Pome Fruit': { color: '#FF6B6B', notes: ['Fruity', 'Stone Fruit', 'Star Fruit', 'Pineapple', 'Passion Fruit', 'Papaya', 'Mango', 'Lychee', 'Longan', 'Kiwi', 'Guava', 'Coconut', 'Banana', 'Tropical Fruit', 'Peach', 'Nectarine', 'Cherry', 'Black Cherry', 'Apricot', 'Pomegranate', 'Pear', 'Watermelon', 'Honeydew', 'Cantaloupe', 'Melon'] },
    'Citrus': { color: '#FFA500', notes: ['Citrus', 'Bright', 'Yuzu', 'Tangerine', 'Orange', 'Mandarin', 'Lime', 'Lemon', 'Grapefruit', 'Clementine', 'Blood Orange', 'Bergamot'] },
    'Tropical': { color: '#FFD700', notes: ['White Grape', 'Red Grape', 'Green Grape', 'Raisin', 'Prune', 'Golden Raisin', 'Dried Fig', 'Dried Date', 'Plum'] },
    'Grape/Wine': { color: '#8B5A8B', notes: ['Red Apple', 'Green Apple', 'Apple'] },
    'Floral': { color: '#DDA0DD', notes: ['Floral', 'Rosewater', 'Rose', 'Orange Blossom', 'Magnolia', 'Lemongrass', 'Lavender', 'Jasmine', 'Honeysuckle', 'Hibiscus'] },
    'Herbal/Fresh': { color: '#90C695', notes: ['Herbal', 'Sage', 'Mint', 'Dill'] },
    'Funky/Fermented': { color: '#9370DB', notes: ['Funky', 'Fermented', 'Winey', 'Boozy'] }
};

// Flatten all tasting notes for the selector
const TAGS = [];
Object.keys(TASTING_CATEGORIES).forEach(category => {
    const categoryData = TASTING_CATEGORIES[category];
    categoryData.notes.forEach(note => {
        TAGS.push({ name: note, color: categoryData.color, category: category });
    });
});

// Coffee processing methods
const PROCESSES = ['Aerobic', 'Alchemy', 'Anaerobic', 'Anoxic', 'Barrel Aged', 'Bio-Innovation', 'Black Diamond', 'Black Honey', 'Carbonic Maceration', 'Chilled Cherry', 'Co-Fermentation', 'Cold', 'Decaf', 'Double Fermentation', 'Dynamic Cherry', 'EF2', 'Ethyl Acetate', 'Extended Fermentation', 'Fermentation', 'Honey', 'Hydro', 'Intrinsic Cherry', 'Koji', 'Lactic', 'Limited Oxygen Natural', 'Minimal Fermentation Washed', 'Monsoon Malabar', 'Mountain Water Process', 'Natural', 'Natural Mejorado', 'Other', 'Pulped', 'Red Honey', 'Scoby', 'Semi-Carbonic Maceration', 'Semi-Washed', 'Slow Dry', 'Submerged', 'Sugarcane Decaf', 'Swiss Water Process', 'Thermic', 'Tree Dried Natural', 'Tropical Washed', 'Troxidator Washed', 'Washed', 'Wet Hulled', 'White Honey', 'Wine Process', 'Yeast', 'Yellow Honey', 'ZEO Washed'];

// Coffee varietals
const VARIETALS = ['74110', '74112', '74158', '74160', '74165', '74212', '74221', 'Ababuna', 'Abyssinia', 'Acaia', 'Agaro', 'Alghe', 'Amarello de Botucatu', 'Anacafe 14', 'Andungsari', 'Arabigo', 'Arabusta', 'Aramosa', 'Arara', 'Arla', 'Arusha', 'Ateng', 'Awada', 'Barbuk Sudan', 'Bataim', 'Batian', 'Benguet', 'Benngendal', 'Bergundal AKA Garundang', 'Bernardina', 'Blawan Paumah', 'Blue Mountain', 'BMJ', 'Bogor Prada', 'Borbor', 'Bourbon', 'Bourbon 300', 'Bourbon Aji', 'Bourbon Chocolá', 'Bourbon Pointu/Laurina', 'Canillilo', 'Castillo', 'Catiga MG2', 'Catigua', 'Catimor', 'Catiope', 'Catrenic', 'Caturra', 'Catuai', 'Catucai', 'Caturra', 'Caturron', 'Cavery', 'Cenicafe 1', 'Cera', 'Charrier', 'Chickumalgur', 'Chiroso', 'Cioccie S6', 'Ciollo', 'Colombia', 'Costa Rica 95 AKA CR-95', 'Criollo', 'CxR', 'Dalle', 'Dawairi', 'Dega', 'Devamachy', 'Dilla', 'Dilla Alghe', 'Dimma', 'Dwarg Gesha', 'El Pasti', 'Ennarea', 'Ethiopian Landrace', 'Ethiopian Sidamo', 'Ethiopian Yirgacheffe', 'French mission', 'Garnica', 'Garundang', 'Gawe', 'Gayo 1', 'Gayo 2', 'Gera', 'Gesha', 'Gesha 1931', 'Ghimbi', 'Gibirinna', 'Guadeloupe Bonifieur', 'Guarani', 'Guatemala', 'H1 Centroamericano', 'H17', 'H2', 'H795', 'Harrar', 'Haru', 'Hawaiian Kona', 'Heirloom', 'IAPAR 59', 'Ibairi', 'ICAFE 95', 'Icatu', 'Icatú', 'IHCAFE 90', 'IPAR 103', 'Jaadi', 'Jackson', 'Jackson 2/1257', 'Java', 'Jember/S795', 'K20', 'K7', 'Kalimas', 'Kartika', 'Kawisari', 'Kent', 'Kona', 'KP423', 'L1 (Lugmapata 1)', 'Laurina (Bourbon Pointu)', 'Lekempti', 'Lempira', 'Lini S', 'Longberry Harrar', 'Mandela', 'Maracatu', 'Maracaturra', 'Maragogype', 'Maragojpe', 'Margaturra', 'Marseillesa', 'Marseillesa', 'Marshall', 'Mayaguez', 'Mechara', 'Meika', 'Melko-CH2', 'Menado', 'Mettu', 'Mibirizi', 'Mikicho', 'Milenio', 'Mocha/Mokka', 'Mokkita', 'Mugi', 'Mundo Novo', 'N39', 'Obata', 'Ombligon', 'Orange bourbon', 'Oro Azteca', 'Ouro Bronze', 'Ouro Verde', 'P3', 'P4', 'Pacamara', 'Pacas', 'Pache', 'Pache colis', 'Pache Comum', 'Parainema', 'Paraiso', 'Pink bourbon', 'Pluma Hidalgo', 'Pollerona', 'Purple Caturra', 'Purpuracae', 'Rambung', 'Rasuna', 'Red Bourbon', 'Red Catual', 'Red Iapar', 'Rosado', 'Rubi', 'Ruiru 11', 'Rumangabo', 'Rume Sudan', 'S13', 'S26', 'S288', 'S795', 'Sagada', 'Sampacho', 'San Bernardo AKA Pache', 'San Isidro', 'San Ramon', 'Santos', 'Sarchimor', 'Selection 9', 'Semperflorens', 'Serto', 'Setami', 'Sidamo', 'Sidikalang', 'SL-14', 'SL-27', 'SL-28', 'SL-34', 'SL28', 'SL34', 'SLN 5B', 'Striped Bourbon', 'Sulawesi Toraja Kalossi', 'Sumatra', 'Tabi', 'Tafarikela', 'Tegu', 'Tekisic', 'Tim Tim', 'Timor', 'Topazio', 'Tuffahi', 'Tupi', 'Typica', 'Typica Mejorado', 'Udaini', 'Uganda', 'USDA 762', 'Venecia', 'Villa Sarchi', 'Villalobos', 'Wellega', 'Wenago', 'Wolisho', 'Wush Wush', 'Yellow Bourbon', 'Yellow Caturra', 'Yellow Catuai', 'Yellow Pacamara', 'Yellow Pacas', 'Yellow Typica', 'Yemenia', 'Yirgacheffe'];

// Main application class
class App {
    constructor() {
        this.db = new DB();
        this.selectedTags = new Set();
        this.editingId = null;
        this.deletingId = null;
        this.currentSort = 'date'; // Default sort
        this.init();
    }

    async init() {
        // Initialize authentication
        await window.auth.init();

        // Listen for auth state changes
        window.auth.onAuthStateChange = (user) => {
            if (user) {
                this.onAuthenticated();
            } else {
                this.onUnauthenticated();
            }
        };

        // Check initial auth state
        if (window.auth.isAuthenticated()) {
            await this.onAuthenticated();
        } else {
            this.onUnauthenticated();
        }
    }

    onUnauthenticated() {
        // Show auth modal, hide app
        document.getElementById('auth-modal').classList.add('open');
        document.getElementById('app-container').style.display = 'none';
    }

    async onAuthenticated() {
        // Hide auth modal, show app
        document.getElementById('auth-modal').classList.remove('open');
        document.getElementById('app-container').style.display = 'block';

        // Update user indicator
        const userEmail = window.auth.getUserEmail();
        if (userEmail) {
            document.getElementById('user-email').innerText = userEmail;
        }

        // Initialize app
        await this.initUI();
    }

    async initUI() {
        // Show loading state
        document.getElementById('coffee-list').innerHTML = '<div style="text-align:center; padding:20px;">Loading...</div>';

        await this.db.load();

        this.renderList();
        this.renderTags();
        this.updateDatalists();

        // Rating slider listener
        document.getElementById('rating-input').addEventListener('input', (e) => {
            document.getElementById('rating-display').innerText = e.target.value;
        });

        // FORCE UNREGISTER ALL SERVICE WORKERS (Fix for caching issues)
        // Only run if we are NOT on file:// protocol to avoid SecurityError
        if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    console.log('Unregistering SW:', registration);
                    registration.unregister();
                }
            }).catch(err => console.warn('SW cleanup failed:', err));
        }
    }

    async logout() {
        try {
            await window.auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to log out');
        }
    }

    updateDatalists() {
        const rList = document.getElementById('roasters-list');
        rList.innerHTML = this.db.data.roasters.map(r => `<option value="${r.name}">`).join('');

        const oList = document.getElementById('origins-list');
        oList.innerHTML = this.db.data.origins.map(o => `<option value="${o.name}">`).join('');

        const regList = document.getElementById('regions-list');
        regList.innerHTML = this.db.data.regions.map(r => `<option value="${r.name}">`).join('');

        const pList = document.getElementById('processes-list');
        pList.innerHTML = PROCESSES.map(p => `<option value="${p}">`).join('');

        const vList = document.getElementById('varietals-list');
        vList.innerHTML = VARIETALS.map(v => `<option value="${v}">`).join('');
    }

    renderTags() {
        const container = document.getElementById('tags-container');

        // Identify unknown tags from selectedTags
        const unknownTags = [];
        this.selectedTags.forEach(tagName => {
            if (!TAGS.find(t => t.name === tagName)) {
                unknownTags.push({ name: tagName, color: '#999999', category: 'Unknown' });
            }
        });

        // Combine unknown tags (put them first so they are obvious) and standard tags
        const allTagsToRender = [...unknownTags, ...TAGS];

        container.innerHTML = allTagsToRender.map(tag => {
            const isSelected = this.selectedTags.has(tag.name);
            return `
            <div class="tag-chip ${isSelected ? 'selected' : ''}" onclick="app.toggleTag('${tag.name}', this)"
                style="border-left: 5px solid ${tag.color}">
                ${tag.name}
            </div>
            `;
        }).join('');
    }

    toggleTag(tagName, el) {
        if (this.selectedTags.has(tagName)) {
            this.selectedTags.delete(tagName);
            el.classList.remove('selected');
        } else {
            if (this.selectedTags.size >= 4) return;
            this.selectedTags.add(tagName);
            el.classList.add('selected');
        }
    }

    generateGradient(tags) {
        if (!tags || tags.length === 0) return 'radial-gradient(circle, #e0e0e0, #f5f5f5)';

        const colors = tags.map(t => {
            const tagObj = TAGS.find(x => x.name === t);
            // Use grey for unknown tags in gradient too
            return tagObj ? tagObj.color : '#999999';
        });

        // Ensure we have 4 colors for the radial blend
        while (colors.length < 4) {
            colors.push(colors[0]);
        }

        // Create a radial gradient that mimics the "aura" look
        return `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 30%, ${colors[2]} 60%, ${colors[3]} 100%)`;
    }

    getBrewMethods() {
        const methods = [];
        if (document.getElementById('brew-pourover').checked) methods.push('Pour Over');
        if (document.getElementById('brew-espresso').checked) methods.push('Espresso');
        if (document.getElementById('brew-aeropress').checked) methods.push('Aeropress');
        if (document.getElementById('brew-oxo').checked) methods.push('OXO Rapid Brewer');
        return methods;
    }

    getLocation() {
        const locations = [];
        if (document.getElementById('loc-home').checked) locations.push('Home');
        if (document.getElementById('loc-cafe').checked) locations.push('Café');
        return locations.join(', ') || 'Not specified';
    }

    async saveCoffee() {
        const roasterName = document.getElementById('roaster-input').value;
        const coffeeName = document.getElementById('name-input').value;
        const originName = document.getElementById('origin-input').value;
        const regionName = document.getElementById('region-input').value;
        const processName = document.getElementById('process-input').value;
        const varietalName = document.getElementById('varietal-input').value;
        const brewMethods = this.getBrewMethods();
        const location = this.getLocation();
        const rating = document.getElementById('rating-input').value;

        if (!roasterName || !coffeeName) {
            alert('Please enter at least a Roaster and Coffee Name');
            return;
        }

        if (brewMethods.length === 0) {
            alert('Please select at least one brew method');
            return;
        }

        if (this.selectedTags.size < 2 || this.selectedTags.size > 4) {
            alert('Please select between 2 and 4 tasting notes.');
            return;
        }

        // Show saving state
        const saveBtn = document.querySelector('#add-modal .btn-primary');
        const originalText = saveBtn.innerText;
        saveBtn.innerText = 'Saving...';
        saveBtn.disabled = true;

        try {
            const roaster = await this.db.getOrCreateRef('roasters', roasterName);
            const origin = await this.db.getOrCreateRef('origins', originName);
            const region = await this.db.getOrCreateRef('regions', regionName);
            const process = await this.db.getOrCreateRef('processes', processName);
            const varietal = await this.db.getOrCreateRef('varietals', varietalName);
            const tags = Array.from(this.selectedTags);

            const coffeeData = {
                roasterId: roaster.id,
                originId: origin ? origin.id : null,
                regionId: region ? region.id : null,
                processId: process ? process.id : null,
                varietalId: varietal ? varietal.id : null,
                name: coffeeName,
                brewMethods: brewMethods,
                location: location,
                rating: rating,
                tags: tags,
                gradient: this.generateGradient(tags)
            };

            if (this.editingId) {
                await this.db.updateCoffee(this.editingId, coffeeData);
            } else {
                await this.db.addCoffee(coffeeData);
            }

            this.closeModal('add-modal');
            this.renderList();
            this.updateDatalists();
        } catch (e) {
            console.error(e);
            alert('Error saving coffee');
        } finally {
            saveBtn.innerText = originalText;
            saveBtn.disabled = false;
        }
    }

    requestDelete(id, event) {
        event.stopPropagation();
        this.deletingId = id;
        document.getElementById('delete-modal').classList.add('open');
    }

    requestDeleteFromModal() {
        if (this.editingId) {
            this.deletingId = this.editingId;
            this.closeModal('add-modal');
            document.getElementById('delete-modal').classList.add('open');
        }
    }

    async confirmDelete() {
        if (this.deletingId) {
            const deleteBtn = document.querySelector('#delete-modal .btn-danger');
            deleteBtn.innerText = 'Deleting...';

            await this.db.deleteCoffee(this.deletingId);

            this.deletingId = null;
            this.renderList();
            this.updateDatalists();

            deleteBtn.innerText = 'Delete';
        }
        this.closeModal('delete-modal');
    }

    editCoffee(id, event) {
        if (event) event.stopPropagation();
        // Use loose equality to handle string/number mismatch
        const coffee = this.db.data.coffees.find(c => c.id == id);
        if (!coffee) {
            console.error('Coffee not found for editing:', id);
            return;
        }

        this.editingId = id;
        document.getElementById('modal-title').innerText = 'Edit Coffee';

        const deleteBtn = document.getElementById('delete-btn-in-modal');
        if (deleteBtn) {
            deleteBtn.style.display = 'block';
        } else {
            console.error('Delete button not found in DOM');
        }

        document.getElementById('roaster-input').value = coffee.roasterName;
        document.getElementById('name-input').value = coffee.name;
        document.getElementById('origin-input').value = coffee.originName;
        document.getElementById('region-input').value = coffee.regionName || '';
        document.getElementById('process-input').value = coffee.processName || '';
        document.getElementById('varietal-input').value = coffee.varietalName || '';
        document.getElementById('rating-input').value = coffee.rating;
        document.getElementById('rating-display').innerText = coffee.rating;

        // Set brew methods
        document.getElementById('brew-pourover').checked = coffee.brewMethods.includes('Pour Over');
        document.getElementById('brew-espresso').checked = coffee.brewMethods.includes('Espresso');
        document.getElementById('brew-aeropress').checked = coffee.brewMethods.includes('Aeropress');
        document.getElementById('brew-oxo').checked = coffee.brewMethods.includes('OXO Rapid Brewer');

        // Set location
        document.getElementById('loc-home').checked = coffee.location.includes('Home');
        document.getElementById('loc-cafe').checked = coffee.location.includes('Café');

        this.selectedTags = new Set(coffee.tags);

        // Re-render tags to show selection
        this.renderTags();

        document.getElementById('add-modal').classList.add('open');
    }

    openSortModal() {
        document.getElementById('sort-modal').classList.add('open');
    }

    applySort(sortType) {
        this.currentSort = sortType;
        this.renderList();
        this.closeModal('sort-modal');
    }

    renderList() {
        const list = document.getElementById('coffee-list');
        const empty = document.getElementById('empty-state');
        const countDisplay = document.getElementById('header-count');

        // Update count
        if (countDisplay) {
            countDisplay.innerText = this.db.data.coffees.length;
        }

        if (this.db.data.coffees.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        // Sort Data
        let sortedCoffees = [...this.db.data.coffees];
        if (this.currentSort === 'roaster') {
            sortedCoffees.sort((a, b) => a.roasterName.localeCompare(b.roasterName));
        } else if (this.currentSort === 'origin') {
            sortedCoffees.sort((a, b) => (a.originName || '').localeCompare(b.originName || ''));
        } else if (this.currentSort === 'process') {
            sortedCoffees.sort((a, b) => (a.processName || '').localeCompare(b.processName || ''));
        } else if (this.currentSort === 'variety') {
            sortedCoffees.sort((a, b) => (a.varietalName || '').localeCompare(b.varietalName || ''));
        } else if (this.currentSort === 'rating') {
            sortedCoffees.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        }

        empty.style.display = 'none';
        list.innerHTML = sortedCoffees.map(c => {
            const isPerfect = parseFloat(c.rating) === 10;
            const triangleFill = isPerfect ? 'white' : 'none';
            const triangleStroke = isPerfect ? 'none' : 'white';
            const ratingTextClass = isPerfect ? 'rating-text rating-perfect' : 'rating-text';

            return `
            <div class="coffee-card" onclick="app.editCoffee('${c.id}')">
                <div class="card-visual">
                    <div class="card-gradient" style="background: ${c.gradient}"></div>
                    <div class="triangle-badge">
                        <svg class="triangle-svg" viewBox="0 0 100 86.6" preserveAspectRatio="none">
                            <polygon points="50,0 100,86.6 0,86.6" fill="${triangleFill}" stroke="${triangleStroke}" stroke-width="4"/>
                        </svg>
                        <span class="${ratingTextClass}">${c.rating}</span>
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-meta">${c.roasterName}</div>
                    <h3 class="card-title">${c.name}</h3>
                </div>
            </div>
        `;
        }).join('');
    }

    openAddModal() {
        this.editingId = null;
        document.getElementById('modal-title').innerText = 'Add Coffee';
        document.getElementById('delete-btn-in-modal').style.display = 'none';

        // Reset form
        document.getElementById('roaster-input').value = '';
        document.getElementById('name-input').value = '';
        document.getElementById('origin-input').value = '';
        document.getElementById('region-input').value = '';
        document.getElementById('process-input').value = '';
        document.getElementById('varietal-input').value = '';
        document.getElementById('rating-input').value = 7;
        document.getElementById('rating-display').innerText = 7;

        // Reset checkboxes
        document.getElementById('brew-pourover').checked = false;
        document.getElementById('brew-espresso').checked = false;
        document.getElementById('brew-aeropress').checked = false;
        document.getElementById('brew-oxo').checked = false;
        document.getElementById('loc-home').checked = false;
        document.getElementById('loc-cafe').checked = false;

        this.selectedTags.clear();
        this.renderTags();

        document.getElementById('add-modal').classList.add('open');
    }

    openStats() {
        const stats = this.db.getStats();
        document.getElementById('stat-total').innerText = stats.total;
        document.getElementById('stat-roasters').innerText = stats.roasters;
        document.getElementById('stat-origins').innerText = stats.origins;
        document.getElementById('stat-processes').innerText = stats.processes;
        document.getElementById('stat-varietals').innerText = stats.varietals;
        document.getElementById('stat-rating').innerText = stats.avgRating;
        document.getElementById('stats-modal').classList.add('open');
    }

    closeModal(id) {
        document.getElementById(id).classList.remove('open');
    }
}

// Initialize the app
const app = new App();
