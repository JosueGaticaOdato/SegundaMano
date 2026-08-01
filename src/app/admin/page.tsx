import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardContainer from '@/components/admin/DashboardContainer';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (token !== 'authenticated') {
    redirect('/admin/login');
  }

  return <DashboardContainer />;
}
