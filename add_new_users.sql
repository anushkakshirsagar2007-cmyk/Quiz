-- Add new users to the database
-- Replace with your desired users

INSERT INTO students (full_name, password, has_attempted, quiz_score, quiz_completed_at, time_taken, correct_answers) VALUES
('Alice Johnson', 'alice123', false, null, null, null, null),
('Bob Smith', 'bob456', false, null, null, null, null),
('Charlie Wilson', 'charlie789', false, null, null, null, null),
('Diana Prince', 'diana2024', false, null, null, null, null),
('Ethan Hunt', 'ethan567', false, null, null, null, null);

-- Verification
SELECT 'New users added' AS status;
SELECT * FROM students;
