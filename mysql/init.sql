CREATE DATABASE IF NOT EXISTS devops_notes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON devops_notes.* TO 'notesuser'@'%';
FLUSH PRIVILEGES;
