import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { postsApi, getImageUrl, type OrderRequest } from '../api/posts';

const statusMeta: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-400' },
  accepted: { label: 'Accepted', color: 'text-green-400' },
  rejected: { label: 'Rejected', color: 'text-slate-500' },
};

export function RequestsPage() {
  const [status, setStatus] = useState('pending');
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptPrice, setAcceptPrice] = useState('');
  const [acceptName, setAcceptName] = useState('');
  const [counteringId, setCounteringId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postsApi.getRequests({
        status,
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

  const handleAccept = async (req: OrderRequest) => {
    const price = parseFloat(acceptPrice);
    if (!price || price <= 0) {
      setError('Please enter a valid price');
      return;
    }
    setError(null);
    try {
      await postsApi.acceptRequest(req.id, {
        price,
        product_name: acceptName || req.description,
      });
      setSuccessMsg(`Order created for ${acceptName || req.description}`);
      setAcceptingId(null);
      setAcceptPrice('');
      setAcceptName('');
      fetchRequests();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await postsApi.rejectRequest(id);
      fetchRequests();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to reject request');
    }
  };

  const handleCounter = async (req: OrderRequest) => {
    const price = parseFloat(counterPrice);
    if (!price || price <= 0) {
      setError('Please enter a valid counter price');
      return;
    }
    setError(null);
    try {
      await postsApi.counterRequest(req.id, price);
      setSuccessMsg(`Counter offer of $${price.toFixed(2)} sent`);
      setCounteringId(null);
      setCounterPrice('');
      fetchRequests();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to counter');
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />
      <div className="pt-16 h-screen overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['pending', 'accepted', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all capitalize ${
                    status === s
                      ? 'bg-primary-container text-on-primary-container glow-watermelon'
                      : 'bg-surface-container-high text-slate-400 hover:bg-white/5'
                  }`}
                  style={
                    status === s
                      ? { boxShadow: '0 0 20px rgba(255,82,93,0.3)' }
                      : undefined
                  }
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-[22px] font-semibold leading-snug text-on-surface capitalize">
                {status} Requests
              </h2>
              <span className="text-primary text-xs font-medium bg-primary-container/10 px-2 py-1 rounded">
                {requests.length} request{requests.length !== 1 ? 's' : ''}
              </span>
            </div>

            {successMsg && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
                {successMsg}
                <button className="ml-3 underline" onClick={() => setSuccessMsg(null)}>
                  Dismiss
                </button>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
                <button className="ml-3 underline" onClick={() => setError(null)}>
                  Dismiss
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
                <MaterialIcon name="inbox" className="text-4xl mb-2" />
                <p className="text-lg font-bold">No {status} requests</p>
              </div>
            )}

            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="glass-card rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                        Request
                      </span>
                      <h3 className="text-lg font-bold text-on-surface mt-1">
                        {req.description}
                      </h3>
                      <p className="text-xs text-slate-400">
                        From: {req.requester?.name || 'User'} • Qty: {req.quantity}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        statusMeta[req.status]?.color || 'text-slate-400'
                      }`}
                    >
                      {statusMeta[req.status]?.label || req.status}
                    </span>
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

                  {req.proposed_price && (
                    <p className="text-sm text-slate-400">
                      Proposed: ${req.proposed_price.toFixed(2)}
                    </p>
                  )}
                  {req.counter_price && (
                    <p className="text-sm text-yellow-400 font-bold">
                      Countered: ${req.counter_price.toFixed(2)}
                    </p>
                  )}
                  {req.price && (
                    <p className="text-sm text-primary font-bold">
                      Price: ${req.price.toFixed(2)}
                    </p>
                  )}

                  {req.status === 'pending' && (
                    <>
                      {acceptingId === req.id ? (
                        <div className="space-y-2 p-3 bg-white/5 rounded-xl">
                          <input
                            type="text"
                            value={acceptName}
                            onChange={(e) => setAcceptName(e.target.value)}
                            placeholder="Product name"
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                          />
                          <input
                            type="number"
                            value={acceptPrice}
                            onChange={(e) => setAcceptPrice(e.target.value)}
                            placeholder="Price in USD"
                            step="0.01"
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              className="flex-1 bg-primary-container text-on-primary-container font-bold py-2 rounded-lg text-sm active:scale-95 transition-all"
                              onClick={() => handleAccept(req)}
                            >
                              Confirm Accept
                            </button>
                            <button
                              className="px-4 py-2 bg-white/5 rounded-lg text-sm text-slate-400"
                              onClick={() => {
                                setAcceptingId(null);
                                setAcceptPrice('');
                                setAcceptName('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {counteringId === req.id ? (
                            <div className="space-y-2 p-3 bg-white/5 rounded-xl">
                              <input
                                type="number"
                                value={counterPrice}
                                onChange={(e) => setCounterPrice(e.target.value)}
                                placeholder="Counter price in USD"
                                step="0.01"
                                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
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
                                className="flex-1 bg-green-500/20 text-green-400 font-bold py-2 rounded-lg text-sm hover:bg-green-500/30 active:scale-95 transition-all"
                                onClick={() => {
                                  setAcceptingId(req.id);
                                  setAcceptPrice(req.counter_price?.toString() || req.proposed_price?.toString() || '');
                                  setAcceptName(req.product_name || '');
                                }}
                              >
                                Accept
                              </button>
                              <button
                                className="flex-1 bg-yellow-500/10 text-yellow-400 font-bold py-2 rounded-lg text-sm hover:bg-yellow-500/20 active:scale-95 transition-all"
                                onClick={() => {
                                  setCounteringId(req.id);
                                  setCounterPrice(req.counter_price?.toString() || req.proposed_price?.toString() || '');
                                }}
                              >
                                Counter
                              </button>
                              <button
                                className="flex-1 bg-red-500/10 text-red-400 font-bold py-2 rounded-lg text-sm hover:bg-red-500/20 active:scale-95 transition-all"
                                onClick={() => handleReject(req.id)}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RequestsPage;
