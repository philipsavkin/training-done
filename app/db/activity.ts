import config from '../mysql'
import { connect } from '@planetscale/database'
import { Activity } from '../strava-schema'

export async function findAll(): Promise<Activity[]> {
  const conn = connect(config)
  const results = await conn.execute('select * from Activities')
  return results.rows.map((row) => row as Activity)
}

export async function create(activity: Activity) {
  const recordObj = {
    ...activity,
    athlete_id: activity.athlete.id,
    start_lat: activity.start_latlng[0],
    start_lng: activity.start_latlng[1],
    end_lat: activity.end_latlng[0],
    end_lng: activity.end_latlng[1],
    start_date: activity.start_date.replace('T', ' ').replace('Z', ''),
    start_date_local: activity.start_date_local.replace('T', ' ').replace('Z', ''),

    total_elevation_gain: activity.total_elevation_gain || null,
    average_speed: activity.average_speed || null,
    max_speed: activity.max_speed || null,
    average_cadence: activity.average_cadence || null,
    average_heartrate: activity.average_heartrate || null,
    max_heartrate: activity.max_heartrate || null,
    elev_high: activity.elev_high || null,
    elev_low: activity.elev_low || null,
    gear_id: activity.gear_id || null,
  }

  const insertSql =
    'insert into Activities( \
    `id`, \
    `external_id` , \
    `resource_state`, \
    `athlete_id`, \
    `name`, \
    `distance`, \
    `moving_time`, \
    `elapsed_time`, \
    `total_elevation_gain`, \
    `sport_type`, \
    `workout_type`, \
    `start_lat`, \
    `start_lng`, \
    `end_lat`, \
    `end_lng`, \
    `start_date`, \
    `start_date_local`, \
    `timezone`, \
    `utc_offset`, \
    `location_city`, \
    `location_state`, \
    `location_country`, \
    `achievement_count`, \
    `kudos_count`, \
    `comment_count`, \
    `athlete_count`, \
    `photo_count`, \
    `trainer`, \
    `commute`, \
    `manual`, \
    `private`, \
    `visibility`, \
    `flagged`, \
    `gear_id`, \
    `average_speed`, \
    `max_speed`, \
    `average_cadence`, \
    `has_heartrate`, \
    `average_heartrate`, \
    `max_heartrate`, \
    `heartrate_opt_out`, \
    `elev_high`, \
    `elev_low`, \
    `upload_id`, \
    `upload_id_str`, \
    `from_accepted_tag`, \
    `pr_count`, \
    `total_photo_count`, \
    `has_kudoed`) \
    values ( \
    :id, \
    :external_id , \
    :resource_state, \
    :athlete_id, \
    :name, \
    :distance, \
    :moving_time, \
    :elapsed_time, \
    :total_elevation_gain, \
    :sport_type, \
    :workout_type, \
    :start_lat, \
    :start_lng, \
    :end_lat, \
    :end_lng, \
    :start_date, \
    :start_date_local, \
    :timezone, \
    :utc_offset, \
    :location_city, \
    :location_state, \
    :location_country, \
    :achievement_count, \
    :kudos_count, \
    :comment_count, \
    :athlete_count, \
    :photo_count, \
    :trainer, \
    :commute, \
    :manual, \
    :private, \
    :visibility, \
    :flagged, \
    :gear_id, \
    :average_speed, \
    :max_speed, \
    :average_cadence, \
    :has_heartrate, \
    :average_heartrate, \
    :max_heartrate, \
    :heartrate_opt_out, \
    :elev_high, \
    :elev_low, \
    :upload_id, \
    :upload_id_str, \
    :from_accepted_tag, \
    :pr_count, \
    :total_photo_count, \
    :has_kudoed)'

  const conn = connect(config)
  await conn.execute(insertSql, recordObj)
}