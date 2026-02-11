// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLogin);
});

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const fullName = formData.get('userId');
    const password = formData.get('password');
    
    if (!fullName || !password) {
        showError('Please enter both Name and Password');
        return;
    }
    
    // Wait for Supabase to be ready
    let supabase = null;
    let attempts = 0;
    while ((!supabase || typeof supabase.from !== 'function') && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        
        // Try to get supabase using helper
        if (!supabase && window.getSupabase) {
            supabase = window.getSupabase();
        }
    }
    
    if (!supabase || typeof supabase.from !== 'function') {
        showError('Database not ready. Please refresh the page and try again.');
        console.error('Supabase not initialized:', typeof window.supabaseClient, window.supabaseClient);
        return;
    }
    
    try {
        const { data: student, error } = await supabase
            .from('students')
            .select('*')
            .eq('full_name', fullName)
            .eq('password', password)
            .single();
        
        if (error || !student) {
            showError('Invalid Name or Password');
            return;
        }
        
        if (student.has_attempted) {
            showAlreadyAttemptedModal();
            return;
        }
        
        sessionStorage.setItem('currentUser', JSON.stringify(student));
        window.location.href = 'quiz.html';
        
    } catch (error) {
        showError('Login failed: ' + error.message);
    }
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.add('active');
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.add('active');
}

function closeErrorModal() {
    document.getElementById('errorModal').classList.remove('active');
}

function showAlreadyAttemptedModal() {
    document.getElementById('alreadyAttemptedModal').classList.add('active');
}

function closeAlreadyAttemptedModal() {
    document.getElementById('alreadyAttemptedModal').classList.remove('active');
}

function logout() {
    window.removeSession('currentUser');
    window.location.href = 'index.html';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const errorModal = document.getElementById('errorModal');
    const attemptedModal = document.getElementById('alreadyAttemptedModal');
    
    if (event.target === errorModal) {
        closeErrorModal();
    }
    if (event.target === attemptedModal) {
        closeAlreadyAttemptedModal();
    }
}
