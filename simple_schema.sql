-- Simplified students table (minimal)
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    has_attempted BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER,
    quiz_completed_at TIMESTAMP WITH TIME ZONE,
    time_taken INTEGER,
    correct_answers INTEGER
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option1 VARCHAR(255) NOT NULL,
    option2 VARCHAR(255) NOT NULL,
    option3 VARCHAR(255) NOT NULL,
    option4 VARCHAR(255) NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 1 AND 4)
);

-- Insert sample students
INSERT INTO students (full_name, password, has_attempted, quiz_score, quiz_completed_at) VALUES
('John Doe', 'pass123', false, null, null),
('Jane Smith', 'pass456', false, null, null),
('Alice Johnson', 'alice2024', false, null, null),
('Bob Williams', 'bobpass', false, null, null),
('Charlie Brown', 'charlie567', false, null, null);

-- Insert sample questions
INSERT INTO questions (question_text, option1, option2, option3, option4, correct_answer) VALUES
('What does AI stand for?', 'Artificial Intelligence', 'Automated Interface', 'Advanced Integration', 'Applied Information', 1),
('Which of the following is a type of Machine Learning?', 'Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'All of the above', 4),
('What is the primary goal of Machine Learning?', 'To make computers see', 'To enable computers to learn from data', 'To create robots', 'To build websites', 2),
('Which algorithm is used for classification?', 'Linear Regression', 'K-Means', 'Decision Trees', 'None of the above', 3),
('What is a neural network inspired by?', 'Computer circuits', 'Human brain', 'Mathematical equations', 'Statistical models', 2),
('Which Python library is commonly used for Machine Learning?', 'NumPy', 'Pandas', 'Scikit-learn', 'All of the above', 4),
('What is overfitting in Machine Learning?', 'Model performs well on training data but poorly on new data', 'Model performs well on all data', 'Model has too few parameters', 'Model uses too little data', 1),
('Which activation function outputs values between 0 and 1?', 'ReLU', 'Sigmoid', 'Tanh', 'None of the above', 2),
('What does CNN stand for in deep learning?', 'Computer Neural Network', 'Convolutional Neural Network', 'Complex Neural Network', 'Combined Neural Network', 2),
('Which technique is used to prevent overfitting?', 'Data augmentation', 'Dropout', 'Early stopping', 'All of the above', 4);

-- Verify
SELECT * FROM students;
SELECT * FROM questions;
