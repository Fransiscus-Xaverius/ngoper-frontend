import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { ordersApi, type Order } from '../api/orders';
import { postsApi, getImageUrl, type OrderRequest } from '../api/posts';

type FilterChip = 'all' | 'purchased' | 'in_transit' | 'delivered' | 'requests';

const orderFilters: { key: FilterChip; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'purchased', label: 'Purchased' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'requests', label: 'Requests' },
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

export function OrdersPage() {
  const [filter, setFilter] = useState<FilterChip>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [counteringId, setCounteringId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderRes, reqRes] = await Promise.all([
        ordersApi.getOrders({ limit: 50 }),
        postsApi.getRequests({ status: 'pending', limit: 50 }),
      ]);
      setOrders(
        (orderRes.data.orders || []).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
      setRequests(reqRes.data.requests || []);
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAccept = async (req: OrderRequest) => {
    const price = req.counter_price || req.proposed_price;
    if (!price) { setError('No price set for this request'); return; }
    setError(null);
    try {
      await postsApi.acceptRequest(req.id, { price });
      setSuccessMsg('Order created');
      fetchAll();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to accept');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await postsApi.rejectRequest(id);
      fetchAll();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to reject');
    }
  };

  const handleCounter = async (req: OrderRequest) => {
    const price = parseFloat(counterPrice);
    if (!price || price <= 0) { setError('Enter a valid counter price'); return; }
    setError(null);
    try {
      await postsApi.counterRequest(req.id, price);
      setSuccessMsg(`Counter offer of $${price.toFixed(2)} sent`);
      setCounteringId(null); setCounterPrice('');
      fetchAll();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to counter');
    }
  };

  const filteredOrders =
    filter === 'requests'
      ? []
      : filter === 'all'
        ? orders
        : orders.filter((o) => o.status === filter);

  const showRequests = filter === 'all' || filter === 'requests';

  const totalCount = filteredOrders.length + (showRequests ? requests.length : 0);

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />
      <div className="pt-16 h-screen overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar sticky top-0 pt-1 z-10">
              {orderFilters.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs whitespace-nowrap transition-all capitalize ${
                    filter === key
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className="flex justify-between items-center">
              <h2 className="text-[22px] font-semibold leading-snug">
                {filter === 'requests' ? 'Incoming Requests' : 'Orders'}
              </h2>
              <span className="text-primary text-xs font-medium bg-primary-container/10 px-2 py-1 rounded">
                {totalCount}
              </span>
            </div>

            {/* Messages */}
            {successMsg && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
                {successMsg}
                <button className="ml-2 underline" onClick={() => setSuccessMsg(null)}>Dismiss</button>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
                <button className="ml-3 underline" onClick={fetchAll}>Retry</button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty */}
            {!loading && totalCount === 0 && !error && (
              <div className="text-center py-12 text-slate-500">
                <MaterialIcon name="shopping_bag" className="text-4xl mb-2" />
                <p className="text-lg font-bold">
                  {filter === 'requests' ? 'No incoming requests' : 'No orders yet'}
                </p>
              </div>
            )}

            {/* Unified List */}
            <div className="space-y-4">
              {/* Pending Requests (shown on 'all' and 'requests' filters) */}
              {showRequests &&
                requests.map((req) => (
                  <div key={req.id} className="glass-card rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">Pending Request</span>
                        <h3 className="text-lg font-bold text-on-surface mt-1">{req.description}</h3>
                        <p className="text-xs text-slate-400">
                          From: {req.requester?.name || 'User'} • Qty: {req.quantity}
                        </p>
                      </div>
                    </div>

                    {req.images && req.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {req.images.map((img, idx) => (
                          <img key={idx} alt="" src={getImageUrl(img)} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                        ))}
                      </div>
                    )}

                    {req.proposed_price && (
                      <p className="text-xs text-slate-400">Buyer proposed: ${req.proposed_price.toFixed(2)}</p>
                    )}

                    {req.counter_price && (
                      <p className="text-xs text-yellow-400 font-bold">Countered: ${req.counter_price.toFixed(2)}</p>
                    )}

                    {counteringId === req.id ? (
                      <div className="space-y-2 p-3 bg-white/5 rounded-xl">
                        <input
                          type="number"
                          value={counterPrice}
                          onChange={(e) => setCounterPrice(e.target.value)}
                          placeholder="Counter price in USD"
                          step="0.01"
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            className="flex-1 bg-yellow-500/20 text-yellow-400 font-bold py-2 rounded-lg text-sm active:scale-95"
                            onClick={() => handleCounter(req)}
                          >
                            Send Counter
                          </button>
                          <button
                            className="px-4 py-2 bg-white/5 rounded-lg text-sm text-slate-400"
                            onClick={() => { setCounteringId(null); setCounterPrice(''); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-green-500/20 text-green-400 font-bold py-2 rounded-lg text-sm hover:bg-green-500/30 active:scale-95"
                          onClick={() => handleAccept(req)}
                        >
                          Accept → Order
                        </button>
                        <button
                          className="flex-1 bg-yellow-500/10 text-yellow-400 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500/20 active:scale-95"
                          onClick={() => {
                            setCounteringId(req.id);
                            setCounterPrice(req.counter_price?.toString() || req.proposed_price?.toString() || '');
                          }}
                        >
                          Counter
                        </button>
                        <button
                          className="flex-1 bg-red-500/10 text-red-400 font-bold py-2 rounded-lg text-sm hover:bg-red-500/20 active:scale-95"
                          onClick={() => handleReject(req.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}

              {/* Orders */}
              {filteredOrders.map((order) => {
                const meta = orderStatusMeta[order.status] || orderStatusMeta.purchased;
                const isDelivered = order.status === 'delivered' || order.status === 'completed';

                return (
                  <div
                    key={order.id}
                    className={`glass-card rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden ${isDelivered ? 'opacity-70' : ''}`}
                  >
                    {order.status === 'purchased' && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    )}
                    <div className="flex gap-4">
                      <div className={`w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 ${isDelivered ? 'grayscale' : ''}`}>
                        {order.product_image ? (
                          <img alt={order.product_name} className="w-full h-full object-cover" src={order.product_image} />
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
                          <h3 className="text-lg font-bold text-on-surface mt-1">{order.product_name}</h3>
                          <p className="text-xs text-slate-400">Client: {order.client_name || 'User'}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xl text-primary font-bold">${order.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    {order.status === 'processed' && (
                      <button
                        className="mt-2 w-full py-2 bg-green-500/20 text-green-400 font-bold rounded-lg text-sm hover:bg-green-500/30 active:scale-95 transition-all"
                        onClick={async () => {
                          try { await ordersApi.processOrder(order.id); fetchAll(); } catch {}
                        }}
                      >
                        Mark as Purchased
                      </button>
                    )}
                    {order.status === 'purchased' && (
                      <button
                        className="mt-2 w-full py-2 bg-tertiary/20 text-tertiary font-bold rounded-lg text-sm hover:bg-tertiary/30 active:scale-95 transition-all"
                        onClick={async () => {
                          try { await ordersApi.shipOrder(order.id); fetchAll(); } catch {}
                        }}
                      >
                        Mark as In Transit
                      </button>
                    )}
                    {order.status === 'in_transit' && order.estimated_arrival && (
                      <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between text-slate-500 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <MaterialIcon name="history" className="text-sm" />
                          <span>Est. Arrival: {new Date(order.estimated_arrival).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <span className="text-tertiary cursor-pointer hover:underline">Track Package</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

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

export default OrdersPage;
