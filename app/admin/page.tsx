import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MainContainer } from 'components/MainContainer';
import { AddFilm } from 'components/admin/AddFilm';
import { AddFilmBySearch } from 'components/admin/AddFilmBySearch';
import { AddNominations } from 'components/admin/AddNominations';
import { isAdmin } from 'lib/authorization';
import { Typography } from 'components/base/Typography';
import { RevalidateTag } from 'components/admin/RevalidateTag';

export const metadata: Metadata = {
  title: 'Admin dashboard – Awards Night'
};

export default async function Page() {
  const admin = await isAdmin();
  if (!admin) return redirect('/');

  return (
    <MainContainer>
      <Typography variant="h1" color="white">
        Admin panel
      </Typography>
      <AddFilm />
      <AddFilmBySearch />
      <AddNominations />
      <RevalidateTag />
    </MainContainer>
  );
}
