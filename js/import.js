// CSV Import Script for Coffee Backlog
// This script reads CSV files and bulk imports coffees into Supabase

// Mapping of CSV tasting notes to app tasting notes
// CSV has 14 categories, app needs 4 for gradient
// Strategy: Pick top 4 highest-scored categories from each coffee

const TASTING_NOTE_COLUMNS = [
    'SWEET', 'ACIDIC', 'FLORAL', 'SPICE', 'FERMENTED',
    'BERRY FRUIT', 'CITRUS FRUIT', 'STONE FRUIT', 'VEGETIVE',
    'CHOCOLATE', 'CARAMEL', 'ROASTED', 'BITTER', 'SAVORY'
];

// Map CSV column names to app's tasting note names
const TASTE_MAP = {
    'SWEET': 'Sweet',
    'ACIDIC': 'Bright',
    'FLORAL': 'Floral',
    'SPICE': 'Spicy',
    'FERMENTED': 'Funky',
    'BERRY FRUIT': 'Berry',
    'CITRUS FRUIT': 'Citrus',
    'STONE FRUIT': 'Stone Fruit',
    'VEGETIVE': 'Herbal',
    'CHOCOLATE': 'Chocolate',
    'CARAMEL': 'Caramel',
    'ROASTED': 'Roasted',
    'BITTER': 'Bitter',
    'SAVORY': 'Savory'
};

async function parseCSV(text) {
    const lines = text.trim().split('\n');
    // Skip first header row (the "RATE ALL CATEGORIES" row)
    // Second row has actual column headers
    const headers = lines[1].split(',');
    const data = [];

    for (let i = 2; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
        });
        data.push(row);
    }

    return data;
}

function getTop4TastingNotes(row) {
    // Get all tasting note scores
    const scores = TASTING_NOTE_COLUMNS.map(col => ({
        name: TASTE_MAP[col],
        score: parseInt(row[col]) || 0
    }));

    // Sort by score descending and take top 4
    const top4 = scores
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(s => s.name);

    // If less than 4, pad with defaults
    const defaults = ['Sweet', 'Bitter', 'Fruity', 'Floral'];
    while (top4.length < 4) {
        const next = defaults.find(d => !top4.includes(d));
        if (next) top4.push(next);
        else break;
    }

    return top4.slice(0, 4);
}

function getBrewMethods(row) {
    const methods = [];
    if (row['POUR OVER']) methods.push('Pour Over');
    if (row['ESPRESSO']) methods.push('Espresso');
    return methods.length > 0 ? methods : ['Pour Over'];
}

function getLocation(row) {
    const locations = [];
    if (row['HOME']) locations.push('Home');
    if (row['CAFE']) locations.push('Café');
    return locations.length > 0 ? locations.join(', ') : 'Home';
}

async function importCoffees() {
    console.log('Starting coffee import...');

    // Read both CSV files
    const response2024 = await fetch('./Austen Coffee Journal - 2024.csv');
    const text2024 = await response2024.text();
    const coffees2024 = await parseCSV(text2024);

    const response2025 = await fetch('./Austen Coffee Journal - 2025.csv');
    const text2025 = await response2025.text();
    const coffees2025 = await parseCSV(text2025);

    const allCoffees = [...coffees2024, ...coffees2025];
    console.log(`Found ${allCoffees.length} coffees to import`);

    let imported = 0;
    let errors = 0;

    for (const row of allCoffees) {
        try {
            const roasterName = row['ROASTER'];
            const coffeeName = row['NAME'];
            const originName = row['ORIGIN'];
            const regionName = row['REGION'];
            const processName = row['PROCESS'];
            const varietalName = row['VARIETAL'];
            const rating = row['OVERALL /10'];
            const tags = getTop4TastingNotes(row);
            const brewMethods = getBrewMethods(row);
            const location = getLocation(row);

            if (!roasterName || !coffeeName) {
                console.warn('Skipping row - missing roaster or name:', row);
                continue;
            }

            // Use the app's existing functions
            const roaster = await app.db.getOrCreateRef('roasters', roasterName);
            const origin = originName ? await app.db.getOrCreateRef('origins', originName) : null;
            const region = regionName ? await app.db.getOrCreateRef('regions', regionName) : null;
            const process = processName ? await app.db.getOrCreateRef('processes', processName) : null;
            const varietal = varietalName ? await app.db.getOrCreateRef('varietals', varietalName) : null;

            const coffeeData = {
                roasterId: roaster.id,
                originId: origin?.id || null,
                regionId: region?.id || null,
                processId: process?.id || null,
                varietalId: varietal?.id || null,
                name: coffeeName,
                brewMethods: brewMethods,
                location: location,
                rating: rating,
                tags: tags,
                gradient: app.generateGradient(tags)
            };

            await app.db.addCoffee(coffeeData);
            imported++;
            console.log(`✓ Imported: ${roasterName} - ${coffeeName}`);

        } catch (error) {
            errors++;
            console.error(`✗ Error importing coffee:`, row, error);
        }
    }

    console.log(`\nImport complete!`);
    console.log(`✓ Successfully imported: ${imported}`);
    console.log(`✗ Errors: ${errors}`);

    // Refresh the list
    await app.db.loadData();
    app.renderList();
    app.updateDatalists();
}

// Run the import
console.log('CSV Import script loaded. Run importCoffees() to start the import.');
// Uncomment the next line to auto-run:
// importCoffees();
