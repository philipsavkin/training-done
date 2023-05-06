import config from './mysql'
import { connect } from '@planetscale/database'
import { Settings } from '@/lib/types'

export async function createOrUpdate(settings: Settings) {
  const insertSql =
    'replace into Settings ( \
    `athlete_id`, \
    `slug`, \
    `share`) \
    values ( \
    :athlete_id, \
    :slug, \
    :share)'

  const conn = connect(config)
  await conn.execute(insertSql, settings)
}

export async function findByAthleteId(athleteId: number): Promise<Settings> {
  const conn = connect(config)
  const results = await conn.execute('select * from Settings where athlete_id = ?', [athleteId])
  if (results.rows.length === 0) {
    return {
      athlete_id: athleteId,
      slug: '',
      share: false,
    }
  }
  return results.rows[0] as Settings
}

export async function findBySlugShared(slug: string): Promise<Settings | null> {
  const conn = connect(config)
  const results = await conn.execute('select * from Settings where `slug` = ? and `share` = 1', [slug])
  if (results.rows.length === 0) {
    return null
  }
  return results.rows[0] as Settings
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const conn = connect(config)
  const results = await conn.execute('select count(*) as c from Settings where slug = ?', [slug])
  const row = results.rows[0] as Record<string, any>
  const count = Number(row.c)
  return count == 0
}
