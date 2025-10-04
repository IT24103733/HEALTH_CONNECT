> Introduction
In today’s fast paced and digitally connected world Health and Nutrition wellbeing has become a major concern among society. By now, a considerable proportion of people face many difficulties in consistently tracking their dietary habits, physical activity, and overall health progress. Furthermore, healthcare providers also face difficulties in monitoring patients’ health, planning care/treatment plans and in maintaining coordination across clinical and administrative groups. As a fitting solution, this project proposal report proposes a Web-Based Diet Planning and Health Check-up System.

This system is designed as a role-based platform to facilitate better personalized and a coordinated platform especially for both patients and health providers. Through combining with modern technology, it is expected to create a secure, centralized, effective environment.

The primary objective of this project is to develop a secure, scalable, and user-friendly web-based application tailored for health management. The system aims to support the creation of personalized care plans collaboratively designed by doctors and dietitians, while enabling patients to track their nutrition, workouts, and symptoms through intuitive logging features. It facilitates real-time monitoring to keep remote patients engaged and informed, ensures efficient scheduling and coordination across departments, and emphasizes strong data security and communication safeguards. Additionally, the system incorporates administrative tools for effective auditing, reporting, and governance.

                            The key stakeholders of the system include various user roles. Patients are the end-users who log health metrics, follow care plans, and interact with healthcare providers. Dietitians manage and update individualized meal plans while monitoring adherence. Doctors oversee diagnosis, treatment progress, and health record updates. Support staff handle scheduling, reminders, and logistical workflows. Administrative managers ensure system compliance, generate reports, and monitor operational performance. Finally, system administrators are responsible for managing user roles, configuring security protocols, and maintaining the technical infrastructure of the platform. 

* Project Scope
  Core functionalities of the system:
  • Role-Based Access Control: Ensures secure access and data protection based on user roles.
  • Health Metrics Logging & Visualization: Allows patients and doctors to input and view health data using charts and dashboards.
  • Dynamic Care Plan Management: Supports real-time updates and collaboration on treatment plans.
  • Integrated Scheduling System: Enables centralized booking with conflict detection and reminders.
  • Medical Records & Compliance Reporting: Stores electronic health records and generates reports while maintaining data privacy.
  • Communication Hub: Facilitates secure, internal messaging between users.

The solution is expected to be deployed as a responsive web application, accessible from modern browsers, and developed using current web development frameworks and secure authentication protocols.

* Limitations
  In spite of the broad range of features, it is subject to the following limitations:
  • Scope of AI or automation - limited to rule-based logic (e.g., adherence indicators), not predictive analytics or diagnostics.
  • No offline functionality- will be available; an active internet connection is required to access the platform.
  • Initial implementation- will support English only; multilingual support may be considered in future iterations.
  • Integration with external systems such as wearable devices or third-party EHR platforms will not be included in the initial release

> System Overview Diagram











> Functional Requirements

1. User Access Control
   o Allow users to create accounts and log in with username/password
   o Automatically log out inactive users after 30 minutes
   o Provide different access levels:
* Patients see only their own data
* Doctors/dietitians see their patients' information
* Admins manage user accounts
2. Health Tracking
   o Enable patients to log daily:
* Meals and water intake
* Exercise activities
* Symptoms and energy levels
  o Allow doctors to add medical notes
  o Show progress using simple charts
3. Care Plan Management
   o Let dietitians create food plans
   o Allow doctors to make treatment plans
   o Display whether patients are following plans
4. Appointment Booking
   o Provide online calendar for scheduling
   o Warn about double-booked time slots
   o Show reminders in the web application
5. Reporting Tools
   o Generate usage statistics
   o Export anonymous data (CSV files)
6. Messaging System
   o Allow private messages between patients and doctors
   o Enable staff group chats
   o Send appointment reminders




> Non-Functional Requirements

1. Security
   o Store passwords securely
   o Protect data during transmission
   o Lock accounts after 3 failed login attempts
2. Ease of Use
   o Complete common tasks in 3 clicks or less
   o Ensure readable text and good colour contrast
   o Maintain consistent navigation
3. Performance
   o Load pages quickly
   o Support 30+ simultaneous users
   o Deliver reminders promptly
4. Reliability
   o Remain available during clinic hours
   o Prevent data loss during errors
5. Maintainability
   o Keep code organized and documented
   o Use clear database structure
   o Provide helpful error messages
6. Data Quality
   o Check for invalid entries
   o Ensure correct data formats
   o Keep related information connected








> Major Stakeholders

The Health connect platform serves seven distinct user groups, each with specialized responsibilities and access requirements.

* Patients/End-Users
  Individuals managing personal health through the platform. Responsibilities include daily logging of nutrition intake, exercise activities, and symptoms. Patients access prescribed care plans, monitor progress through visual charts, and communicate with their care team via secure messaging. Access is restricted to personal health records only.
* Dietitians
  Nutrition specialists who develop and modify personalized meal plans based on patient health profiles. They monitor adherence through logged data, adjust recommendations, and collaborate with physicians. Access includes nutritional data of assigned patients.
* Physicians
  Healthcare providers responsible for medical oversight. Key functions include documenting clinical observations, developing treatment protocols, tracking rehabilitation progress, and updating health records. Access extends to medical histories of assigned patients.
* Support Staff
  Operational personnel managing appointment scheduling and coordination. Duties include resolving booking conflicts, triggering reminders, and facilitating communication between patients and clinical teams. Access excludes medical content.
* System Administrators
  Technical maintainers handling user provisioning, role permissions, and security configuration. Privileges include full system access except sensitive medical content.
* Super Administrators
  Highest-tier roles managing core system configuration, database operations, and emergency protocols.



> Major Functions

Function 1: Role-Based Access Governance (Assigned – Somawansa)
Who will use it: Patients, Clinicians, Administrators
What it does: Authenticates user identities and enforces tiered access permissions across the system.
Expected outcome: Secure system access, prevention of unauthorized actions, and auditable user sessions.
Key features include:
* User registration and login via username/password credentials
* Tiered permissions (patient, clinician, administrator)
* Session management with 30-minute inactivity timeouts
* Administrative interfaces for user/role management

Function 2: Health Metrics Dashboard (Assigned – Perera)
Who will use it: Patients, Clinicians
What it does: Aggregates health metrics and visualizes trends for monitoring.
Expected outcome: Enhanced visibility into patient health progression and data-driven clinical decisions.
Key features include:
* Patient-facing forms for daily nutrition/workout/symptom logging
* Physician interfaces for clinical observations and diagnoses
* Automated progress trend visualization (line/bar charts)

Function 3: Care Plan Coordination (Assigned – Weerasinghe)
Who will use it: Dietitians, Physicians
What it does: Facilitates collaborative design and tracking of personalized treatment protocols.
Expected outcome: Standardized care delivery and quantifiable patient adherence metrics.
Key features include:
* Dietitian tools for creating/modifying meal plans
* Physician interfaces for rehabilitation protocols
* Adherence indicators showing compliance percentages

Function 4: Appointment Management(Assigned – Minduli)
Who will use it: Patients, Clinicians, Administrators
What it does: Coordinates scheduling activities with automated conflict resolution.
Expected outcome: Optimized resource allocation and reduced appointment no-shows.
Key features include:
* Calendar-based booking interface
* Real-time conflict detection for time slots
* In-app notification reminders

Function 5: Compliance Documentation(Assigned – Farhat)
Who will use it: Administrators, Compliance Officers
What it does: Generates audit-ready reports and maintains access records for regulatory oversight.
Expected outcome: Demonstrable adherence to healthcare regulations and secure data governance.
Key features include:
* Customizable report builder for managers
* Access log repository for security oversight
* Anonymized data export (CSV format)

Function 6: Communication Hub(Assigned – Jayakodi)
Who will use it: Patients, Clinicians, Administrators
What it does: Enables encrypted communication channels for coordinated stakeholder engagement.
Expected outcome: Streamlined care coordination and reduced communication delays.
Key features include:
* Secure patient-clinician messaging channels
* Staff-exclusive group discussions
* Appointment-linked reminders




> Minor Functions

Data Validation
* Input sanitization for health metrics
* Range constraints for clinical values
* Format consistency enforcement

Notification System
* Appointment reminders
* Message read/unread indicators
* Priority tagging for urgent communications

Basic Reporting Tools
* Text-based usage summaries
* Simplified data export (.TXT format)
* Role-specific report visibility

Accessibility Features
* Adjustable font size controls
* High-contrast display mode
* Keyboard navigation support

Session Management
* Automatic logout after inactivity
* Single-session enforcement
* Browser session recovery

User Assistance
* Contextual help tooltips
* FAQ repository
* Workflow-specific guidance




> System Constraints

1. No Real-Time Medical Support
* Provides automated diet/health guidance only
* Cannot replace emergency services or live clinician consultations
2. No Wearable Device Integration
* Manual data entry required for all health metrics
* Cannot sync with fitness trackers/smartwatches
3. Internet Dependency
* Requires continuous online connection
* No offline access to plans/records
4. Limited Health Database
* Basic food/exercise repository only
* Excludes regional specialties and brand products
5. Rule-Based Automation Only
* Adherence indicators use simple if/then logic
* No predictive analytics or AI diagnostics
6. English-Only Interface
* No multilingual support in initial release
7. No Emergency Features
* Absence of crisis alerts or urgent care pathways














> Simple Timeline

Week 3 – 4: Planning and setting up
Finalizing technical requirements and setting up the development environment

Week 5- 6: Frontend
Building core UI components and implementing role specific dashboards

Week 7-8 : Database and initial backend coding sessions
Designing the database schema, Setting up authentication and basic API development

Week 9-10: Core backend development
Logic for health checking system and appointment scheduling

Week 11 – Advanced backend development
Logic for care plan management and reporting module

Week 12: Integration and messaging
Connecting the front end with the back end while building a messaging system

Week 13: Testing and security
Functionality testing, Security audits and optimizing overall performance of the web app

Week 14: Preparing to deploy
Fixing bugs , finalizing user documents and setting up the production environment.










> Conclusion

The Web-based Diet Planning and Health Checkup System represents a strategic solution to modern healthcare coordination challenges. By centralizing health tracking, care plan management, appointment scheduling, and secure communication into a single role-based platform, this system empowers patients to actively participate in their wellness journey while enabling healthcare providers to deliver timely, personalized care.

Key strengths of the proposed solution include its emphasis on security (through robust access controls and data protection), efficiency (via automated scheduling and compliance reporting), and user-centric design (with intuitive dashboards and task-driven workflows). The platform addresses critical needs across stakeholder groups—from patients logging daily nutrition to administrators generating operational reports—while maintaining strict data segregation aligned with user roles.

Acknowledging the defined constraints—such as reliance on internet connectivity,
rule-based (non-AI) automation, and an English-only interface—the system lays a scalable foundation. Future iterations could explore integrations with wearable devices, multilingual support, or predictive analytics once core functionality is established.

This project aligns with contemporary demands for digital health management, offering a structured pathway to improve patient engagement, clinical coordination, and administrative oversight. Pending development and testing, the system is positioned to enhance health outcomes through streamlined, data-informed collaboration.

