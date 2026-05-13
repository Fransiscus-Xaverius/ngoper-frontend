import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { ordersApi, type Order } from '../api/orders';
import { postsApi, getImageUrl, type OrderRequest } from '../api/posts';

type Tab = 'requests' | 'ongoing' | 'delivered' | 'cancelled';

const tabs: { key: Tab; label: string }[] = [
  { key: 'requests', label: 'Requests' },
  { key: 'ongoing', label: 'On Going' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const orderStatusMeta: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Awaiting Payment', color: 'text-yellow-400', icon: '' },
  processed: { label: 'Paid', color: 'text-blue-400', icon: '' },
  purchased: { label: 'Purchased', color: 'text-primary', icon: '' },
  in_transit: { label: 'In Transit', color: 'text-tertiary', icon: 'local_shipping' },
  delivered: { label: 'Delivered', color: 'text-on-surface-variant', icon: 'check_circle' },
  completed: { label: 'Completed', color: 'text-on-surface-variant', icon: 'check_circle' },
  cancelled: { label: 'Cancelled', color: 'text-slate-500', icon: 'cancel' },
};

export function TransactionsPage() {
  const [tab, setTab] = useState<Tab>('requests');

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />
      <div className="pt-16 h-screen overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar sticky top-0 pt-1 z-10">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs whitespace-nowrap transition-all ${
                    tab === key
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-[22px] font-semibold leading-snug">Transactions</h2>
            </div>

            {tab === 'requests' && <RequestsSection />}
            {tab === 'ongoing' && <OrdersSection statuses="ongoing" />}
            {tab === 'delivered' && <OrdersSection statuses="delivered" />}
            {tab === 'cancelled' && <OrdersSection statuses="cancelled" />}
          </div>
        </main>
      </div>
    </div>
  );
}

function RequestsSection() {
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postsApi.getUserRequests({ limit: 50 });
      setRequests(res.data.requests || []);
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400',
    countered: 'text-yellow-400',
    accepted: 'text-green-400',
    rejected: 'text-red-400',
  };

  return (
    <>
      {error ? <p className="text-red-400 text-sm text-center">{error}</p> : null}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <MaterialIcon name="receipt_long" className="text-4xl mb-2" />
          <p className="font-bold">No requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{req.description}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColors[req.status] || 'text-slate-400'}`}>{req.status}</span>
              </div>
              {req.images?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {req.images.map((img, idx) => <img key={idx} alt="" src={getImageUrl(img)} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />)}
                </div>
              )}
              <div className="flex gap-3 text-xs">
                <span className="text-slate-400">Qty: {req.quantity}</span>
                {req.proposed_price && <span className="text-slate-400">Proposed: ${req.proposed_price.toFixed(2)}</span>}
                {req.counter_price && <span className="text-yellow-400 font-bold">Counter: ${req.counter_price.toFixed(2)}</span>}
                {req.price && <span className="text-green-400 font-bold">Agreed: ${req.price.toFixed(2)}</span>}
                {req.product_name && <span className="text-slate-500">{req.product_name}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function OrdersSection({ statuses }: { statuses: 'ongoing' | 'delivered' | 'cancelled' }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusFilters: Record<string, string> = {
    ongoing: 'purchased',
    delivered: 'delivered',
    cancelled: 'cancelled',
  };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      if (statuses === 'ongoing') {
        const [pending, processed, purchased, inTransit] = await Promise.all([
          ordersApi.getMyOrders({ status: 'pending', limit: 50 }),
          ordersApi.getMyOrders({ status: 'processed', limit: 50 }),
          ordersApi.getMyOrders({ status: 'purchased', limit: 50 }),
          ordersApi.getMyOrders({ status: 'in_transit', limit: 50 }),
        ]);
        const all = [
          ...(pending.data.orders || []),
          ...(processed.data.orders || []),
          ...(purchased.data.orders || []),
          ...(inTransit.data.orders || []),
        ];
        all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(all);
      } else {
        const res = await ordersApi.getMyOrders({ status: statusFilters[statuses], limit: 50 });
        setOrders(res.data.orders || []);
      }
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }, [statuses]);

  const handlePay = async (orderId: string) => {
    try {
      await ordersApi.payOrder(orderId);
      fetch();
    } catch {
      setError('Payment failed');
    }
  };

  useEffect(() => { fetch(); }, [fetch]);

  const emptyMessages: Record<string, string> = {
    ongoing: 'No active orders',
    delivered: 'No delivered orders yet',
    cancelled: 'No cancelled orders',
  };

  return (
    <>
      {error ? <p className="text-red-400 text-sm text-center">{error}</p> : null}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <MaterialIcon name="shopping_bag" className="text-4xl mb-2" />
          <p className="font-bold">{emptyMessages[statuses]}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const meta = orderStatusMeta[order.status] || orderStatusMeta.purchased;
            return (
              <div key={order.id} className="glass-card rounded-xl p-4 flex gap-4 relative overflow-hidden">
                {order.status === 'purchased' && <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl -mr-16 -mt-16" />}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                  {order.product_image ? (
                    <img alt="" className="w-full h-full object-cover" src={order.product_image} />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <MaterialIcon name="shopping_bag" className="text-2xl text-slate-600" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider">#{order.order_number}</span>
                      <div className={`flex items-center gap-1 ${meta.color}`}>
                        {order.status === 'purchased' && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                        {meta.icon && <MaterialIcon name={meta.icon} className="text-sm" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{meta.label}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold mt-1">{order.product_name}</h3>
                  </div>
                  <span className="text-primary font-bold">${order.price.toFixed(2)}</span>
                </div>
                {order.status === 'pending' && (
                  <button
                    className="mt-2 w-full py-2 bg-green-500/20 text-green-400 font-bold rounded-lg text-sm hover:bg-green-500/30 active:scale-95 transition-all"
                    onClick={() => handlePay(order.id)}
                  >
                    Pay ${order.price.toFixed(2)}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default TransactionsPage;
