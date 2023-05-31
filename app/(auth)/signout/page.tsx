'use client'

export interface SignoutProps {
  url: URL
  csrfToken: string
}

export default function SignoutPage(props: SignoutProps) {
  const { url, csrfToken } = props

  return (
    <div className="signout">
      <div className="card">
        <h1>Signout</h1>
        <p>Are you sure you want to sign out?</p>
        <form action={`${url}/signout`} method="POST">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <button id="submitButton" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
