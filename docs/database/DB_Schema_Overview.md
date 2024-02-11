# Database Model Documentation

This document provides a detailed overview of the database model used in the AdonisJS API, including types, constraints, and descriptions for each table and column.

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
  - **Constraints**: Nullable
- **Timestamps**: Yes (created and updated)

### 2. `locations`
Stores geographical information.

- **Column**: `id`
  - **Type**: Auto-increment (primary key)
- **Column**: `continent` // Example: Africa, Europe, etc.
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `continent_code` // Example: AF, EU, etc.
  - **Type**: String (10)
  - **Constraints**: Nullable
- **Column**: `country` // Example: Cameroon, France, etc.
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `country_code` // Example: CM, FR, etc.
  - **Type**: String (10)
  - **Constraints**: Nullable
- **Column**: `region` // Example: Île-de-France, Littoral, etc.
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `region_code` // Example: IDF, LT, etc.
  - **Type**: String (10)
  - **Constraints**: Nullable
- **Column**: `city` // Example: Douala, Paris, etc.
  - **Type**: String (255)
  - **Constraints**: Not nullable
- **Column**: `latitude` // Example: 48.856614, 4.051056
  - **Type**: Decimal (10, 8)
  - **Constraints**: Not nullable
- **Column**: `longitude` // Example: 2.3522219, 9.7678687
  - **Type**: Decimal (11, 8)
  - **Constraints**: Not nullable
- **Column**: `postal` // Example: 75000, 237
  - **Type**: String (20)
  - **Constraints**: Nullable
- **Column**: `flag_img_url` // Example: https://cdn.ipwhois.io/flags/fr.svg
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `flag_emoji` // Example: U+1F1EB U+1F1F7
  - **Type**: String (50)
  - **Constraints**: Nullable
- **Unique Constraint**: [`latitude`, `longitude`]
- **Timestamps**: Yes (created and updated)



### 3. `visitor_ips`
New table for storing IP addresses and associated information.

- **Column**: `id`
  - **Type**: Integer (primary key)
- **Column**: `ip`
  - **Type**: String (45)
  - **Constraints**: Not nullable, unique
- **Column**: `location_id`
  - **Type**: Integer (index)
  - **Foreign Key**: References `locations.id`
  - **Constraints**: Nullable
- **Column**: `type` // Example: IPv4, IPv6
  - **Type**: String (10)
  - **Constraints**: Not nullable
- **Column**: `asn`  // Example: 36040, 15169, etc.
  - **Type**: Integer
  - **Constraints**: Nullable
- **Column**: `org` // Example: Orange Mobile, Google LLC, etc.
  - **Type**: String (100)
  - **Constraints**: Nullable
- **Column**: `isp` // Example: Orange S.A., Google LLC, etc.
  - **Type**: String (100)
  - **Constraints**: Nullable
- **Column**: `domain` // Example: orange.cm, google.com, etc.
  - **Type**: String (100)
  - **Constraints**: Nullable
- **Timestamps**: Yes (created and updated)

### 4. `visitors`
Stores visitor data, now linked to the `visitor_ips` table.

- **Column**: `id`
  - **Type**: Auto-increment (primary key)
- **Column**: `visitor_ip_id`
  - **Type**: Integer (index)
  - **Foreign Key**: References `visitor_ips.id`
  - **Constraints**: Nullable
- **Column**: `project_id`
  - **Type**: Integer (index)
  - **Foreign Key**: References `projects.id`
  - **Constraints**: Not nullable
- **Timestamps**: Yes (created and updated)

### 5. `pages`
Stores information about web pages.

- **Column**: `id`
  - **Type**: Integer (primary key)
- **Column**: `url`
  - **Type**: String (2048)
  - **Constraints**: Not nullable, unique
- **Column**: `endpoint`
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `project_id`
  - **Type**: Integer (index)
  - **Foreign Key**: References `projects.id`
  - **Constraints**: Not nullable
- **Timestamps**: Yes (created and updated)

### 6. `page_views`
For recording individual page views with additional details.

- **Column**: `id`
  - **Type**: Integer (primary key)
- **Column**: `visitor_id`
  - **Type**: Integer (index)
  - **Foreign Key**: References `visitors.id`
  - **Constraints**: Not nullable
- **Column**: `page_id`
  - **Type**: Integer (index)
  - **Foreign Key**: References `pages.id`
  - **Constraints**: Not nullable
- **Column**: `user_agent_id`
  - **Type**: Integer (index)
  - **Foreign Key**: References `user_agents.id`
  - **Constraints**: Nullable
- **Column**: `session_start`
  - **Type**: Timestamp
  - **Default**: Current timestamp
  - **Constraints**: Not nullable
- **Column**: `session_end`
  - **Type**: Timestamp
  - **Constraints**: Nullable
- **Column**: `duration`
  - **Type**: Integer
  - **Constraints**: Default 0 , Not nullable
  - **Description**: Time spent on the page in seconds
- **Column**: `referrer`
  - **Type**: String (2048)
  - **Constraints**: Nullable
- **Timestamps**: Yes (created and updated)

### 7. `events`
Captures specific events on pages, like button clicks, form submissions, etc.

- **Column**: `id`
  - **Type**: Integer (primary key)
- **Column**: `page_view_id`
  - **Type**: Integer (index)
  - **Foreign Key**: References `page_views.id`
  - **Constraints**: Not nullable
- **Column**: `event_type` (e.g. 'click', 'submit', etc.)
  - **Type**: String (100)
  - **Constraints**: Nullable
- **Column**: `event_data` (JSON describing the event)
  - **Type**: Text
  - **Constraints**: Nullable
- **Timestamps**: Yes (created and updated)

### 8. `user_agents`
Stores user agent (browser) details.

- **Column**: `id`
  - **Type**: Integer (primary key)
- **Column**: `user_agent`
  - **Type**: String (2048)
  - **Constraints**: Nullable
- **Column**: `browser_name`
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `browser_version`
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `browser_language`
  - **Type**: String (50)
  - **Constraints**: Nullable
- **Column**: `os_name`
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `os_version`
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Column**: `device_type`
  - **Type**: String (255)
  - **Constraints**: Nullable
- **Timestamps**: Yes (created and updated)

### 9. `real_time_page_views`
Stores real-time visitor sessions.

- **Column**: `id`
  - **Type**: Integer (primary key)
- **Column**: `page_view_id` 
  - **Type**: Integer (index)
  - **Foreign Key**: References `page_views.id`
  - **Constraints**: Not nullable
- **Column**: `active`
  - **Type**: Boolean
  - **Default**: True
  - **Constraints**: Nullable
- **Timestamps**: Yes (created and updated)
