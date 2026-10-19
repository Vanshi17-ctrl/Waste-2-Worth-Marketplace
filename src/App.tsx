import { useEffect } from 'react';
import { StoreProvider, useStore } from '@/store';
import { RouterProvider, useRouter } from '@/router';
import { ToastHost } from '@/components/Toast';
import { AppShell } from '@/components/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { BuyPage } from '@/pages/BuyPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { SellPage } from '@/pages/SellPage';
import { FreePage } from '@/pages/FreePage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { TrackOrderPage } from '@/pages/TrackOrderPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { MyListingsPage } from '@/pages/MyListingsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ImpactPage } from '@/pages/ImpactPage';

function Routes() {
  const { user } = useStore();
  const { route, navigate } = useRouter();

  // Guard: require auth for everything except login
  useEffect(() => {
    if (!user && route.name !== 'login') navigate({ name: 'login' });
    if (user && route.name === 'login') navigate({ name: 'dashboard' });
  }, [user, route, navigate]);

  if (!user) return <LoginPage />;

  const content = (() => {
    switch (route.name) {
      case 'dashboard': return <DashboardPage />;
      case 'buy': return <BuyPage />;
      case 'product': return <ProductDetailPage id={route.id} />;
      case 'sell': return <SellPage />;
      case 'free': return <FreePage />;
      case 'checkout': return <CheckoutPage listingId={route.listingId} qty={route.qty} />;
      case 'order-confirmation': return <OrderConfirmationPage orderId={route.orderId} />;
      case 'track': return <TrackOrderPage orderId={route.orderId} />;
      case 'orders': return <OrdersPage />;
      case 'my-listings': return <MyListingsPage />;
      case 'profile': return <ProfilePage />;
      case 'impact': return <ImpactPage />;
      default: return <DashboardPage />;
    }
  })();

  // Pages that should render without the shell chrome
  const bareRoutes = ['checkout', 'order-confirmation'];
  if (bareRoutes.includes(route.name)) {
    return <AppShell active={route.name}>{content}</AppShell>;
  }

  return <AppShell active={route.name}>{content}</AppShell>;
}

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider>
        <Routes />
        <ToastHost />
      </RouterProvider>
    </StoreProvider>
  );
}
