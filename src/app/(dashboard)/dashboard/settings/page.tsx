import EditPasswordCard from '@/components/features/dashboard/settings/edit-password-card';
import EditProfileCard from '@/components/features/dashboard/settings/edit-profile-card';
import UserCard from '@/components/features/dashboard/settings/user-card'
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const SettingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <>
      <UserCard session={session} />
      <EditProfileCard session={session?.user} />
      <EditPasswordCard />
    </>
  )
}

export default SettingPage