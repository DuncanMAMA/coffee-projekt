// Authentication Manager
class Auth {
    constructor() {
        this.currentUser = null;
        this.onAuthStateChange = null;
    }

    async init() {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }

        // Get initial session
        const { data: { session } } = await supabaseClient.auth.getSession();
        this.currentUser = session?.user || null;

        // Listen for auth changes
        supabaseClient.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            if (this.onAuthStateChange) {
                this.onAuthStateChange(this.currentUser);
            }
        });
    }

    async signUp(email, password) {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) throw error;
        return data;
    }

    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;
        return data;
    }

    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUserId() {
        return this.currentUser?.id || null;
    }

    getUserEmail() {
        return this.currentUser?.email || null;
    }
}

// Global auth instance
window.auth = new Auth();
