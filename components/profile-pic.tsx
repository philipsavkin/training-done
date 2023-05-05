type ProfilePicProps = {
  username: string
  firstname: string | null
  lastname: string | null
  id: number
  profilePicUrl: string | null
}

export default function ProfilePic(props: ProfilePicProps) {
  return (
    <div className="group relative">
      <img
        tabIndex={0}
        className="h-8 w-8 rounded-full"
        src={props.profilePicUrl ?? ''}
        alt="Profile picture"
        width={32}
        height={32}
      />
      <nav
        tabIndex={1}
        className="invisible absolute right-0 top-full w-40 rounded  border border-stone-700 bg-white text-sm opacity-0 drop-shadow-xl transition-all group-focus-within:visible group-focus-within:translate-y-1 group-focus-within:opacity-100"
      >
        <div className="truncate border-b-2 px-4 py-3 font-medium">{`${props.firstname} ${props.lastname}`}</div>
        <ul className="py-1">
          <li>
            <a href="/settings" className="block px-4 py-2 hover:bg-stone-200">
              Settings
            </a>
          </li>
          <li>
            <a href="/api/auth/signout" className="block px-4 py-2 hover:bg-stone-200">
              Log out
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
