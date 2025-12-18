# Project Roadmap — PineRiders League Management App

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
Deliver the core functionality required to support real teams, players, and leagues.

### Scope

**Chat functionality across all types of chats**
- Group Chats
- Direct Messages (1:1)
- Threaded “Topics” (topic-based conversations within a league or team chat)
- Threaded comments (replies to specific comments that can be toggled to see the conversation)
- Message Editing (within a limited time window)
- Message Deletion
- @Mentions (notify specific users, admins, or directors)
- Read Receipts (limited / implicit)
- Message Reactions (likes, hearts, emojis)
- Photo Sharing, Video Sharing, Sharing GIFs, Common File Attachment types
- Camera Access (take photo/video directly)
- Image Preview & Fullscreen View
- Save Images to Device
- Link Previews
- Pinned Messages
- Pinned Topics
- Search Within Chat
- Jump to Latest / Jump to First Message
- Create Group chats and Send DMs
- Join via Invite Link
- QR Code Invites
- Admin Controls
- Admin/Coach/Director can Add / Remove players
- Rename Chat
- Change Chat avatar
- Assign Multiple Admins
- Group Description / Bio
- Group Settings (open vs closed)
- Polls
-   Multiple choice
-   Live vote counts
- Calendar Events
-   Create events
-   RSVP tracking

**Notifications**
- Push Notifications
- Mute Group
- Mute Individual Chats
- Mute Individual Users
- Notification Overrides per Chat like @Mention Alerts
- Topic-Specific Notifications

**Tasks across all dashboards**
- 

**Player Dashboard**
- Team & Player communication (player to player direct messaging, league specific chat rooms, team specific chat rooms)
- Team creation and management (coach/admin)
- Player invitation to teams and team chats and acceptance flow
- Team Manager invite review (Accept/Decline Invites) 
- Roster visibility
- Payment collection and payment status tracking for team managers and their players (venmo, zelle, CC/DC, paypal, apple pay, google pay) 
- Game event creation and player RSVP tracking
- Limited league director functionality (league creation, team invitations, payment collection)

**Coach Dashboard**
- Team Chat specifically for the players on the team (Comments, threads, images and attachments, 

**Director Dashboard**
- League specific chat rooms that are created and published by league directors

### Review Gate (Acceptance Criteria)
- A coach can create and manage a team end-to-end
- Players can join teams they are invited to, join league chats, chat directly with other players, RSVP to events, and submit payments
- Payment status is visible to coaches only, players just see how many players have paid so far
- No blocking bugs preventing real usage
- All issues assigned to this milestone are closed

Milestone 2 must be reviewed and approved before payment is released.

---








