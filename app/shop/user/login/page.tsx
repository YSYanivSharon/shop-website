'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { login } from '@/app/components/user-provider';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = await login(email, password);

    if (user) {
      router.back();
    } else {
      // TODO: Handle login fails 
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input name='email' onChange={(e) => setEmail((prev) => e.target.value)} />
          <input name='password' onChange={(e) => setPassword((prev) => e.target.value)} />
          <button type='submit'>Submit</button>
        </form>
      </div>
      <Link href="/shop/user/signup">Or sign up</Link>
    </div>
  );
}
