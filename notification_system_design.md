# Notification System Design

A simple notification service allows users to receive, view, and manage notifications efficiently.

## API Endpoints

The service exposes a small set of endpoints:

* `GET /notifications` — Retrieve all notifications for a user.
* `POST /notifications` — Create a new notification.
* `PATCH /notifications/:id/read` — Mark a notification as read.
* `PATCH /notifications/read-all` — Mark all notifications as read.
* `DELETE /notifications/:id` — Delete a notification.

---

## Live Updates

WebSockets are used to deliver notifications in real time.

* The frontend opens a WebSocket connection when the user logs in.
* The connection remains active while the user is online.
* Whenever a new notification is created, the backend sends it immediately to the connected client.
* This removes the need for continuous polling and reduces unnecessary API requests.

---

## Database

PostgreSQL is used to store users and notifications.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

To speed up unread notification queries:

```sql
CREATE INDEX idx_user_read
ON notifications(user_id, is_read);
```

---

## Caching

Redis can be placed in front of PostgreSQL to reduce database load.

Benefits include:

* Faster response times
* Reduced database queries
* Better scalability during high traffic

Frequently accessed notification data can be stored in Redis and refreshed when changes occur.

---

## Background Processing

Some tasks should not run inside the main request cycle.

Examples:

* Sending emails
* Sending push notifications
* Processing large batches of notifications

Recommended flow:

1. Receive the notification request.
2. Save the notification in the database.
3. Add background tasks to a queue.
4. Return a success response immediately.
5. Worker processes handle emails and push notifications separately.

This keeps the API fast and responsive.

---

## Notification Priority

Notifications can be ordered based on importance:

1. Placement
2. Result
3. Event
4. Other notifications

When two notifications have the same priority, the newer notification should appear first.

---

## Performance Considerations

* Use pagination when fetching notifications.
* Add indexes only for frequently used queries.
* Cache commonly accessed data using Redis.
* Use WebSockets instead of frequent polling.
* Process expensive tasks in background workers.
* Fetch only the data required by the client.

