// Authentication UI helper functions
async function handleSignUp() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    const btn = document.getElementById('signup-btn');
    btn.disabled = true;
    btn.innerText = 'Creating account...';

    try {
        await window.auth.signUp(email, password);
        alert('Account created! Please check your email to confirm your account, then sign in.');
        showSignIn();
    } catch (error) {
        console.error('Sign up error:', error);
        alert('Sign up failed: ' + (error.message || 'Unknown error'));
    } finally {
        btn.disabled = false;
        btn.innerText = 'Sign Up';
    }
}

async function handleSignIn() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    const btn = document.getElementById('signin-btn');
    btn.disabled = true;
    btn.innerText = 'Signing in...';

    try {
        await window.auth.signIn(email, password);
        // Auth state change will trigger app initialization
    } catch (error) {
        console.error('Sign in error:', error);
        alert('Sign in failed: ' + (error.message || 'Invalid email or password'));
        btn.disabled = false;
        btn.innerText = 'Sign In';
    }
}

function showSignUp() {
    document.getElementById('auth-title').innerText = 'Create Account';
    document.getElementById('signin-btn').style.display = 'none';
    document.getElementById('signup-btn').style.display = 'block';
    document.getElementById('toggle-auth').innerHTML = 'Already have an account? <a href="#" onclick="showSignIn(); return false;">Sign In</a>';
}

function showSignIn() {
    document.getElementById('auth-title').innerText = 'Sign In';
    document.getElementById('signup-btn').style.display = 'none';
    document.getElementById('signin-btn').style.display = 'block';
    document.getElementById('toggle-auth').innerHTML = 'Don\'t have an account? <a href="#" onclick="showSignUp(); return false;">Sign Up</a>';

    // Clear fields
    document.getElementById('auth-email').value = '';
    document.getElementById('auth-password').value = '';
}
