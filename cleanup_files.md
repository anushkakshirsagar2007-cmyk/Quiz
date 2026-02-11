# Delete Non-Essential Files Script

## Files to DELETE (Non-essential):
- admin.html (old admin panel)
- admin-access.html (duplicate)
- add_new_questions_final.sql (duplicate)
- add_new_questions_fixed.sql (duplicate)
- complete_review.sql (review script)
- delete_all.sql (one-time script)
- fix_tracking_error.md (temporary fix)
- insert_students.sql (one-time script)
- minimal_schema.sql (old schema)
- recreate_questions_table.sql (one-time script)
- remove_duplicates.sql (one-time script)
- review_answers.sql (review script)
- sample_students.csv (sample file)

## Files to KEEP (Essential):
- admin-simple.html (main admin panel)
- admin.js (admin functionality)
- config.js (configuration)
- index.html (homepage)
- login.html (login page)
- login.js (login functionality)
- quiz.html (quiz page)
- quiz.js (quiz logic)
- styles.css (styling)
- thank-you.html (thank you page)
- upload-csv.html (CSV upload)
- add_new_questions.sql (questions data)
- add_new_users.sql (users data)
- simple_schema.sql (database schema)
- package.json (dependencies)
- package-lock.json (dependency lock)
- README.md (documentation)

## Delete Commands (run in terminal):

# Windows Command Prompt:
del admin.html admin-access.html add_new_questions_final.sql add_new_questions_fixed.sql complete_review.sql delete_all.sql fix_tracking_error.md insert_students.sql minimal_schema.sql recreate_questions_table.sql remove_duplicates.sql review_answers.sql sample_students.csv

# Or PowerShell:
Remove-Item admin.html, admin-access.html, add_new_questions_final.sql, add_new_questions_fixed.sql, complete_review.sql, delete_all.sql, fix_tracking_error.md, insert_students.sql, minimal_schema.sql, recreate_questions_table.sql, remove_duplicates.sql, review_answers.sql, sample_students.csv
