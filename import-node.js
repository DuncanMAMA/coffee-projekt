// Node.js CSV Import Script for Coffee Backlog
// Run with: node import-node.js

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');

// Supabase configuration
const SUPABASE_URL = 'https://tprjmnxyhcfonrtujdgf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcmptbnh5aGNmb25ydHVqZGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjI5MjgsImV4cCI6MjA3OTMzODkyOH0.7euP4JipRn07U8rxJ-SmfeXREfvCFWR5Z8qcKdoAi9s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tasting note mapping
const TASTING_NOTE_COLUMNS = [
    'SWEET', 'ACIDIC', 'FLORAL', 'SPICE', 'FERMENTED',
    'BERRY FRUIT', 'CITRUS FRUIT', 'STONE FRUIT', 'VEGETIVE',
    'CHOCOLATE', 'CARAMEL', 'ROASTED', 'BITTER', 'SAVORY'
];

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

// Tasting note colors (from app.js TAGS array)
const TAG_COLORS = {
    'Sweet': '#FFE5B4',
    'Bitter': '#8B4513',
    'Fruity': '#FF6B9D',
    'Nutty': '#D2691E',
    'Chocolate': '#6F4E37',
    'Caramel': '#C68E17',
    'Floral': '#E6B0FF',
    'Bright': '#FFE135',
    'Citrus': '#FFA500',
    'Berry': '#8E4585',
    'Stone Fruit': '#FFB347',
    'Herbal': '#90EE90',
    'Spicy': '#DC143C',
    'Funky': '#9370DB',
    'Roasted': '#654321',
    'Savory': '#8B7355'
};

function getTop4TastingNotes(row) {
    const scores = TASTING_NOTE_COLUMNS.map(col => ({
        name: TASTE_MAP[col],
        score: parseInt(row[col]) || 0
    }));

    const top4 = scores
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(s => s.name);

    const defaults = ['Sweet', 'Bitter', 'Fruity', 'Floral'];
    while (top4.length < 4) {
        const next = defaults.find(d => !top4.includes(d));
        if (next) top4.push(next);
        else break;
    }

    return top4.slice(0, 4);
}

function generateGradient(tags) {
    const colors = tags.map(tag => TAG_COLORS[tag] || '#CCCCCC');
    return `radial-gradient(circle at 50% 50%, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`;
}

function getBrewMethods(row) {
    const methods = [];
    if (row['POUR OVER']) methods.push('Pour Over');
    if (row['ESPRESSO']) methods.push('Espresso');
    return methods.length > 0 ? methods.join(', ') : 'Pour Over';
}

function getLocation(row) {
    const locations = [];
    if (row['HOME']) locations.push('Home');
    if (row['CAFE']) locations.push('Café');
    return locations.length > 0 ? locations.join(', ') : 'Home';
}

async function getOrCreateRef(tableName, name) {
    if (!name) return null;

    // First check if it exists
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .ilike('name', name) // Use ilike for case-insensitive match
        .maybeSingle();

    if (data) return data;

    // If not, create it
    const { data: newData, error: insertError } = await supabase
        .from(tableName)
        .insert({ name })
        .select()
        .single();

    if (insertError) {
        // Handle race condition where it might have been created in parallel
        if (insertError.code === '23505') { // Unique violation
            const { data: retryData } = await supabase
                .from(tableName)
                .select('*')
                .ilike('name', name)
                .maybeSingle();
            return retryData;
        }
        console.error(`Error creating ${tableName} ref for ${name}:`, insertError.message);
        return null;
    }

    return newData;
}

async function importCoffees() {
    console.log('🔥 Starting coffee import...\n');

    const files = [
        './Austen Coffee Journal - 2024.csv',
        './Austen Coffee Journal - 2025.csv'
    ];

    let imported = 0;
    let errors = 0;

    for (const file of files) {
        if (!fs.existsSync(file)) {
            console.warn(`⚠️  File not found: ${file}`);
            continue;
        }

        console.log(`Processing ${file}...`);
        const fileContent = fs.readFileSync(file, 'utf-8');

        // Parse CSV with robust options
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true // Handle potential trailing commas or inconsistent rows
        });

        for (const row of records) {
            try {
                // Skip header-like rows or empty rows that might have slipped through
                if (row['ROASTER'] === 'ROASTER' || !row['ROASTER']) continue;

                const roasterName = row['ROASTER'];
                const coffeeName = row['NAME'];
                const originName = row['ORIGIN'];
                const regionName = row['REGION'];
                const processName = row['PROCESS'];
                const varietalName = row['VARIETAL'];
                const rating = row['OVERALL /10'];

                // Skip if essential data is missing
                if (!roasterName || !coffeeName) continue;

                const tags = getTop4TastingNotes(row);
                const brewMethods = getBrewMethods(row);
                const location = getLocation(row);

                // Get or create references
                const roaster = await getOrCreateRef('roasters', roasterName);
                const origin = originName ? await getOrCreateRef('origins', originName) : null;
                const region = regionName ? await getOrCreateRef('regions', regionName) : null;
                const process = processName ? await getOrCreateRef('processes', processName) : null;
                const varietal = varietalName ? await getOrCreateRef('varietals', varietalName) : null;

                if (!roaster) {
                    console.error(`Could not get/create roaster: ${roasterName}`);
                    errors++;
                    continue;
                }

                const coffeeData = {
                    roaster_id: roaster.id,
                    origin_id: origin?.id || null,
                    region_id: region?.id || null,
                    process_id: process?.id || null,
                    varietal_id: varietal?.id || null,
                    name: coffeeName,
                    brew_methods: brewMethods,
                    location: location,
                    rating: rating,
                    tasting_notes: tags, // Note: DB column is tasting_notes, not tags
                    gradient: generateGradient(tags)
                };

                const { error: insertError } = await supabase.from('coffees').insert(coffeeData);

                if (insertError) {
                    throw insertError;
                }

                imported++;
                console.log(`✓ Imported: ${roasterName} - ${coffeeName}`);

            } catch (error) {
                errors++;
                console.error(`✗ Error importing row: ${error.message}`);
            }
        }
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`✓ Successfully imported: ${imported}`);
    console.log(`✗ Errors: ${errors}`);
}

// Run the import
importCoffees().catch(console.error);
