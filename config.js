// Supabase Configuration
const SUPABASE_URL = 'https://jhlaepswenzmbkzjabyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpobGFlcHN3ZW56bWJremphYnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODUxMDYsImV4cCI6MjA4NTk2MTEwNn0.O4l7b_wNbjxL8FZDVBpigKQ5qehFGNqd166TmXomKyQ';

// Global supabase client - use unique variable name
let supabaseClient = null;

// Try to initialize immediately (if script already loaded)
if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized immediately');
    } catch (e) {
        console.error('❌ Immediate init failed:', e);
    }
}

// Also initialize when DOM is ready (backup)
document.addEventListener('DOMContentLoaded', function() {
    if (!supabaseClient && window.supabase && window.supabase.createClient) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized on DOM ready');
        } catch (e) {
            console.error('❌ DOM ready init failed:', e);
        }
    }
    
    // Expose to global scope after initialization
    window.supabaseClient = supabaseClient;
    window.supabase = supabaseClient;
});

// Quiz Config
const QUIZ_CONFIG = {
    TIME_LIMIT: 1200,
    WARNING_COUNT_LIMIT: 3,
    QUESTIONS_PER_QUIZ: 30,
    PASSING_SCORE: 70
};

// Admin Credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Utility Functions
function generateUserId() {
    return 'USR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function setSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function getSession(key) {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

function removeSession(key) {
    sessionStorage.removeItem(key);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhoneNumber(phone) {
    return /^[0-9]{10}$/.test(phone);
}

function validateStudentId(studentId) {
    return studentId.length >= 5;
}

function showError(message) {
    console.error(message);
    alert(message);
}

// Export everything to global scope
window.QUIZ_CONFIG = QUIZ_CONFIG;
window.ADMIN_CREDENTIALS = ADMIN_CREDENTIALS;
window.generateUserId = generateUserId;
window.generatePassword = generatePassword;
window.formatTime = formatTime;
window.setSession = setSession;
window.getSession = getSession;
window.removeSession = removeSession;
window.validateEmail = validateEmail;
window.validatePhoneNumber = validatePhoneNumber;
window.validateStudentId = validateStudentId;
window.showError = showError;

// Helper function to get supabase (use this in other files)
window.getSupabase = function() {
    if (!supabaseClient) {
        // Try to initialize one more time
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabaseClient = supabaseClient;
            window.supabase = supabaseClient;
        }
    }
    return supabaseClient;
};
