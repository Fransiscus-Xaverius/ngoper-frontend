import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Header } from '../components/layout';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { useAppSelector } from '../store/hooks';
import { TripCard } from '../components/trips/TripCard';
import { tripsApi, type Trip, type ItineraryItem } from '../api/trips';

const dateTheme = createTheme({
  palette: { mode: 'dark' },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          fontSize: '14px',
        },
        notchedOutline: { borderColor: 'rgba(255,255,255,0.1)' },
        input: { padding: '12px', color: '#e2e8f0' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: '#64748b', fontSize: '14px' },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: { color: '#64748b' },
      },
    },
  },
});

type FilterChip = 'all' | 'upcoming' | 'ongoing' | 'completed';

const filters: { key: FilterChip; label: string }[] = [
  { key: 'all', label: 'All Trips' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
];

function CreateTripModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [localDeliveryDate, setLocalDeliveryDate] = useState('');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { place_name: '', location: '', time: '' },
  ]);
  const [citiesVisited, setCitiesVisited] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const addItineraryItem = () => {
    setItinerary((prev) => [...prev, { place_name: '', location: '', time: '' }]);
  };

  const removeItineraryItem = (idx: number) => {
    setItinerary((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItinerary = (idx: number, field: keyof ItineraryItem, value: string) => {
    setItinerary((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPosterPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !destinationCountry.trim() || !originCity.trim() || !startDate || !endDate || !localDeliveryDate) {
      setError('Please fill in all required fields');
      return;
    }
    const validItinerary = itinerary.filter((item) => item.place_name.trim());
    if (validItinerary.length === 0) {
      setError('Add at least one itinerary item');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await tripsApi.createTrip({
        title: title.trim(),
        description: description.trim(),
        destination_country: destinationCountry.trim(),
        poster: '',
        start_date: startDate,
        end_date: endDate,
        local_delivery_date: localDeliveryDate,
        origin_city: originCity.trim(),
        itinerary: validItinerary,
        cities_visited: citiesVisited
          ? citiesVisited.split(',').map((c) => c.trim()).filter(Boolean)
          : undefined,
      }, posterFile);

      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-high rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-surface-container-high z-10">
          <h3 className="font-bold text-lg">Create New Trip</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Poster Image *
            </label>
            {posterPreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2">
                <img alt="Poster preview" src={posterPreview} className="w-full h-full object-cover" />
                <button
                  onClick={() => { setPosterFile(null); setPosterPreview(null); }}
                  className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full"
                >
                  <MaterialIcon name="close" className="text-white text-sm" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-32 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                <MaterialIcon name="add_photo_alternate" className="text-2xl text-slate-500" />
                <span className="text-xs text-slate-500">Click to upload poster</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handlePosterSelect}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tokyo Spring Haul 2026"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-slate-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                Destination Country *
              </label>
              <input
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                placeholder="e.g. Japan"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Describe your trip..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-slate-500 outline-none resize-none min-h-[80px]"
            />
          </div>

          <ThemeProvider theme={dateTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                  Start Date *
                </label>
                <DatePicker
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(date) => setStartDate(date ? date.format('YYYY-MM-DD') : '')}
                  slotProps={{ textField: { size: 'small', fullWidth: true, placeholder: 'Select date' } }}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                  Est. Return *
                </label>
                <DatePicker
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(date) => setEndDate(date ? date.format('YYYY-MM-DD') : '')}
                  slotProps={{ textField: { size: 'small', fullWidth: true, placeholder: 'Select date' } }}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                  Local Delivery *
                </label>
                <DatePicker
                  value={localDeliveryDate ? dayjs(localDeliveryDate) : null}
                  onChange={(date) => setLocalDeliveryDate(date ? date.format('YYYY-MM-DD') : '')}
                  slotProps={{ textField: { size: 'small', fullWidth: true, placeholder: 'Select date' } }}
                />
              </div>
            </div>
          </LocalizationProvider>
          </ThemeProvider>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Origin City (Your Domicile) *
            </label>
            <input
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder="e.g. Jakarta"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-slate-500 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Itinerary *
              </label>
              <button
                type="button"
                onClick={addItineraryItem}
                className="text-xs text-primary-container font-bold flex items-center gap-1 hover:underline"
              >
                <MaterialIcon name="add" className="text-sm" />
                Add Stop
              </button>
            </div>
            <div className="space-y-3">
              {itinerary.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/5 rounded-xl p-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      value={item.place_name}
                      onChange={(e) => updateItinerary(idx, 'place_name', e.target.value)}
                      placeholder="Place name"
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-slate-500 outline-none"
                    />
                    <input
                      value={item.location}
                      onChange={(e) => updateItinerary(idx, 'location', e.target.value)}
                      placeholder="City"
                      className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-slate-500 outline-none"
                    />
                    <ThemeProvider theme={dateTheme}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={item.time ? dayjs(item.time) : null}
                          onChange={(date) => updateItinerary(idx, 'time', date ? date.format('YYYY-MM-DD') : '')}
                          slotProps={{ textField: { size: 'small', fullWidth: true, placeholder: 'Date' } }}
                        />
                      </LocalizationProvider>
                    </ThemeProvider>
                  </div>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItineraryItem(idx)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                    >
                      <MaterialIcon name="close" className="text-red-400 text-sm" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Cities Visited (optional — comma separated)
            </label>
            <input
              value={citiesVisited}
              onChange={(e) => setCitiesVisited(e.target.value)}
              placeholder="e.g. Tokyo, Osaka, Kyoto"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-primary-container text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TripPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [filter, setFilter] = useState<FilterChip>('all');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isJastiper = user?.role === 'jastiper';

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { status?: string; limit: number } = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      const res = await tripsApi.getTrips(params);
      setTrips(res.data.trips || []);
    } catch {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />
      <div className="pt-16 h-screen overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-semibold leading-snug">Trips</h2>
                <p className="text-sm text-slate-500">Browse trips and find what you need</p>
              </div>
              {isJastiper && (
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  style={{ boxShadow: '0 4px 15px rgba(255,82,93,0.4)' }}
                >
                  <MaterialIcon name="add" className="text-lg" />
                  Create Trip
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {filters.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 rounded-full font-medium text-xs whitespace-nowrap transition-all ${
                    filter === key
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Messages */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
                <button className="ml-3 underline" onClick={fetchTrips}>Retry</button>
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && trips.length === 0 && !error && (
              <div className="text-center py-16 text-slate-500">
                <MaterialIcon name="flight" className="text-4xl mb-2" />
                <p className="text-lg font-bold">No trips found</p>
                <p className="text-sm">{isJastiper ? 'Create your first trip!' : 'Check back later for new trips.'}</p>
              </div>
            )}

            {/* Trip Cards Grid */}
            {!loading && trips.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showCreateModal && <CreateTripModal onClose={() => { setShowCreateModal(false); fetchTrips(); }} />}
    </div>
  );
}

export default TripPage;
