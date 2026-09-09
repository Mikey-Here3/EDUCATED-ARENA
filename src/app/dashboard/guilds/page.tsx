import { redirect } from 'next/navigation';

export default function GuildsRedirectPage() {
  redirect('/dashboard/teams');
}
