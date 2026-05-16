import { MaterialIcon } from '../ui/MaterialIcon';
import { getImageUrl, type Trip } from '../../api/trips';

const statusMeta: Record<string, { label: string; color: string }> = {
  upcoming: { label: 'Upcoming', color: 'text-blue-400' },
  ongoing: { label: 'Ongoing', color: 'text-green-400' },
  completed: { label: 'Completed', color: 'text-slate-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-400' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const statusOptions = ['upcoming', 'ongoing', 'completed', 'cancelled'];

export function TripDetail({
  trip,
  onBack,
  userRole,
  userId,
  onRequestJoin,
  onUpdateStatus,
}: {
  trip: Trip;
  onBack: () => void;
  userRole?: string;
  userId?: string;
  onRequestJoin: () => void;
  onUpdateStatus?: (status: string) => void;
}) {
  const citiesFromItinerary = [...new Set(trip.itinerary.map((i) => i.location).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors"
      >
        <MaterialIcon name="arrow_back" className="text-base" />
        Back to Trips
      </button>

      {/* Hero */}
      <section className="relative h-[360px] rounded-2xl overflow-hidden">
        {trip.poster ? (
          <img
            alt={trip.title}
            src={getImageUrl(trip.poster)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
            <MaterialIcon name="image" className="text-5xl text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary-container text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              TRIP
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${(statusMeta[trip.status]?.color || 'text-slate-400')} bg-background/80 backdrop-blur-md border border-white/10`}>
              {statusMeta[trip.status]?.label || trip.status}
            </span>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1 drop-shadow-lg">
            {trip.title}
          </h2>
          <p className="text-zinc-300 text-sm md:text-base max-w-2xl line-clamp-2">
            {trip.description}
          </p>
        </div>
      </section>

      {/* Trip Overview — all required data fields */}
      <div className="glass-card rounded-2xl p-5 md:p-6">
        <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
          <MaterialIcon name="info" className="text-primary-container text-lg" />
          Trip Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-5">
          <div className="col-span-2 md:col-span-1">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <MaterialIcon name="flight_takeoff" className="text-xs" />
              Origin City
            </p>
            <p className="text-white font-bold text-sm">{trip.origin_city}</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <MaterialIcon name="flag" className="text-xs" />
              Destination
            </p>
            <p className="text-white font-bold text-sm">{trip.destination_country}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <MaterialIcon name="calendar_today" className="text-xs" />
              Departure
            </p>
            <p className="text-white font-semibold text-sm">{formatDate(trip.start_date)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <MaterialIcon name="calendar_month" className="text-xs" />
              Est. Return
            </p>
            <p className="text-white font-semibold text-sm">{formatDate(trip.end_date)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <MaterialIcon name="local_shipping" className="text-xs" />
              Local Delivery
            </p>
            <p className="text-primary-container font-bold text-sm">{formatDate(trip.local_delivery_date)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <MaterialIcon name="group" className="text-xs" />
              Slots Left
            </p>
            <p className={`font-bold text-sm ${trip.available_slots > 0 ? 'text-green-400' : 'text-slate-500'}`}>
              {trip.available_slots > 0 ? `${trip.available_slots} available` : 'Full'}
            </p>
          </div>
        </div>
      </div>

      {/* Route Summary */}
      {citiesFromItinerary.length > 0 && (
        <div className="glass-card rounded-2xl p-5 md:p-6">
          <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon name="route" className="text-primary-container text-lg" />
            Route
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="bg-primary-container/20 text-primary-container font-bold px-3 py-1.5 rounded-lg text-xs">
              {trip.origin_city}
            </span>
            {citiesFromItinerary.map((city, i) => (
              <span key={i} className="flex items-center gap-2">
                <MaterialIcon name="arrow_forward" className="text-xs text-slate-600" />
                <span className="bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-lg text-xs font-medium border border-white/5">
                  {city}
                </span>
              </span>
            ))}
            <MaterialIcon name="arrow_forward" className="text-xs text-slate-600" />
            <span className="bg-primary-container/20 text-primary-container font-bold px-3 py-1.5 rounded-lg text-xs">
              {trip.destination_country}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Itinerary Timeline */}
        <div className="lg:col-span-7 xl:col-span-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MaterialIcon name="timeline" className="text-primary-container" />
            Itinerary
          </h3>
          {trip.itinerary.length > 0 ? (
            <div className="relative pl-8 border-l-2 border-zinc-800 space-y-8 pb-4">
              {trip.itinerary.map((item, i) => {
                const isFirst = i === 0;
                const isLast = i === trip.itinerary.length - 1;
                return (
                  <div key={i} className="relative">
                    <div
                      className={`absolute -left-[41px] top-0 w-5 h-5 bg-zinc-950 border-4 rounded-full z-10 ${
                        isFirst || isLast ? 'border-primary-container' : 'border-zinc-700'
                      }`}
                    />
                    <div className={`glass-card rounded-2xl p-5 border-l-4 ${isFirst ? 'border-l-primary-container' : 'border-l-zinc-700'}`}>
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <h4 className="font-bold text-on-surface">{item.place_name}</h4>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MaterialIcon name="schedule" className="text-xs" />
                          {item.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 flex items-center gap-1.5">
                        <MaterialIcon name="location_on" className="text-sm text-primary-container" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <MaterialIcon name="map" className="text-3xl text-slate-600 mb-2" />
              <p className="text-slate-500 text-sm">No itinerary listed yet.</p>
            </div>
          )}

          {/* Cities Visited */}
          {trip.cities_visited && trip.cities_visited.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <MaterialIcon name="pin_drop" className="text-primary-container text-base" />
                Cities Visited
              </h4>
              <div className="flex flex-wrap gap-2">
                {trip.cities_visited.map((city, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-medium border border-white/5 flex items-center gap-1"
                  >
                    <MaterialIcon name="location_on" className="text-[10px] text-primary-container" />
                    {city}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Catalog Items (placeholder) */}
          {trip.catalog_item_ids && trip.catalog_item_ids.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <MaterialIcon name="inventory_2" className="text-primary-container text-base" />
                Catalog Items
              </h4>
              <div className="flex flex-wrap gap-2">
                {trip.catalog_item_ids.map((id, i) => (
                  <span key={i} className="px-3 py-1.5 bg-zinc-900 text-slate-400 rounded-full text-xs font-medium border border-white/5">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Jastiper Card */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 blur-3xl" />
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-primary-container p-0.5 overflow-hidden">
                  {trip.jastiper_avatar ? (
                    <img alt={trip.jastiper_name} src={getImageUrl(trip.jastiper_avatar)} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center">
                      <MaterialIcon name="person" className="text-xl text-slate-500" />
                    </div>
                  )}
                </div>
                <MaterialIcon
                  name="verified"
                  filled
                  className="text-xs bg-primary-container text-white p-1 rounded-full border-2 border-zinc-900 absolute -bottom-1 -right-1"
                />
              </div>
              <div>
                <p className="text-white font-bold">{trip.jastiper_name}</p>
                <p className="text-xs text-slate-400">Trip Jastiper</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                  From
                </p>
                <p className="text-white text-sm font-bold">{trip.origin_city}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                  To
                </p>
                <p className="text-primary-container text-sm font-bold">{trip.destination_country}</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Departure</span>
                <span className="text-white font-semibold">{formatDate(trip.start_date)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Est. Return</span>
                <span className="text-white font-semibold">{formatDate(trip.end_date)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Local Delivery</span>
                <span className="text-primary-container font-bold">{formatDate(trip.local_delivery_date)}</span>
              </div>
            </div>

            {/* Status bar */}
            <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Slots</span>
                <span className={`text-xs font-bold ${trip.available_slots > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                  {trip.available_slots > 0 ? `${trip.available_slots} remaining` : 'Fully booked'}
                </span>
              </div>
              {trip.available_slots > 0 && (
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-container h-full rounded-full transition-all"
                    style={{ width: `${Math.min((trip.available_slots / 10) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>

            {userRole === 'jastiper' && userId === trip.jastiper_id ? (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                  Trip Status
                </label>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onUpdateStatus?.(s)}
                      disabled={s === trip.status}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                        s === trip.status
                          ? 'bg-primary-container text-white'
                          : 'bg-zinc-800 text-slate-400 hover:bg-zinc-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onRequestJoin}
                disabled={trip.available_slots <= 0}
                className="w-full bg-primary-container text-white font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all glow-watermelon disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{ boxShadow: '0 4px 15px rgba(255,82,93,0.4)' }}
              >
                <MaterialIcon name="add_shopping_cart" className="text-lg" />
                {trip.available_slots > 0 ? 'Request to Join' : 'Join Waitlist'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
