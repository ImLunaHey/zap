import { getSubscriptions } from '../redis';
import { Subscription } from './Subscription';

export default async function Page() {
  const subscriptions = await getSubscriptions();

  return (
    <div>
      <h1>Admin</h1>
      {subscriptions.map((subscription) => {
        return <Subscription key={subscription.id} {...subscription} />;
      })}
    </div>
  );
}
