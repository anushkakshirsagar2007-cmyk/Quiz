// Admin Panel JavaScript
let currentEditingQuestion = null;
let refreshInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin panel
    initializeAdmin();
});

async function initializeAdmin() {
    // Check admin authentication
    const urlParams = new URLSearchParams(window.location.search);
    const adminAccess = urlParams.get('admin');
    const adminAuth = JSON.parse(sessionStorage.getItem('adminAuth') || '{}');
    
    if (adminAccess !== 'admin2024' && (!adminAuth.isAuthenticated)) {
        window.location.href = 'index.html';
        return;
    }
    
    if (adminAccess === 'admin2024') {
        sessionStorage.setItem('adminAuth', JSON.stringify({ isAuthenticated: true, loginTime: Date.now() }));
    }
    
    // Wait for Supabase
    let supabase = null;
    let attempts = 0;
    while ((!supabase || typeof supabase.from !== 'function') && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        if (!supabase && window.getSupabase) {
            supabase = window.getSupabase();
        }
    }
    
    if (!supabase || typeof supabase.from !== 'function') {
        console.error('Supabase not initialized');
        alert('Database not ready. Please refresh.');
        return;
    }
    
    // Load dashboard data
    loadDashboardData();
    loadQuestions();
    loadStudents();
    loadLeaderboard();
    
    // Start real-time updates
    startRealTimeUpdates();
}

function checkAdminAuth() {
    // For demo purposes, using simple session-based auth
    // In production, implement proper JWT authentication
    const adminAuth = getSession('adminAuth');
    return adminAuth && adminAuth.isAuthenticated;
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'questions':
            loadQuestions();
            break;
        case 'students':
            loadStudents();
            break;
        case 'monitoring':
            loadMonitoringData();
            break;
        case 'leaderboard':
            loadLeaderboard();
            break;
    }
}

async function loadDashboardData() {
    try {
        // Get total students
        const { data: students, error: studentsError } = await supabase
            .from('students')
            .select('*');
        
        if (studentsError) throw studentsError;
        
        // Get total questions
        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('*');
        
        if (questionsError) throw questionsError;
        
        // Get active quizzes (students who started but not completed)
        const activeQuizzes = students.filter(s => 
            s.has_attempted && !s.quiz_completed_at
        ).length;
        
        // Get completed quizzes
        const completedQuizzes = students.filter(s => 
            s.has_attempted && s.quiz_completed_at
        ).length;
        
        // Update dashboard
        document.getElementById('totalStudents').textContent = students.length;
        document.getElementById('totalQuestions').textContent = questions.length;
        document.getElementById('activeQuizzes').textContent = activeQuizzes;
        document.getElementById('completedQuizzes').textContent = completedQuizzes;
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data.');
    }
}

async function loadQuestions() {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('id');
        
        if (error) throw error;
        
        const tbody = document.getElementById('questionsTableBody');
        tbody.innerHTML = '';
        
        data.forEach(question => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${question.id}</td>
                <td>${question.question_text.substring(0, 50)}...</td>
                <td>A: ${question.option1.substring(0, 20)}..., B: ${question.option2.substring(0, 20)}...</td>
                <td>Option ${question.correct_answer}</td>
                <td><span class="badge badge-${question.difficulty}">${question.difficulty}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-small btn-edit" onclick="editQuestion(${question.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-delete" onclick="deleteQuestion(${question.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Failed to load questions.');
    }
}

async function loadStudents() {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('id', { ascending: false });
        
        if (error) throw error;
        
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';
        
        data.forEach(student => {
            const row = document.createElement('tr');
            const statusBadge = student.has_attempted ? 
                '<span class="badge badge-success">Completed</span>' : 
                '<span class="badge badge-warning">Not Started</span>';
            
            row.innerHTML = `
                <td>${student.full_name}</td>
                <td>${statusBadge}</td>
                <td>${student.quiz_score || '-'}</td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading students:', error);
        alert('Failed to load students: ' + error.message);
    }
}

async function loadMonitoringData() {
    try {
        // Get active sessions (students who started quiz recently)
        const { data: activeSessions, error } = await supabase
            .from('students')
            .select('*')
            .eq('has_attempted', true)
            .is('quiz_completed_at', null)
            .order('registered_at', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        
        const sessionsContainer = document.getElementById('activeSessions');
        sessionsContainer.innerHTML = '';
        
        if (activeSessions.length === 0) {
            sessionsContainer.innerHTML = '<p>No active quiz sessions.</p>';
        } else {
            activeSessions.forEach(session => {
                const sessionDiv = document.createElement('div');
                sessionDiv.className = 'session-item';
                sessionDiv.innerHTML = `
                    <strong>${session.full_name}</strong><br>
                    <small>Started: ${new Date(session.registered_at).toLocaleString()}</small>
                `;
                sessionsContainer.appendChild(sessionDiv);
            });
        }
        
        // Load recent activity
        loadRecentActivity();
        
    } catch (error) {
        console.error('Error loading monitoring data:', error);
        showError('Failed to load monitoring data.');
    }
}

async function loadRecentActivity() {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('has_attempted', true)
            .not('quiz_completed_at', 'is', null)
            .order('quiz_completed_at', { ascending: false })
            .limit(5);
        
        if (error) throw error;
        
        const activityContainer = document.getElementById('recentActivity');
        activityContainer.innerHTML = '';
        
        if (data.length === 0) {
            activityContainer.innerHTML = '<p>No recent activity.</p>';
        } else {
            data.forEach(activity => {
                const activityDiv = document.createElement('div');
                activityDiv.className = 'activity-item';
                activityDiv.innerHTML = `
                    <strong>${activity.full_name}</strong> completed quiz<br>
                    <small>Score: ${activity.quiz_score}% | 
                    ${new Date(activity.quiz_completed_at).toLocaleString()}</small>
                `;
                activityContainer.appendChild(activityDiv);
            });
        }
        
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

async function loadLeaderboard() {
    try {
        // Get all students and rank them by score
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('quiz_score', { ascending: false })
            .order('quiz_completed_at', { ascending: true });
        
        if (error) throw error;
        
        const tbody = document.getElementById('leaderboardTableBody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No students registered yet.</td></tr>';
            return;
        }
        
        data.forEach((student, index) => {
            const row = document.createElement('tr');
            
            // Calculate rank
            let rank = index + 1;
            let rankDisplay = rank;
            
            // Add rank badges for top 3
            if (rank === 1 && student.quiz_score !== null) {
                rankDisplay = '🥇';
            } else if (rank === 2 && student.quiz_score !== null) {
                rankDisplay = '🥈';
            } else if (rank === 3 && student.quiz_score !== null) {
                rankDisplay = '🥉';
            }
            
            // Determine status
            let status = 'Not Started';
            let statusClass = 'badge-warning';
            
            if (student.has_attempted) {
                if (student.quiz_completed_at) {
                    status = 'Completed';
                    statusClass = 'badge-success';
                } else {
                    status = 'In Progress';
                    statusClass = 'badge-info';
                }
            }
            
            row.innerHTML = `
                <td><strong>${rankDisplay}</strong></td>
                <td>${student.full_name}</td>
                <td><strong>${student.quiz_score || '0'}</strong></td>
                <td><span class="badge ${statusClass}">${status}</span></td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        alert('Failed to load student rankings.');
    }
}

// Question Management
function openAddQuestionModal() {
    currentEditingQuestion = null;
    document.getElementById('questionModalTitle').innerHTML = '<i class="fas fa-plus"></i> Add Question';
    document.getElementById('questionForm').reset();
    document.getElementById('questionModal').classList.add('active');
}

function editQuestion(questionId) {
    currentEditingQuestion = questionId;
    document.getElementById('questionModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Question';
    
    // Load question data into form
    supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single()
        .then(({ data, error }) => {
            if (error) {
                console.error('Error loading question:', error);
                return;
            }
            
            document.getElementById('questionText').value = data.question_text;
            document.getElementById('option1').value = data.option1;
            document.getElementById('option2').value = data.option2;
            document.getElementById('option3').value = data.option3;
            document.getElementById('option4').value = data.option4;
            document.getElementById('correctAnswer').value = data.correct_answer;
            document.getElementById('difficulty').value = data.difficulty;
            
            document.getElementById('questionModal').classList.add('active');
        });
}

function closeQuestionModal() {
    document.getElementById('questionModal').classList.remove('active');
    document.getElementById('questionForm').reset();
    currentEditingQuestion = null;
}

async function saveQuestion() {
    const formData = {
        question_text: document.getElementById('questionText').value,
        option1: document.getElementById('option1').value,
        option2: document.getElementById('option2').value,
        option3: document.getElementById('option3').value,
        option4: document.getElementById('option4').value,
        correct_answer: parseInt(document.getElementById('correctAnswer').value),
        difficulty: document.getElementById('difficulty').value
    };
    
    // Validate form
    if (!formData.question_text || !formData.option1 || !formData.option2 || 
        !formData.option3 || !formData.option4 || !formData.correct_answer) {
        showError('Please fill in all fields');
        return;
    }
    
    try {
        if (currentEditingQuestion) {
            // Update existing question
            const { error } = await supabase
                .from('questions')
                .update(formData)
                .eq('id', currentEditingQuestion);
            
            if (error) throw error;
            showSuccess('Question updated successfully!');
        } else {
            // Add new question
            const { error } = await supabase
                .from('questions')
                .insert([formData]);
            
            if (error) throw error;
            showSuccess('Question added successfully!');
        }
        
        closeQuestionModal();
        loadQuestions();
        
    } catch (error) {
        console.error('Error saving question:', error);
        showError('Failed to save question.');
    }
}

async function deleteQuestion(questionId) {
    if (!confirm('Are you sure you want to delete this question?')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('questions')
            .delete()
            .eq('id', questionId);
        
        if (error) throw error;
        
        showSuccess('Question deleted successfully!');
        loadQuestions();
        
    } catch (error) {
        console.error('Error deleting question:', error);
        showError('Failed to delete question.');
    }
}

// Utility Functions
function refreshQuestions() {
    loadQuestions();
}

function refreshStudents() {
    loadStudents();
}

function exportStudents() {
    // Implement CSV export functionality
    alert('Export functionality would be implemented here.');
}

function startRealTimeUpdates() {
    // Refresh dashboard every 30 seconds
    refreshInterval = setInterval(() => {
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadDashboardData();
        }
        if (document.getElementById('monitoring').classList.contains('active')) {
            loadMonitoringData();
        }
    }, 30000);
}

function logout() {
    removeSession('adminAuth');
    window.location.href = 'index.html';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const questionModal = document.getElementById('questionModal');
    if (event.target === questionModal) {
        closeQuestionModal();
    }
};

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});
