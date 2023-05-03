import 'dotenv/config'
import open from 'open'

async function main() {
  const redirectUri = encodeURIComponent('https://localhost/redirect')
  const scope = encodeURIComponent('profile:read_all,activity:read_all')
  const url = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
  await open(url)
}

main().then(() => console.log('Done'))
