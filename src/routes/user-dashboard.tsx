import { createFileRoute } from '@tanstack/react-router'
import UserDashboard from '@/pages/UserDashboard'; // импорт компонента
// Пример данных, которые вы хотите передать
const user = {
  name: "Ігорь Высоцький",
  status: "seller",
  email: "ihor.vysoitsky@knure.ua",
  paypal: "FAKE-CLIENT-ID-123",
  offerLimit: "4/5",
  registrationDate: "19 мая, 2023 г.",
  lastUpdate: "19 мая, 2023 г.",
  about: "SWAG"
};

const offers = Array.from({ length: 4 }).map((_, i) => ({
  id: String(i),
  address: "Somewhere st. 12",
  type: "rent",
  price: 40000,
  imageUrl: "https://surl.li/tsnybn"
}));
// function RouteComponent() {
//   return <div>Hello "/user-dashboard"!</div>
// }
export const Route = createFileRoute('/user-dashboard')({
  component: () => <UserDashboard user={user} offers={offers} />,
});