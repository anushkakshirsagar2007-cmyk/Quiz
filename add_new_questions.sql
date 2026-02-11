-- Add new questions to the database
-- Replace with your desired questions

INSERT INTO questions (question_text, option1, option2, option3, option4, correct_answer) VALUES
('Which Indian mission used AI for Earth Observation and Disaster Management?','Gaganyan','RISAT/EOS series','Mangalyan','NavIC', 2),
('Which is the BEST solution to reduce E-Waste?', 'Faster Disposal','Burning Waste','Circular Economy','Export Waste', 3),
('Which environmental issue is MOST directly linked to AI?', 'Soil Erosion','Water Scarcity','Ozone Depletion','Noise Pollution', 1),
('If DATA = 26 and AI = 09 then MODEL = ?', '10', '39', '45', '82', 2),
('Assertion (A): AI used in medical Imaging to detect tumors.
Reason (R): AI model can analyze patterns.','Both A and R are TRUE and R explains A.','Both A and R are TRUE but R does not explains A.','A Is TRUE, R is FALSE','A is FALSE, R is TRUE', 1),
('Virtual Assistants like ALEXA or SIRI mainly use:', 'Computer Vision','NLP','Robotics','Recommender System', 2),
('Which AI technique is primarily used in Self-Driving Cars to detect lanes and pedestrians?', 'NLP', 'Computer Vision', 'Expert System', 'Genetic Algorithm', 2),
('Which Algorithm Google Maps used to find shortest path?','Euclidian Distance / Manhattan Distance','A* Algorithm / Dijkstra’s Algorithm','Bellman Ford Algorithm / Kruskal’s Algorithm','BFS / DFS', 3),
('Who wrote “Discovery of India”?','Rabindranath Tagore','Jawaharlal Nehru','Dr. A. P. J. Abdul Kalam','Dr. B. R. Ambedkar', 2),
('India’s First Artificial Satellite was:', 'Aryabhata', 'PSLV', 'Chandrayan-II', 'INSAT', 1),
('What is E-Waste?','Waste generated from Agricultural practices','Waste generated from Domestic practices','Waste generated from Discarded appliances','Waste generated from used data', 3),
('“All robots are machine.”
“Some machines are autonomous.”
Then which is VALID?','All robots are autonomous','Some robots may be autonomous','No robot is autonomous','Robots are not machines', 2),
('Which AI technique is inspired by the human brain?','Genetic Algorithm','Neural Networks','Fuzzy Logic','Decision Tree', 2),
('In Reinforcement Learning, system learns using:','Predefined Knowledge','Labels','Reward and Penalties','Random Guessing', 3),
('GPT stands for:','General Pre-Trained Model','Generative Pre-Transformed Model','General  Pre-Transformed Model','Generative Pre- Trained Model', 4),
('A man walks 6 km in North, then 8 km in East. How far is he from starting point?','6  km','8 km','10 km','14 km', 3),
('AI that can perform only one specific task is called.', 'General AI', 'Super AI', 'Narrow AI', 'Strong AI', 3),
('Which language is commonly used in AI programming','HTML','Python','SQL','JAVA', 2),
('Face Unlock in Smartphones uses:','NLP','Speech Recognition','Computer Vision','Cryptography', 3),
('Introducing a man, Asha said: “He is the son of the woman who is the mother of the husband of my mother.” How is the man related to Asha?','Father','Brother','Uncle','Son', 3),
('Carbon Footprint of AI increases mainly due to :','Screen Brightness','Internet','Training large Models','Different AI applications', 3),
('A is taller than B.
B is shorter than C.
C is taller than A.
Who is tallest?','A','B','C','Cannot be determined', 3),
('Solar panels work on principle of:', 'Thermionic Emission', 'Photoelectronic Effect', 'Electromagnetic Induction', 'Nuclear Fusion', 2),
('Which energy conversion in a hydroelectric plant?','Electrical to Mechanical','Chemical to Electrical','Thermal to Mechanical','Kinetic to Electrical', 4),
('Which source of energy causes least pollution?','Coal','Diesel','Solar','Hydrogen', 3);

-- Verification
SELECT 'New questions added' AS status;
SELECT COUNT(*) AS total_questions FROM questions;
