import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { ordersApi, type Order } from '../api/orders';

const statusMeta: Record<string, { label: string; color: string; icon: string }> = {
  purchased: { label: 'Purchased', color: 'text-primary', icon: '' },
  in_transit: { label: 'In Transit', color: 'text-tertiary', icon: 'local_shipping' },
  delivered: { label: 'Delivered', color: 'text-on-surface-variant', icon: 'check_circle' },
  completed: { label: 'Completed', color: 'text-on-surface-variant', icon: 'check_circle' },
  cancelled: { label: 'Cancelled', color: 'text-slate-500', icon: 'cancel' },
};

const filterTabs = ['Active', 'Pending', 'Completed'] as const;
type FilterTab = (typeof filterTabs)[number];

function tabToStatuses(tab: FilterTab): string[] {
  switch (tab) {
    case 'Active':
      return ['purchased', 'in_transit'];
    case 'Pending':
      return ['pending'];
    case 'Completed':
      return ['delivered', 'completed'];
  }
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('Active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ordersApi.getOrders({ limit: 50 });
      const sorted = (response.data.orders || []).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setAllOrders(sorted);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const allowed = tabToStatuses(activeTab);
    setOrders(allOrders.filter((o) => allowed.includes(o.status)));
  }, [activeTab, allOrders]);

  const orderCount = orders.length;

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />

      <div className="pt-16 h-screen overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Sticky Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth sticky top-0 pt-1 z-10">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                    activeTab === tab
                      ? 'bg-primary-container text-on-primary-container glow-watermelon'
                      : 'bg-surface-container-high text-slate-400 hover:bg-white/5'
                  }`}
                  style={
                    activeTab === tab
                      ? { boxShadow: '0 0 20px rgba(255,82,93,0.3)' }
                      : undefined
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Section Label */}
            <div className="flex justify-between items-center">
              <h2 className="text-[22px] font-semibold leading-snug text-on-surface">
                {activeTab} Orders
              </h2>
              <span className="text-primary text-xs font-medium bg-primary-container/10 px-2 py-1 rounded">
                {orderCount} Order{orderCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
                <button
                  className="ml-3 underline"
                  onClick={fetchOrders}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty State */}
            {!loading && orders.length === 0 && !error && (
              <div className="text-center py-12 text-slate-500">
                <MaterialIcon name="shopping_bag" className="text-4xl mb-2" />
                <p className="text-lg font-bold">No {activeTab.toLowerCase()} orders</p>
                <p className="text-sm">Orders will appear here once you receive them</p>
              </div>
            )}

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </main>

        {/* FAB */}
        <button
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary-container text-white rounded-full flex items-center justify-center shadow-xl glow-watermelon active:scale-95 duration-200 z-40"
          style={{ boxShadow: '0 8px 30px rgba(255,77,90,0.6)' }}
        >
          <MaterialIcon name="add_shopping_cart" className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const meta = statusMeta[order.status] || statusMeta.purchased;
  const isDelivered = order.status === 'delivered' || order.status === 'completed';

  return (
    <div
      className={`glass-card rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden ${
        isDelivered ? 'opacity-70' : ''
      }`}
    >
      {order.status === 'purchased' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl -mr-16 -mt-16" />
      )}
      <div className="flex gap-4">
        <div
          className={`w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 ${
            isDelivered ? 'grayscale' : ''
          }`}
        >
          <img
            alt={order.product_name}
            className="w-full h-full object-cover"
            src={order.product_image}
          />
        </div>
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                #{order.order_number}
              </span>
              <div className={`flex items-center gap-1 ${meta.color}`}>
                {order.status === 'purchased' && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
                {meta.icon && (
                  <MaterialIcon name={meta.icon} className="text-sm" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {meta.label}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-on-surface mt-1">
              {order.product_name}
            </h3>
            <p className="text-xs text-slate-400">Client: {order.client_name}</p>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xl text-primary font-bold">
              {formatPrice(order.price)}
            </span>
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <MaterialIcon name="chevron_right" className="text-on-surface" />
            </button>
          </div>
        </div>
      </div>
      {order.status === 'in_transit' && order.estimated_arrival && (
        <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <MaterialIcon name="history" className="text-sm" />
            <span>
              Estimated Arrival:{' '}
              {new Date(order.estimated_arrival).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <span className="text-tertiary cursor-pointer hover:underline">
            Track Package
          </span>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
