import { MaterialIcon } from '../ui/MaterialIcon';

const trendingImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuCrG9efjDJq86jjQnnNvCKmJ9TTIHqop5GLvZSrGm8zdZT4Bca8WacQJqXOV_w66eLhD_5kjetzh5iWvIvNO4rmNArcuWeWMGEfmdJCF-XeuMYyzvwO3kBfJaIwL4FVZ1vF_d_fd44VT2jtm8GWB8HtN0zS7necnqY0n1d4WeBNmxYDMtHCfhvTjtkoS4lBYS_UsZvB4TBGRoW4cG-ag0HfXKQAaVzKr9vI4up4XCZU4ibUodJqWYWs9CkZWudDXo9ckA306Ef8Q';

const features = [
  {
    icon: 'verified_user',
    title: 'Zero-Risk Escrow',
    description: 'Your money is safe with us until you physically hold your requested item.',
  },
  {
    icon: 'speed',
    title: 'Hyper-Local Logistics',
    description: 'We optimize routes through traveler networks for the fastest delivery possible.',
  },
];

export function TrendingGrid() {
  return (
    <section className="px-8 lg:px-20 py-24 bg-surface-container-lowest/50">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <span className="w-3 h-8 bg-primary-container rounded-full" />
              Trending Drops
            </h3>
            <p className="text-on-surface/40 font-medium">
              Most requested items this week globally.
            </p>
          </div>
          <a
            className="text-primary font-bold text-xs uppercase tracking-[0.2em] border-b border-primary/30 pb-1 hover:border-primary transition-all"
            href="#"
          >
            View All Collections
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-[32px] border border-white/5">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Close up of luxury sneakers"
              src={trendingImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 space-y-4">
              <div className="flex gap-3">
                <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-black uppercase">
                  Rare Drop
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-bold">
                  Tokyo Exclusive
                </span>
              </div>
              <h4 className="text-4xl font-extrabold tracking-tighter">
                Vapor-X "Neon Red"
              </h4>
              <button className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest group/btn">
                Request This Route{' '}
                <MaterialIcon
                  name="arrow_right_alt"
                  className="transition-transform group-hover/btn:translate-x-2"
                />
              </button>
            </div>
          </div>

          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-8 rounded-[32px] flex flex-col justify-between hover:border-primary-container/30 transition-colors"
            >
              <MaterialIcon
                name={feature.icon}
                className="text-primary-container text-4xl mb-4"
              />
              <div className="space-y-2">
                <h4 className="text-xl font-bold">{feature.title}</h4>
                <p className="text-on-surface/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}

          <div className="lg:col-span-2 glass-card p-8 rounded-[32px] flex flex-col md:flex-row gap-8 items-center border-dashed border-white/20">
            <div className="flex-1 space-y-2">
              <h4 className="text-2xl font-bold">Ready to travel?</h4>
              <p className="text-on-surface/50">
                Monetize your empty suitcase space and earn while you explore the
                world.
              </p>
            </div>
            <button className="whitespace-nowrap px-8 py-3 bg-white text-black font-black rounded-2xl hover:bg-primary-container hover:text-white transition-all">
              Register Trip
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}