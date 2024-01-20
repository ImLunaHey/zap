import { Friends } from '@/components/friends';

export default async function Page(props: {
  searchParams: {
    id: string;
  };
}) {
  const id = props.searchParams.id;

  // Redirect to home page if no ID is provided
  if (!id) return Response.redirect('/');

  return <Friends />;
}
