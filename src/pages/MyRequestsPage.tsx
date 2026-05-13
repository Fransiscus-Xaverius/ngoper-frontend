import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { postsApi, getImageUrl, type OrderRequest } from '../api/posts';

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400',
  countered: 'text-yellow-400',
  accepted: 'text-green-400',
  rejected: 'text-red-400',
};

export function MyRequestsPage() {
  const [status, setStatus] = useState('');
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postsApi.getUserRequests({
        status: status || undefined,
        limit: 50,
      });
      setRequests(response.data.requests || []);
    } catch {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />
      <div className="pt-16 h-screen overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[
                { key: '', label: 'All' },
                { key: 'pending', label: 'Pending' },
                { key: 'countered', label: 'Countered' },
                { key: 'accepted', label: 'Accepted' },
                { key: 'rejected', label: 'Rejected' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                    status === key
                      ? 'bg-primary-container text-on-primary-container glow-watermelon'
                      : 'bg-surface-container-high text-slate-400 hover:bg-white/5'
                  }`}
                  style={
                    status === key
                      ? { boxShadow: '0 0 20px rgba(255,82,93,0.3)' }
                      : undefined
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-[22px] font-semibold leading-snug text-on-surface">
                My Requests
              </h2>
              <span className="text-primary text-xs font-medium bg-primary-container/10 px-2 py-1 rounded">
                {requests.length}
              </span>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
                <button className="ml-3 underline" onClick={fetchRequests}>
                  Retry
                </button>
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && requests.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <MaterialIcon name="receipt_long" className="text-4xl mb-2" />
                <p className="text-lg font-bold">No requests yet</p>
              </div>
            )}

            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="glass-card rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColors[req.status] || 'text-slate-400'}`}>
                        {req.status}
                      </span>
                      <h3 className="text-lg font-bold text-on-surface mt-1">
                        {req.description}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Qty: {req.quantity}
                      </p>
                    </div>
                  </div>

                  {req.images && req.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {req.images.map((img, idx) => (
                        <img
                          key={idx}
                          alt={`Req ${idx + 1}`}
                          src={getImageUrl(img)}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 text-sm">
                    {req.proposed_price && (
                      <span className="text-slate-400">
                        Proposed: ${req.proposed_price.toFixed(2)}
                      </span>
                    )}
                    {req.counter_price && (
                      <span className="text-yellow-400 font-bold">
                        Countered: ${req.counter_price.toFixed(2)}
                      </span>
                    )}
                    {req.price && (
                      <span className="text-green-400 font-bold">
                        Agreed: ${req.price.toFixed(2)}
                      </span>
                    )}
                    {req.product_name && (
                      <span className="text-slate-500">
                        → {req.product_name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyRequestsPage;
