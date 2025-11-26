class DB {
    constructor() {
        this.data = { roasters: [], origins: [], regions: [], processes: [], varietals: [], coffees: [] };
    }

    async load() {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }

        // Load reference data
        const [r, o, reg, p, v] = await Promise.all([
            supabaseClient.from('roasters').select('*').order('name'),
            supabaseClient.from('origins').select('*').order('name'),
            supabaseClient.from('regions').select('*').order('name'),
            supabaseClient.from('processes').select('*').order('name'),
            supabaseClient.from('varietals').select('*').order('name')
        ]);

        this.data.roasters = r.data || [];
        this.data.origins = o.data || [];
        this.data.regions = reg.data || [];
        this.data.processes = p.data || [];
        this.data.varietals = v.data || [];

        // Load coffees with related data
        const { data: coffees, error } = await supabaseClient
            .from('coffees')
            .select(`
                *,
                roasters (name),
                origins (name),
                regions (name),
                processes (name),
                varietals (name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading coffees:', error);
            return;
        }

        if (coffees) {
            this.data.coffees = coffees.map(c => ({
                id: c.id,
                name: c.name,
                roasterId: c.roaster_id,
                roasterName: c.roasters?.name || '',
                originId: c.origin_id,
                originName: c.origins?.name || '',
                regionId: c.region_id,
                regionName: c.regions?.name || '',
                processId: c.process_id,
                processName: c.processes?.name || '',
                varietalId: c.varietal_id,
                varietalName: c.varietals?.name || '',
                rating: c.rating,
                brewMethods: c.brew_methods || [],
                tags: c.tasting_notes || [],
                location: c.location || '',
                gradient: c.gradient
            }));
        }
    }

    async getOrCreateRef(table, name) {
        if (!name) return null;
        const list = this.data[table]; // e.g. this.data.roasters

        // Check local cache
        let item = list.find(i => i.name.toLowerCase() === name.toLowerCase());
        if (item) return item;

        // Check DB (in case it was added by another device)
        const { data: existing } = await supabaseClient
            .from(table)
            .select('*')
            .ilike('name', name)
            .maybeSingle();

        if (existing) {
            this.data[table].push(existing);
            return existing;
        }

        // Create new
        const { data: created, error } = await supabaseClient
            .from(table)
            .insert({ name: name })
            .select()
            .single();

        if (error) {
            console.error(`Error creating ${table}:`, error);
            return null;
        }

        this.data[table].push(created);
        return created;
    }

    async addCoffee(coffee) {
        const { data, error } = await supabaseClient
            .from('coffees')
            .insert({
                name: coffee.name,
                roaster_id: coffee.roasterId,
                origin_id: coffee.originId,
                region_id: coffee.regionId,
                process_id: coffee.processId,
                varietal_id: coffee.varietalId,
                rating: coffee.rating,
                brew_methods: coffee.brewMethods,
                tasting_notes: coffee.tags,
                location: coffee.location,
                gradient: coffee.gradient
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding coffee:', error);
            alert('Failed to save coffee');
            return;
        }

        // Reload to get full joined names or manually construct
        await this.load();
    }

    async updateCoffee(id, coffee) {
        const { error } = await supabaseClient
            .from('coffees')
            .update({
                name: coffee.name,
                roaster_id: coffee.roasterId,
                origin_id: coffee.originId,
                region_id: coffee.regionId,
                process_id: coffee.processId,
                varietal_id: coffee.varietalId,
                rating: coffee.rating,
                brew_methods: coffee.brewMethods,
                tasting_notes: coffee.tags,
                location: coffee.location,
                gradient: coffee.gradient
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating coffee:', error);
            alert('Failed to update coffee');
            return;
        }

        await this.load();
    }

    async deleteCoffee(id) {
        const { error } = await supabaseClient
            .from('coffees')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting coffee:', error);
            alert('Failed to delete coffee');
            return;
        }

        await this.load();
    }

    getStats() {
        return {
            total: this.data.coffees.length,
            roasters: new Set(this.data.coffees.map(c => c.roasterId)).size,
            origins: new Set(this.data.coffees.map(c => c.originId)).size,
            processes: new Set(this.data.coffees.map(c => c.processId).filter(Boolean)).size,
            varietals: new Set(this.data.coffees.map(c => c.varietalId).filter(Boolean)).size,
            avgRating: this.data.coffees.length ? (this.data.coffees.reduce((a, b) => a + parseFloat(b.rating), 0) / this.data.coffees.length).toFixed(1) : 0
        };
    }
}
