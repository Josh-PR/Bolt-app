# Project Roadmap — PineRiders PROChat App

## Overview
This document outlines the agreed-upon milestones for completing and publishing the PineRiders League Management App.  
Each milestone has a defined scope and a review gate that must be met before moving forward.

The goal is to move from the current partially built application to a stable, published app available via the Apple and Google App Stores.

---

## Milestone 1 — Core Stability

### Objective
Stabilize the foundational systems of the app so that user data, authentication, and core flows are reliable and safe to build on.

### Scope
- Role-based users (player, coach, director)
- Authentication and login flow stability for all 3 user roles
- User creation and onboarding flow with custom data being added to the database
- User selects the sport they are joining (Softball or Bowling) Fields are conditional based on selection
- Set location for leagues within certain proximity
- Users are able to update their data (Profile, email, password, etc.) from within the app
- Configure confirmation emails, Password reset emails, and incomplete profile emails
- Supabase schema integrity and relationships
- Data validation and error handling
- Handle incomplete profiles accordingly
- Removal of test or hard-coded data
- Backup of all user data that can be pulled from in case of data loss

### Review Gate (Acceptance Criteria)
- Users can sign up, log in, log out, reset password, and return without errors
- Walkthrough of security and data protection for users
- User data persists correctly after app restarts or updates
- Roles are enforced correctly
- No critical crashes during normal use
- All related GitHub issues are closed

Milestone 1 must be reviewed and approved before payment is released.
Goal:

---

## Milestone 2 — Core Functional MVP

### Objective
Deliver the minimum viable functionality required to support sports teams, players, and league directors.

This milestone focuses on **MVP-level implementations** of core features.  
Advanced or extended functionality may be deferred unless explicitly agreed upon.

---

### 2.1 Must-Haves (Required for MVP)

These features are required for the app to function in real-world use.

#### Core Chat (MVP)
- Group chats (team-level, league-level, more than 2 users)
- Direct Messages (1:1)
- Photo sharing
- Basic file attachments
- Message timestamps
- Join chats via invite link
- Admin controls: (Team-level & League-level)
  - Add or remove members
  - Assign additional admins

#### Core Notifications
- In-app notifications for:
  - Messages
  - Invites
  - Task-related actions
- Ability to mute team chats, league chats, or individual players

#### Core Tasks Module
- Task types:
  - RSVP to event or game
  - Player fee payment
  - Team fee payment
- Task completion tracking
- Tasks connected to in-app notifications

#### Dashboards (MVP)
All dashboards include:
- Header (role, sport, user name, notifications, profile access)
- Quick Actions bar
- Task module list and important dates
- Footer navigation (role-specific)

#### Player Dashboard (MVP)
- Access team and league chats
- Submit payments
- View payment progress (without individual payer details)

#### Coach Dashboard (MVP)
- Create and manage teams
- Manage team-related tasks

#### Director Dashboard (MVP)
- Create leagues
- Create league chat room
- Invite teams
- View team payment status

**Team Page**
- Resource links (Next Event RSVP totals, Season Schedule, Season Standings) 
- Invite players via invite link
- View roster
- Team Chat
- View player payment statuses
- View team roster & positions
- RSVP to games/events

**Play Page**
- Register as Free Agent
- Search and filter leagues (Skill Level, Divisions, and League Status)
- League "Cards" that show
-   Location - Link to open in maps
-   Season Name & Duration
-   Team Fee
-   Number of Teams

#### Payments (MVP)
- League directors can configure:
  - Team fees
  - Ball fees
  - Additional fees
- Coaches submit teams and select roster size
- Total fees calculated automatically
- Players pay individual portions
- Basic payment status tracking

#### UI Enhancements
- Image carousel for announcements or marketing
- Quick action bar on dashboards

---

### 2.2 Nice-to-Haves (Lower Complexity Enhancements)

These features improve usability but are not required for core operation.

#### Chat Enhancements
- Message reactions (likes, hearts, emojis)
- Image preview and fullscreen view
- Save images to device
- Link previews
- Pinned messages
- Search within chat
- Rename chats
- Change chat avatar
- Group description or bio

#### Notification Enhancements
- Star or follow chats and users
- Notification overrides for @mentions

#### Events and Engagement
- Calendar event creation
- RSVP tracking enhancements
- Polls (simple multiple choice with live vote counts)

#### UI Enhancements
- Display stat icons

---

### 2.3 Advanced / High-Complexity Features

These features are complex and may be implemented partially or deferred.

#### Advanced Chat
- Threaded topics within chats
- Threaded replies to messages
- Read receipts (implicit or limited)
- Message editing (time-limited)
- Message deletion
- Jump to first or latest message
- GIF sharing
- Video sharing
- QR code invites

#### Advanced Notifications
- Topic-specific notifications
- Mute individual users
- Notification rules per chat

#### Advanced Payments
- Support for multiple payment providers:
  - Venmo
  - Zelle
  - Apple Pay
  - Google Pay
  - Credit or debit cards
- Automatic fee rebalancing when players join or leave teams

#### Advanced Team and League Features
- Recruitment module
- Lineup and position setting (Softball)
- Multi-admin role permissions
- Advanced reporting

---

### Review Gate (Acceptance Criteria)
- A coach can create and manage a team end-to-end
- Players can join teams, chat, RSVP to events, and submit payments
- League directors can create leagues and manage team participation
- No blocking bugs preventing real usage
- All issues assigned to this milestone are closed

Milestone 2 must be reviewed and approved before payment is released.


---

## Milestone 3 — Refinement & Deployment Readiness

### Objective
Prepare the app for public release and App Store submission.

### Scope
- UX polish and edge case handling
- Performance and stability improvements
- App Store configuration and assets
- Production environment setup
- TestFlight build and testing
- Privacy policy and compliance requirements
- App Store submission support

### Review Gate (Acceptance Criteria)
- App installs and runs via TestFlight
- No known critical or high-severity bugs
- Production backend is live and stable
- App Store submission is completed or approved
- All issues assigned to this milestone are closed

Final approval is required before final payment.

---

## Notes
This roadmap may evolve slightly as development progresses, but milestone objectives and review gates must be agreed upon before changes are made.
