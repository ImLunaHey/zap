import { getFriends } from '../../redis';
import { Subscription } from './Subscription';

export default async function Page(props: {
  searchParams: {
    id: string;
  };
}) {
  const id = props.searchParams.id;

  // Redirect to home page if no ID is provided
  if (!id) return Response.redirect('/');

  const friends = await getFriends(id);

  return (
    <div>
      <h1>Friends</h1>
      {friends.map((subscription) => {
        return <Subscription key={subscription.id} {...subscription} />;
      })}
    </div>
  );
}
