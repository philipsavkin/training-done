import { z } from 'zod'

export const TokenResponseSchema = z.object({
  expires_at: z.number(),
  refresh_token: z.string(),
  access_token: z.string(),
})

export type TokenData = z.infer<typeof TokenResponseSchema>

export const StravaActivitySchema = z.object({
  resource_state: z.number(),
  athlete: z.object({ id: z.number(), resource_state: z.number() }),
  name: z.string(),
  distance: z.number(),
  moving_time: z.number(),
  elapsed_time: z.number(),
  total_elevation_gain: z.number().nullish(),
  sport_type: z.string(),
  workout_type: z.number().nullable(),
  id: z.number(),
  start_date: z.string(),
  start_date_local: z.string(),
  timezone: z.string(),
  utc_offset: z.number(),
  location_city: z.string().nullable(),
  location_state: z.string().nullable(),
  location_country: z.string().nullable(),
  achievement_count: z.number(),
  kudos_count: z.number(),
  comment_count: z.number(),
  athlete_count: z.number(),
  photo_count: z.number(),
  map: z.object({
    id: z.string(),
    summary_polyline: z.string(),
    resource_state: z.number(),
  }),
  trainer: z.boolean(),
  commute: z.boolean(),
  manual: z.boolean(),
  private: z.boolean(),
  visibility: z.string(),
  flagged: z.boolean(),
  start_latlng: z.array(z.number()),
  end_latlng: z.array(z.number()),
  average_speed: z.number().nullish(),
  max_speed: z.number().nullish(),
  average_cadence: z.number().nullish(),
  has_heartrate: z.boolean(),
  average_heartrate: z.number().nullish(),
  max_heartrate: z.number().nullish(),
  heartrate_opt_out: z.boolean(),
  display_hide_heartrate_option: z.boolean(),
  elev_high: z.number().nullish(),
  elev_low: z.number().nullish(),
  gear_id: z.string().nullish(),
  upload_id: z.number(),
  upload_id_str: z.string(),
  external_id: z.string(),
  from_accepted_tag: z.boolean(),
  pr_count: z.number(),
  total_photo_count: z.number(),
  has_kudoed: z.boolean(),
})

export const StravaActivitiesSchema = z.array(StravaActivitySchema)

export type StravaActivity = z.infer<typeof StravaActivitySchema>

export const StravaWebhookDataSchema = z.object({
  aspect_type: z.union([z.literal('create'), z.literal('update'), z.literal('delete')]),
  event_time: z.number(),
  object_id: z.number(),
  object_type: z.union([z.literal('activity'), z.literal('athlete')]),
  owner_id: z.number(),
  subscription_id: z.number(),
  updates: z
    .object({
      title: z.string(),
      type: z.string(),
      private: z.union([z.string(), z.boolean()]),
      authorized: z.union([z.string(), z.boolean()]),
    })
    .partial()
    .nullish(),
})
