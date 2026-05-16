import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { TripDetail } from '../components/trips/TripDetail';
import { tripsApi, type Trip, type CreateTripRequestPayload } from '../api/trips';
import { useAppSelector } from '../store/hooks';

function RequestJoinModal({
  trip,
  onClose,
}: {
  trip: Trip;
  onClose: () => void;
}) {
  const [message, setMessage] = useState('');
  const [itemsDescription, setItemsDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please introduce yourself');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await tripsApi.requestToJoin(trip.id, {
        message: message.trim(),
        items_description: itemsDescription.trim() || undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-surface-container-high rounded-2xl w-full max-w-md mx-4 p-8 text-center border border-white/10">
          <MaterialIcon name="check_circle" className="text-5xl text-green-400 mb-4" filled />
          <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
          <p className="text-slate-400 mb-6">
            The jastiper will review your request and respond soon.
          </p>
          <button
            type="button"
            className="bg-primary-container text-white font-bold px-8 py-3 rounded-full active:scale-95 transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-high rounded-2xl w-full max-w-md mx-4 overflow-hidden border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-bold text-lg">Request to Join Trip</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="glass-card rounded-xl p-3 space-y-1">
            <p className="text-sm font-bold text-on-surface">{trip.title}</p>
            <p className="text-xs text-slate-400">
              {trip.destination_country} • {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Message to Jastiper *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Introduce yourself and tell them what you're looking for..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-slate-500 outline-none resize-none min-h-[100px]"
              autoFocus
            />
            <span className="text-[10px] text-slate-500">{message.length}/500</span>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Items You Want (optional)
            </label>
            <textarea
              value={itemsDescription}
              onChange={(e) => setItemsDescription(e.target.value.slice(0, 500))}
              placeholder="Describe items you'd like them to find..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-slate-500 outline-none resize-none min-h-[80px]"
            />
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim() || submitting}
            className="w-full bg-primary-container text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const userId = user?.id;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestTrip, setRequestTrip] = useState<Trip | null>(null);

  const handleUpdateStatus = useCallback(async (status: string) => {
    if (!id) return;
    try {
      const res = await tripsApi.updateTripStatus(id, status);
      if (res.success) setTrip(res.data);
    } catch {
      /* ignore */
    }
  }, [id]);

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await tripsApi.getTrip(id);
      if (res.success) {
        setTrip(res.data);
      } else {
        setError('Trip not found');
      }
    } catch {
      setError('Failed to load trip');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />
      <div className="pt-16 h-screen overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {loading && (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {error && (
              <div className="text-center py-24">
                <MaterialIcon name="error_outline" className="text-4xl text-slate-500 mb-3" />
                <p className="text-slate-400 mb-4">{error}</p>
                <button
                  onClick={() => navigate('/trips')}
                  className="text-primary-container font-bold underline"
                >
                  Back to trips
                </button>
              </div>
            )}

            {!loading && !error && trip && (
              <TripDetail
                trip={trip}
                onBack={() => navigate('/trips')}
                userRole={userRole}
                userId={userId}
                onRequestJoin={() => setRequestTrip(trip)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        </main>
      </div>

      {requestTrip && (
        <RequestJoinModal
          trip={requestTrip}
          onClose={() => setRequestTrip(null)}
        />
      )}
    </div>
  );
}

export default TripDetailPage;
