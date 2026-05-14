# Security Specification for FolkTalent Connect

## Data Invariants
1. A **User** profile must exist for every authenticated user.
2. **PerformerProfiles** are only editable by the owner (uid match) or an admin.
3. **Bookings** must have a valid `performerId` and `userId`.
4. **Reviews** can only be created for completed bookings and only by the user who made the booking.
5. **Notifications** are private to the recipient (`userId`).
6. No one can change their own `role` once set (especially to 'admin').

## The "Dirty Dozen" Payloads

### P1: Identity Spoofing (User Creation)
Attacker tries to create a user profile with a different UID.
```json
{
  "uid": "attacker_uid",
  "email": "victim@example.com",
  "role": "admin"
}
```
**Expected:** DENIED (uid must match auth.uid, and role 'admin' protected).

### P2: State Shortcutting (Booking Status)
User tries to accept their own booking request.
```json
{
  "status": "accepted"
}
```
**Expected:** DENIED (only performerId owner can accept).

### P3: Resource Poisoning (Massive Description)
Attacker tries to inject 10MB of text into a performer description.
```json
{
  "description": "very long string..."
}
```
**Expected:** DENIED (size limit enforcement).

### P4: Orphaned Booking
Create a booking for a non-existent performer.
**Expected:** DENIED (exists check).

### P5: Review Hijacking
User A tries to write a review for User B's booking.
**Expected:** DENIED (userId in Review must match auth.uid and correspond to Booking).

### P6: Role Escalation
User tries to update their role to 'admin'.
**Expected:** DENIED (role is immutable or protected).

### P7: Unverified Email Write
User with unverified email tries to book.
**Expected:** DENIED (email_verified check).

### P8: PII Leak (Users)
Unauthorized user tries to list all user emails.
**Expected:** DENIED (blanket reads blocked).

### P9: Metadata Tampering
User tries to set a future `createdAt` timestamp.
**Expected:** DENIED (server timestamp enforcement).

### P10: Deleting Other's Profile
Performer A tries to delete Performer B's profile.
**Expected:** DENIED (uid check).

### P11: Double Review
User tries to review the same booking twice.
**Expected:** DENIED (exists check or logic gap).

### P12: Notification Snooping
User tries to read another user's notifications.
**Expected:** DENIED (userId match).

## Test Runner (Placeholder)
`firestore.rules.test.ts` will be generated to verify these.
