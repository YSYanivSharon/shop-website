import { signup } from '@/app/actions/auth';

export default function Page() {
  return (
    <div>
      <form action={signup}>
        <input name='email' />
        <input name='password' />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}
