# SchoolHub Database Tables

## Core Tables
1. **rolesTable** – Manages user roles (Admin, Teacher, Student, etc.)
2. **usersTable** – Stores user account information and role associations.
3. **studentsTable** – Stores student details.
4. **teachersTable** – Stores teacher details.
5. **classesTable** – Manages class information.
6. **sectionsTable** – Tracks class sections.
7. **subjectsTable** – Manages subjects.
8. **attendanceTable** – Tracks attendance records.
9. **registrarTable** – Stores registrar information.
10. **enrollmentsTable** – Tracks student enrollments in classes.
11. **gradesTable** – Stores student grades for various subjects.
12. **examsTable** – Manages exam details, schedules, and types.
13. **assignmentsTable** – Tracks assignments given to students.
14. **scheduleTable** – Manages the class schedules.
15. **parentContactsTable** – Stores parent or guardian details.
16. **financeTable** – Tracks financial records like school fees and salaries.
17. **holidaysTable** – Manages the school’s holiday schedule.
18. **eventsTable** – Tracks school events and announcements.
19. **notificationsTable** – Manages notifications sent to users.
20. **libraryTable** – Manages library resources and borrowing records.
21. **transportationTable** – Tracks bus routes and assignments.
22. **hostelTable** – Manages hostel accommodations for students.
23. **feedbackTable** – Stores feedback or complaints from students and parents.
24. **settingsTable** – Stores system-wide configuration settings.

---

## Chat System and Video Call Tables
25. **chatRoomsTable** – Manages chat rooms (e.g., private, group chats).
26. **chatMessagesTable** – Stores individual chat messages in rooms.
27. **chatParticipantsTable** – Tracks participants in each chat room.
28. **videoCallSessionsTable** – Stores video call session details.
29. **videoCallParticipantsTable** – Tracks participants in video call sessions.
30. **videoCallLogsTable** – Stores logs related to video call sessions.
31. **fileUploadsTable** – Tracks file uploads (e.g., documents, media) in chat rooms.

---

## Additional Notes:
- **Real-time Communication**: For **chat** and **video calls**, you might use **WebSockets**, **Socket.io**, or third-party services like **WebRTC** or **Twilio** to handle real-time messaging and video streaming.
- **Media Storage**: For file uploads, consider using cloud storage (e.g., **AWS S3** or **Google Cloud Storage**) to store media and other file types shared in chat messages or during video calls.
- **Security**: Ensure **encryption** for messages and video calls to protect sensitive data.
