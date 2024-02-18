# Database Model

This document describes the database model used in the AdonisJS API. It includes details about each table, column, data type, and the relationships between tables.

## Tables

### 1. `projects`
This table contains information about projects.

- **Column**: `id`
  - **Type**: Auto-increment (primary key)
- **Column**: `domain`
  - **Type**: String
  - **Constraints**: Not nullable, unique
- **Column**: `favicon`
  - **Type**: String
  - **Constraints**: Nullable
- **Column**: `active`
  - **Type**: Boolean
  - **Default**: False
- **Timestamps**: Yes (created and updated)

### 2. `daily_salts`
Stores daily salt data.

- **Column**: `id`
  - **Type**: Auto-increment (primary key)
- **Column**: `salt`
  - **Type**: String (128 characters)
  - **Constraints**: Not nullable
- **Timestamps**: Yes (created and updated)

### 3. `locations`
Contains geographical information.

- **Column**: `id`
  - **Type**: Auto-increment (primary key)
- **Column**: `country`
  - **Type**: String
  - **Constraints**: Not nullable
- **Column**: `region`
  - **Type**: String
  - **Constraints**: Not nullable
- **Column**: `city`
  - **Type**: String
  - **Constraints**: Not nullable
- **Column**: `alpha_3`
  - **Type**: String
  - **Constraints**: Nullable
- **Unique Constraint**: `country`, `region`, `city`
- **Timestamps**: Yes (created and updated)

### 4. `visitors`
Stores visitor data.

- **Column**: `id`
  - **Type**: Auto-increment (primary key)
- **Column**: `visitor_id`
  - **Type**: String
  - **Constraints**: Not nullable, unique
- **Column**: `project_id`
  - **Type**: Integer (foreign key referencing `projects.id`)
  - **On Delete**: CASCADE
- **Column**: `location_id`
  - **Type**: Integer (foreign key referencing `locations.id`)
  - **On Delete**: CASCADE
- **Timestamps**: Yes (created and updated)

### 5. `visitor_events`
Records visitor events.

- **Column**: `id`
  - **Type**: Auto-increment (primary key)
- **Column**: `visitor_id`
  - **Type**: Integer (foreign key referencing `visitors.id`)
- **Column**: `browser`
  - **Type**: String
  - **Constraints**: Nullable
- **Column**: `os`
  - **Type**: String
  - **Constraints**: Nullable
- **Column**: `url`
  - **Type**: String
  - **Constraints**: Nullable
- **Column**: `device_type`
  - **Type**: String
  - **Constraints**: Nullable
- **Column**: `referrer`
  - **Type**: String
  - **Constraints**: Nullable
- **Timestamps**: Yes (created and updated)

### 6. `sessions`
Stores visitor sessions.

- **Column**: `id`
  - **Type**: Auto-increment (primary key)
- **Column**: `visitor_id`
  - **Type**: Integer (foreign key referencing `visitors.id`)
  - **On Delete**: CASCADE
- **Column**: `active`
  - **Type**: Boolean
  - **Default**: True
- **Column**: `session_start`
  - **Type**: Timestamp
- **Column**: `session_end`
  - **Type**: Timestamp
  - **Constraints**: Nullable
- **Column**: `visit_duration`
  - **Type**: Integer
  - **Constraints**: Nullable
- **Timestamps**: Yes (created and updated)
