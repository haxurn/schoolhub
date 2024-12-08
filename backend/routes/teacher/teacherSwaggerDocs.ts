/**
 * @openapi
 * components:
 *   schemas:
 *     TeacherRegistrationInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - phoneNumber
 *         - dateOfBirth
 *         - gender
 *         - bloodGroup
 *         - address
 *         - maritalStatus
 *         - qualification
 *         - dateOfJoining
 *         - workExperience
 *         - workShift
 *         - workLocation
 *         - salary
 *         - subject
 *       properties:
 *         firstName:
 *           type: string
 *           description: Teacher's first name
 *           minLength: 2
 *           maxLength: 50
 *         lastName:
 *           type: string
 *           description: Teacher's last name
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           description: Teacher's email address
 *           format: email
 *         password:
 *           type: string
 *           description: Password for the account
 *           minLength: 8
 *           pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'
 *         phoneNumber:
 *           type: string
 *           description: Teacher's phone number
 *           pattern: '^\\+?[1-9]\\d{1,14}$'
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Teacher's date of birth (must be between 21 and 65 years old)
 *         gender:
 *           type: string
 *           enum: ['Male', 'Female', 'Other']
 *           description: Teacher's gender
 *         bloodGroup:
 *           type: string
 *           enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
 *           description: Teacher's blood group
 *         address:
 *           type: string
 *           description: Teacher's address
 *           minLength: 5
 *           maxLength: 255
 *         maritalStatus:
 *           type: string
 *           enum: ['Single', 'Married', 'Divorced', 'Widowed']
 *           description: Teacher's marital status
 *         qualification:
 *           type: string
 *           description: Teacher's qualification
 *           minLength: 2
 *           maxLength: 255
 *         dateOfJoining:
 *           type: string
 *           format: date
 *           description: Date of joining (cannot be in the future)
 *         workExperience:
 *           type: integer
 *           description: Years of work experience
 *           minimum: 0
 *           maximum: 50
 *         workShift:
 *           type: string
 *           enum: ['Morning', 'Afternoon', 'Evening', 'Night']
 *           description: Teacher's work shift
 *         workLocation:
 *           type: string
 *           description: Teacher's work location
 *           minLength: 2
 *           maxLength: 255
 *         salary:
 *           type: integer
 *           description: Teacher's salary
 *           minimum: 0
 *         subject:
 *           type: string
 *           description: Teacher's subject
 *           minLength: 2
 *           maxLength: 255
 *         previousWork:
 *           type: string
 *           description: Previous work details (optional)
 *         previousWorkAddress:
 *           type: string
 *           description: Previous work address (optional)
 *         previousWorkPhoneNumber:
 *           type: string
 *           description: Previous work phone number (optional)
 *           pattern: '^\\+?[1-9]\\d{1,14}$'
 *         facebook:
 *           type: string
 *           format: url
 *           description: Facebook profile URL (optional)
 *         instagram:
 *           type: string
 *           format: url
 *           description: Instagram profile URL (optional)
 *         linkedin:
 *           type: string
 *           format: url
 *           description: LinkedIn profile URL (optional)
 *         twitterUrl:
 *           type: string
 *           format: url
 *           description: Twitter profile URL (optional)
 *         resume:
 *           type: string
 *           format: binary
 *           description: Resume file upload
 *         image:
 *           type: string
 *           format: binary
 *           description: Profile image upload
 * 
 * tags:
 *   - name: Teacher
 *     description: Operations related to teacher management
 * 
 * paths:
 *   /teacher/register:
 *     post:
 *       summary: Register a new teacher
 *       description: Create a new teacher account with comprehensive details
 *       tags:
 *         - Teacher
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               $ref: '#/components/schemas/TeacherRegistrationInput'
 *       responses:
 *         '201':
 *           description: Teacher registered successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: object
 *                     description: Created teacher user details
 *         '400':
 *           description: Invalid input or registration failed
 *         '401':
 *           description: Unauthorized access - Admin token required
 *         '403':
 *           description: Insufficient privileges - Admin role needed
 *         '409':
 *           description: Conflict - Email already exists
 *         '500':
 *           description: Server error
 * 
 *   /teacher/login:
 *     post:
 *       summary: Teacher login
 *       description: Authenticate a teacher and generate JWT token
 *       tags:
 *         - Teacher
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Teacher's email address
 *                   format: email
 *                 password:
 *                   type: string
 *                   description: Teacher's password
 *                   minLength: 8
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     description: JWT authentication token
 *         '401':
 *           description: Authentication failed
 * 
 *   /teacher/profile:
 *     get:
 *       summary: Get current teacher's profile
 *       description: Retrieve profile details of the authenticated teacher
 *       tags:
 *         - Teacher
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Successfully retrieved teacher profile
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Teacher profile retrieved successfully
 *                   data:
 *                     type: object
 *                     description: Teacher profile details
 *         401:
 *           description: Unauthorized access
 *         404:
 *           description: Teacher profile not found
 * 
 *   /teacher/profile/{teacherId}:
 *     put:
 *       summary: Update teacher profile for finance department
 *       description: >
 *         Update profile details of a specific teacher.
 *         Accessible only by finance department personnel.
 *       tags:
 *         - Teacher
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: teacherId
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/TeacherRegistrationInput'
 *       responses:
 *         200:
 *           description: Successfully retrieved teacher financial profile
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Teacher financial profile retrieved successfully
 *                   financialProfile:
 *                     type: object
 *                     properties:
 *                       salary:
 *                         type: number
 *                         description: Teacher's current salary
 *                       bankDetails:
 *                         type: object
 *                         properties:
 *                           accountNumber:
 *                             type: string
 *                             description: Masked bank account number
 *                           bankName:
 *                             type: string
 *                             description: Name of the bank
 *                       paymentHistory:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             month:
 *                               type: string
 *                               description: Month of payment
 *                             year:
 *                               type: number
 *                               description: Year of payment
 *                             amount:
 *                               type: number
 *                               description: Amount paid
 *                             status:
 *                               type: string
 *                               enum: ['Paid', 'Pending', 'Delayed']
 *                               description: Payment status
 *         401:
 *           description: Unauthorized access - Finance token required
 *         403:
 *           description: Insufficient privileges
 *         404:
 *           description: Teacher not found or financial profile unavailable
 * 
 *   /teacher:
 *     get:
 *       summary: List teachers
 *       description: Retrieve a paginated list of teachers
 *       tags:
 *         - Teacher
 *       security:
 *         - bearerAuth: []
 *           description: Page number for pagination
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             minimum: 1
 *             maximum: 100
 *             default: 10
 *           description: Number of teachers per page
 *       responses:
 *         200:
 *           description: Successfully retrieved teachers list
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Teachers retrieved successfully
 *                   data:
 *                     type: object
 *                     properties:
 *                       teachers:
 *                         type: array
 *                         description: List of teachers
 *                       pagination:
 *                         type: object
 *                         properties:
 *                           currentPage:
 *                             type: integer
 *                           pageSize:
 *                             type: integer
 *                           totalTeachers:
 *                             type: integer
 *                           totalPages:
 *                             type: integer
 *         401:
 *           description: Unauthorized access
 *         500:
 *           description: Server error retrieving teachers
 * 
 *   /teacher/password-reset-request:
 *     post:
 *       summary: Request password reset
 *       description: Initiate password reset process by sending reset link
 *       tags:
 *         - Teacher
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email address to send password reset link
 *                   example: john.smith@schoolhub.edu
 *       responses:
 *         200:
 *           description: Password reset token generated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Password reset token generated successfully
 *                   resetToken:
 *                     type: string
 *                     description: Temporary reset token (for testing)
 *         400:
 *           description: Invalid email or reset request failed
  *   /teacher/{teacherId}:
 *     delete:
 *       summary: Delete a teacher account
 *       description: |
 *         Permanently remove a teacher from the system.
 *         Requires administrative privileges.
 *       tags:
 *         - Teacher
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: teacherId
 *           required: true
 *           schema:
 *             type: number
 *             description: Unique identifier of the teacher to delete
 *       responses:
 *         200:
 *           description: Teacher account soft deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Teacher soft deleted successfully
 *         401:
 *           description: Unauthorized access - Admin token required
 *         403:
 *           description: Insufficient privileges - Admin role needed
 *         404:
 *           description: Teacher not found
 *         500:
 *           description: Server error during deletion
 * 
 *   /teacher/password-reset-confirm:
 *     post:
 *       summary: Confirm password reset
 *       description: Complete password reset process using token
 *       tags:
 *         - Teacher
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - resetToken
 *                 - newPassword
 *               properties:
 *                 resetToken:
 *                   type: string
 *                   description: Password reset token
 *                 newPassword:
 *                   type: string
 *                   format: password
 *                   description: New password for the account
 *                   minLength: 8
 *       responses:
 *         200:
 *           description: Password reset successful
 *         400:
 *           description: Invalid token or password reset failed
 */
export {};