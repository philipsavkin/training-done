create table
  StravaTokens (
    `athlete_id` bigint not null primary key,
    `access_token` varchar(100) not null,
    `expires_at` int not null,
    `refresh_token` varchar(100) not null,
    `created_at` timestamp not null default now ()
  );

create table
  Athlete (
    `athlete_id` bigint not null primary key,
    `username` varchar(100),
    `resource_state` tinyint,
    `firstname` varchar(100),
    `lastname` varchar(100),
    `premium` boolean,
    `profile_medium` varchar(300),
    `profile` varchar(300)
  );

create table
  Activities (
    `id` bigint not null primary key,
    `external_id` varchar(200),
    `resource_state` tinyint,
    `athlete_id` bigint,
    `name` varchar(200),
    `distance` float,
    `moving_time` int,
    `elapsed_time` int,
    `total_elevation_gain` float,
    `sport_type` varchar(100),
    `workout_type` int,
    `start_lat` float,
    `start_lng` float,
    `end_lat` float,
    `end_lng` float,
    `start_date` timestamp,
    `start_date_local` timestamp,
    `timezone` varchar(100),
    `utc_offset` int,
    `achievement_count` int,
    `kudos_count` int,
    `comment_count` int,
    `athlete_count` int,
    `photo_count` int,
    `trainer` boolean,
    `commute` boolean,
    `manual` boolean,
    `private` boolean,
    `visibility` varchar(100),
    `flagged` boolean,
    `gear_id` varchar(100),
    `average_speed` float,
    `max_speed` float,
    `average_cadence` float,
    `has_heartrate` boolean,
    `average_heartrate` float,
    `max_heartrate` float,
    `heartrate_opt_out` boolean,
    `elev_high` float,
    `elev_low` float,
    `upload_id` bigint,
    `upload_id_str` varchar(100),
    `from_accepted_tag` boolean,
    `pr_count` int,
    `total_photo_count` int,
    `has_kudoed` boolean,
    index (`athlete_id`),
  );

create table
  ActivityStats (
    `athlete_id` bigint not null,
    -- period: recent, ytd, all
    `period` varchar(10) not null,
    -- activity_type: run, ride, swim
    `activity_type` varchar(10) not null,
    `count` int,
    `distance` float,
    `moving_time` int,
    `elapsed_time` int,
    `elevation_gain` float,
    index (`athlete_id`),
    unique key (`athlete_id`, `period`, `activity_type`)
  );