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

export function TripCard({
  trip,
  onClick,
}: {
  trip: Trip;
  onClick: () => void;
}) {
  const meta = statusMeta[trip.status] || statusMeta.upcoming;
  const routeCities = [...new Set(trip.itinerary.map((i) => i.location).filter(Boolean))];
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-card rounded-2xl overflow-hidden text-left w-full group cursor-pointer border border-white/5 hover:border-primary-container/30 transition-all"
    >
      <div className="relative h-44 overflow-hidden">
        {trip.poster ? (
          <img
            alt={trip.title}
            src={getImageUrl(trip.poster)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
            <MaterialIcon name="image" className="text-4xl text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="bg-background/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1">
              <MaterialIcon name="flag" className="text-[10px]" />
              {trip.destination_country}
            </span>
            {trip.available_slots > 0 && trip.available_slots <= 3 && (
              <span className="bg-primary-container/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                {trip.available_slots} slot{trip.available_slots > 1 ? 's' : ''} left
              </span>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${meta.color} bg-background/80 backdrop-blur-md border border-white/10`}>
            {meta.label}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-on-surface group-hover:text-primary-container transition-colors leading-snug">
          {trip.title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MaterialIcon name="flight_takeoff" className="text-primary-container text-base shrink-0" />
            <span>{formatDate(trip.start_date)}</span>
            <MaterialIcon name="arrow_forward" className="text-[10px] text-slate-600" />
            <span>{formatDate(trip.end_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MaterialIcon name="location_on" className="text-primary-container text-base shrink-0" />
            <span className="truncate">{trip.origin_city} → {trip.destination_country}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MaterialIcon name="local_shipping" className="text-primary-container text-base shrink-0" />
            <span>Delivery: {formatDate(trip.local_delivery_date)}</span>
          </div>
        </div>

        {routeCities.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {routeCities.slice(0, 3).map((city, i) => (
              <span key={i} className="text-[10px] text-slate-500 bg-surface-container-high px-2 py-0.5 rounded-full border border-white/5">
                {city}
              </span>
            ))}
            {routeCities.length > 3 && (
              <span className="text-[10px] text-slate-500">+{routeCities.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <div className="w-6 h-6 rounded-full bg-surface-container-high overflow-hidden flex-shrink-0">
            {trip.jastiper_avatar ? (
              <img alt="" src={getImageUrl(trip.jastiper_avatar)} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MaterialIcon name="person" className="text-xs text-slate-500" />
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500">{trip.jastiper_name}</span>
          <span className="ml-auto text-[10px] text-slate-600">{trip.itinerary.length} stops</span>
        </div>
      </div>
    </button>
  );
}
