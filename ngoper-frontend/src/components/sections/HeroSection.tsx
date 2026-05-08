import { MaterialIcon } from '../ui/MaterialIcon';

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7xf9VytCdSRv4XP7DOeK_Zn6ymc8By9mz1HJ8Ym2MydqwhIPU5SmwIwTL2QqcuHJXRn7xAGNwColmo6VSR44vXLL18uPjqlWNlnChomGqUxQsizQyb8acXTEjlmXszsm0_5q1uuWoeEuAUyRiO8LjL0ih-LAeHAjoY3JX7vnlF9GworY7A7FVSlADjKJ2QW2MRwI-z1Xe9KLMOkzzfHvFRs7DVKuGXZfNIQr66YTR7FRW4dVm3HoFLBvRYMZlOCYBpHzigpdo2os';

export function HeroSection() {
  return (
    <section className="min-h-[85vh] flex flex-col lg:flex-row items-center px-8 lg:px-20 py-12 gap-12 max-w-[1600px] mx-auto pt-20">
      <div className="flex-1 space-y-8 text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-container/10 border border-primary-container/20">
          <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Global Jastip Network
          </span>
        </div>

        <h2 className="text-5xl lg:text-8xl font-extrabold leading-[1.05] tracking-tighter">
          Request items <br />
          <span className="gradient-text">worldwide.</span>
        </h2>

        <p className="text-on-surface/60 text-lg lg:text-xl max-w-xl leading-relaxed">
          Connect with travelers who can help you get anything from anywhere.
          Secure, verified, and built on trust.
        </p>

        <div className="space-y-4 max-w-lg">
          <div className="flex p-1.5 bg-surface-variant/30 rounded-2xl border border-white/5 focus-within:border-primary-container/50 transition-all">
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-3 outline-none"
              placeholder="What are you looking for?"
              type="text"
            />
            <button className="bg-primary-container text-on-primary-container font-bold px-8 py-3 rounded-xl glow-watermelon">
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold transition-all flex items-center gap-2">
              Bergabung Dengan Kami{' '}
              <MaterialIcon name="arrow_forward" className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative w-full lg:h-[600px] group">
        <div className="absolute -inset-4 bg-primary-container/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
        <div className="relative w-full h-full glass-card rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
          <img
            className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-1000"
            alt="A cinematic, high-contrast shot of a traveler in a bustling international airport at sunset."
            src={heroImage}
          />
          <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-2xl border-white/10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">
              Featured Jastiper
            </p>
            <h4 className="text-xl font-bold">Marcus just landed in Seoul.</h4>
            <p className="text-on-surface/60 text-sm">
              Accepting requests for another 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}