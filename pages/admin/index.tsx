import { UserProfile } from '@auth0/nextjs-auth0';
import { withAdminRequired } from 'lib/withAdminRequired';
import { NextPage } from 'next';

type Props = {
  user: UserProfile;
};

const AdminPage: NextPage<Props> = (props) => {
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
};

export const getServerSideProps = withAdminRequired({
  getServerSideProps: async () => {
    return { props: {} };
  }
});

export default AdminPage;
