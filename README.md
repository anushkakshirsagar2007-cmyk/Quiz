# AIML Quiz Competition Website

A comprehensive quiz competition platform for the AIML department with secure authentication, real-time monitoring, and anti-cheating features.

## Features

### Student Features
- **Secure Registration**: Auto-generated User ID and password for each student
- **One-Attempt Restriction**: Each student can attempt the quiz only once
- **Anti-Cheating System**: Tab switching detection and prevention
- **Timed Quiz**: 30-minute timer with automatic submission
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features
- **Question Management**: Add, edit, and delete quiz questions
- **Student Monitoring**: View registered students and their quiz status
- **Live Monitoring**: Real-time tracking of active quiz sessions
- **Leaderboard**: Display results based on score and completion time
- **Dashboard**: Comprehensive statistics and overview

### Security Features
- Tab switching and window minimization detection
- Right-click and developer tools prevention
- Warning system with quiz termination on violations
- Secure session management
- Input validation and sanitization

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Real-time)
- **UI Framework**: Custom CSS with Font Awesome icons
- **Authentication**: Supabase Auth with custom credentials

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the following SQL in your Supabase SQL Editor:

```sql
-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    has_attempted BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER,
    quiz_completed_at TIMESTAMP WITH TIME ZONE,
    time_taken INTEGER,
    questions_answered INTEGER,
    quiz_terminated BOOLEAN DEFAULT FALSE,
    warning_count INTEGER DEFAULT 0
);

-- Create questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option1 VARCHAR(255) NOT NULL,
    option2 VARCHAR(255) NOT NULL,
    option3 VARCHAR(255) NOT NULL,
    option4 VARCHAR(255) NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 1 AND 4),
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample questions
INSERT INTO questions (question_text, option1, option2, option3, option4, correct_answer, difficulty) VALUES
('What does AI stand for?', 'Artificial Intelligence', 'Automated Intelligence', 'Advanced Intelligence', 'Applied Intelligence', 1, 'easy'),
('Which algorithm is commonly used for classification?', 'K-Means', 'Linear Regression', 'Decision Tree', 'PCA', 3, 'medium'),
('What is the purpose of activation functions in neural networks?', 'To normalize data', 'To introduce non-linearity', 'To reduce dimensions', 'To handle missing values', 2, 'medium'),
('Which library is primarily used for data manipulation in Python?', 'TensorFlow', 'Pandas', 'PyTorch', 'Keras', 2, 'easy'),
('What is overfitting in machine learning?', 'When model performs well on training data but poorly on test data', 'When model performs poorly on both training and test data', 'When model has too few parameters', 'When model converges too quickly', 1, 'medium'),
('Which technique is used to prevent overfitting?', 'Increasing model complexity', 'Adding more features', 'Regularization', 'Reducing training data', 3, 'medium'),
('What is the difference between supervised and unsupervised learning?', 'Supervised learning uses labeled data, unsupervised uses unlabeled', 'Supervised learning is faster', 'Unsupervised learning requires more data', 'There is no difference', 1, 'easy'),
('Which metric is used to evaluate classification models?', 'Mean Squared Error', 'R-squared', 'Accuracy', 'MAE', 3, 'easy'),
('What is a neural network?', 'A database system', 'A computing system inspired by biological neural networks', 'A sorting algorithm', 'A data structure', 2, 'easy'),
('Which optimization algorithm is commonly used in deep learning?', 'Gradient Descent', 'Quick Sort', 'Binary Search', 'Hash Table', 1, 'medium');

-- Create indexes for better performance
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_has_attempted ON students(has_attempted);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
```

### 2. Configuration

1. Open `config.js`
2. Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your Supabase credentials
3. Adjust quiz configuration settings as needed

### 3. Admin Access

For demo purposes, the admin panel uses simple session-based authentication. In production, implement proper authentication:

- Username: `admin`
- Password: `admin123`

## Usage Guide

### For Students

1. **Registration**: Visit the website and click "Register Now"
2. **Fill Details**: Complete the registration form with accurate information
3. **Save Credentials**: Note down the auto-generated User ID and password
4. **Login**: Use the credentials to access the quiz
5. **Take Quiz**: Answer all questions within the time limit
6. **Submit**: Submit the quiz to view your results

### For Administrators

1. **Access Admin Panel**: Click "Admin Panel" on the homepage
2. **Login**: Use admin credentials
3. **Manage Questions**: Add, edit, or delete quiz questions
4. **Monitor Students**: View registered students and their progress
5. **View Results**: Check the leaderboard for rankings
6. **Real-time Monitoring**: Track active quiz sessions

## File Structure

```
windsurf-project-2/
├── index.html          # Homepage
├── register.html       # Student registration
├── login.html          # Student login
├── quiz.html           # Quiz interface
├── admin.html          # Admin panel
├── styles.css          # Complete styling
├── config.js           # Configuration and utilities
├── register.js         # Registration functionality
├── login.js            # Login functionality
├── quiz.js             # Quiz logic and anti-cheating
├── admin.js            # Admin panel functionality
└── README.md           # This file
```

## Security Considerations

- **Tab Switching Detection**: Monitors visibility API and window focus
- **Developer Tools Prevention**: Blocks F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
- **Right-click Prevention**: Disables context menu
- **Session Management**: Secure session storage for user data
- **Input Validation**: Client-side and server-side validation
- **One-Attempt Policy**: Database-enforced restriction

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Mobile Responsiveness

The website is fully responsive and works on:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktops (1024px+)

## Performance Optimization

- Lazy loading of questions
- Efficient DOM manipulation
- Optimized CSS with flexbox/grid
- Minimal external dependencies
- Compressed assets

## Future Enhancements

- Email notifications for registration
- Advanced analytics and reporting
- Multiple quiz categories
- Question bank management
- Export results to PDF/Excel
- Integration with learning management systems

## Support

For issues or questions, please contact the AIML department technical team.

## License

This project is developed for educational purposes within the AIML department.
