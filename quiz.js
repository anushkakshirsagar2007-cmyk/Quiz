// Quiz Page JavaScript
let currentUser = null;
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;
let timerInterval = null;
let timeRemaining = QUIZ_CONFIG.TIME_LIMIT;
let warningCount = 0;
let quizTerminated = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
});

async function initializeQuiz() {
    // Check if user is logged in
    currentUser = getSession('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display student info
    document.getElementById('studentName').textContent = currentUser.full_name;
    document.getElementById('studentId').textContent = currentUser.full_name;
    
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
    
    // Start quiz timer
    quizStartTime = Date.now();
    startTimer();
    
    // Load questions
    await loadQuestions();
    
    // Set up tab switching detection
    setupTabSwitchingDetection();
    
    // Display first question
    displayQuestion();
}

async function loadQuestions() {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('id');
        
        if (error) throw error;
        
        // Transform data to match expected format
        questions = data.map(q => ({
            id: q.id,
            question_text: q.question_text,
            option1: q.option1,
            option2: q.option2,
            option3: q.option3,
            option4: q.option4,
            correct_answer: q.correct_answer
        }));
        
        // Shuffle and limit
        questions = shuffleArray(questions).slice(0, QUIZ_CONFIG.QUESTIONS_PER_QUIZ);
        
        // Initialize user answers array
        userAnswers = new Array(questions.length).fill(null);
        
        // Update total questions display
        document.getElementById('totalQuestions').textContent = questions.length;
        
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Failed to load questions. Please refresh the page.');
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showSubmitButton();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Update question number
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    
    // Display question text
    document.getElementById('questionText').textContent = question.question_text;
    
    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    const options = [
        question.option1,
        question.option2,
        question.option3,
        question.option4
    ];
    
    options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (userAnswers[currentQuestionIndex] === index + 1) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <input type="radio" id="option${index + 1}" name="answer" value="${index + 1}" 
                   ${userAnswers[currentQuestionIndex] === index + 1 ? 'checked' : ''}>
            <label for="option${index + 1}">${option}</label>
        `;
        
        optionDiv.addEventListener('click', function() {
            selectOption(index + 1);
        });
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    updateNavigationButtons();
}

function selectOption(optionNumber) {
    userAnswers[currentQuestionIndex] = optionNumber;
    
    // Update UI
    document.querySelectorAll('.option').forEach((option, index) => {
        option.classList.toggle('selected', index === optionNumber - 1);
    });
    
    // Update radio button
    document.getElementById(`option${optionNumber}`).checked = true;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Previous button
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // Next/Submit button
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function showSubmitButton() {
    document.getElementById('nextBtn').classList.add('hidden');
    document.getElementById('submitBtn').classList.remove('hidden');
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer').textContent = formatTime(timeRemaining);
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function setupTabSwitchingDetection() {
    let hiddenTime = 0;
    let warningShown = false;
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            hiddenTime = Date.now();
        } else {
            const visibleTime = Date.now();
            const hiddenDuration = visibleTime - hiddenTime;
            
            // If tab was hidden for more than 2 seconds
            if (hiddenDuration > 2000 && !quizTerminated) {
                handleTabSwitching();
            }
        }
    });
    
    window.addEventListener('blur', function() {
        if (!quizTerminated) {
            handleTabSwitching();
        }
    });
    
    window.addEventListener('focus', function() {
        // User returned to the quiz
    });
    
    // Prevent right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        handleTabSwitching();
    });
    
    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            handleTabSwitching();
        }
    });
}

function handleTabSwitching() {
    warningCount++;
    
    const warningBanner = document.getElementById('warningBanner');
    const warningMessage = document.getElementById('warningMessage');
    const warningCountSpan = document.getElementById('warningCount');
    
    warningBanner.classList.remove('hidden');
    warningCountSpan.textContent = `Warnings: ${warningCount}/${QUIZ_CONFIG.WARNING_COUNT_LIMIT}`;
    
    if (warningCount >= QUIZ_CONFIG.WARNING_COUNT_LIMIT) {
        terminateQuiz('Maximum warning limit reached due to tab switching or window minimization.');
    } else {
        // Hide warning after 5 seconds
        setTimeout(() => {
            warningBanner.classList.add('hidden');
        }, 5000);
    }
}

function terminateQuiz(reason) {
    quizTerminated = true;
    clearInterval(timerInterval);
    
    document.getElementById('terminationReason').textContent = reason;
    document.getElementById('terminationModal').classList.add('active');
    
    // Save partial progress
    saveQuizResults(true);
}

function submitQuiz() {
    if (quizTerminated) return;
    
    // Check if all questions are answered
    const answeredQuestions = userAnswers.filter(answer => answer !== null).length;
    
    if (answeredQuestions < questions.length) {
        document.getElementById('answeredCount').textContent = answeredQuestions;
        document.getElementById('totalCount').textContent = questions.length;
        document.getElementById('confirmSubmitModal').classList.add('active');
    } else {
        confirmSubmit();
    }
}

function closeConfirmSubmitModal() {
    document.getElementById('confirmSubmitModal').classList.remove('active');
}

async function confirmSubmit() {
    closeConfirmSubmitModal();
    clearInterval(timerInterval);
    
    await saveQuizResults(false);
    // Redirect to thank you page instead of showing results
    window.location.href = 'thank-you.html';
}

async function saveQuizResults(terminated) {
    try {
        // Calculate score
        let score = 0;
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correct_answer) {
                score++;
            }
        });
        
        const percentage = Math.round((score / questions.length) * 100);
        
        // Update student record (only columns in simplified schema)
        const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
        const { error } = await supabase
            .from('students')
            .update({
                has_attempted: true,
                quiz_score: percentage,
                quiz_completed_at: new Date().toISOString(),
                time_taken: timeTaken,
                correct_answers: score
            })
            .eq('id', currentUser.id);
        
        if (error) throw error;
        
        // Store results for display
        setSession('quizResults', {
            score: percentage,
            totalQuestions: questions.length,
            correctAnswers: score,
            timeTaken: formatTime(timeTaken),
            percentage: percentage,
            terminated: terminated
        });
        
    } catch (error) {
        console.error('Error saving quiz results:', error);
        showError('Failed to save quiz results.');
    }
}

function showQuizResults() {
    const results = getSession('quizResults');
    
    if (!results) {
        showError('No results found.');
        return;
    }
    
    // Hide quiz container
    document.getElementById('quizContainer').classList.add('hidden');
    
    // Show summary
    document.getElementById('quizSummary').classList.remove('hidden');
    
    // Display results
    document.getElementById('finalScore').textContent = results.correctAnswers;
    document.getElementById('maxScore').textContent = results.totalQuestions;
    document.getElementById('timeTaken').textContent = results.timeTaken;
    document.getElementById('accuracy').textContent = results.percentage + '%';
    
    // Display submission time
    const submittedAt = new Date().toLocaleString();
    document.getElementById('submittedAt').textContent = submittedAt;
    
    if (results.terminated) {
        document.querySelector('.summary-card h2').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Quiz Terminated';
    }
}

function viewResults() {
    // Could implement detailed results view here
    alert('Detailed results view would be implemented here.');
}

function logout() {
    removeSession('currentUser');
    removeSession('quizResults');
    window.location.href = 'index.html';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const confirmModal = document.getElementById('confirmSubmitModal');
    const terminationModal = document.getElementById('terminationModal');
    
    if (event.target === confirmModal) {
        closeConfirmSubmitModal();
    }
    if (event.target === terminationModal) {
        logout();
    }
}

// Prevent page refresh during quiz
window.addEventListener('beforeunload', function(e) {
    if (!quizTerminated && currentUser) {
        e.preventDefault();
        e.returnValue = 'Your quiz progress will be lost. Are you sure you want to leave?';
    }
});

// Shuffle array utility function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
