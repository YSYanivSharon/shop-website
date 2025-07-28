import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const cookieStore = await cookies();

  const token = cookieStore.get('auth-token');

  if (token) {
    return (
      <div>
        This is the admin panel page
      </div>
    );
  }

  redirect('/login');
}
