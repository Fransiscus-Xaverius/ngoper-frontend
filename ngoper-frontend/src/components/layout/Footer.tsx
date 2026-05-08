import { MaterialIcon } from '../ui/MaterialIcon';

const footerLinks = {
  product: ['How it works', 'Verified Program', 'Fee Structure'],
  community: ['Success Stories', 'Safety Guides', 'Ambassador'],
  support: ['Help Center', 'Dispute Resolution', 'Contact'],
};

const socialIcons = ['public', 'alternate_email'];

export function Footer() {
  return (
    <footer className="px-8 lg:px-20 py-24">
      <div className="max-w-[1400px] mx-auto glass-card rounded-[64px] p-12 lg:p-24 relative overflow-hidden text-center flex flex-col items-center">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-primary-container/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[400px] h-[400px] bg-primary-container/10 blur-[100px] rounded-full" />

        <h3 className="text-4xl lg:text-7xl font-black tracking-tight mb-8 leading-tight">
          Join the global <br />
          <span className="text-primary">watermelon network.</span>
        </h3>

        <p className="text-on-surface/50 text-lg lg:text-xl max-w-2xl mb-12">
          Get notified when the items you've been eyeing are within reach. Travel
          light, shop heavy.
        </p>

        <div className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 ring-primary-container/50 outline-none"
            placeholder="Your email address"
            type="email"
          />
          <button className="bg-primary-container text-on-primary-container font-black px-10 py-4 rounded-2xl glow-watermelon hover:scale-105 active:scale-95 transition-all">
            Get Started
          </button>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 text-left w-full border-t border-white/10 pt-16">
          <div>
            <h6 className="text-primary font-bold text-xs uppercase tracking-widest mb-6">
              Product
            </h6>
            <ul className="space-y-4 text-on-surface/40 text-sm">
              {footerLinks.product.map((link) => (
                <li
                  key={link}
                  className="hover:text-primary cursor-pointer transition-colors"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-primary font-bold text-xs uppercase tracking-widest mb-6">
              Community
            </h6>
            <ul className="space-y-4 text-on-surface/40 text-sm">
              {footerLinks.community.map((link) => (
                <li
                  key={link}
                  className="hover:text-primary cursor-pointer transition-colors"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-primary font-bold text-xs uppercase tracking-widest mb-6">
              Support
            </h6>
            <ul className="space-y-4 text-on-surface/40 text-sm">
              {footerLinks.support.map((link) => (
                <li
                  key={link}
                  className="hover:text-primary cursor-pointer transition-colors"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-primary font-bold text-xs uppercase tracking-widest mb-6">
              Connect
            </h6>
            <div className="flex gap-4">
              {socialIcons.map((icon) => (
                <div
                  key={icon}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary-container transition-all cursor-pointer group"
                >
                  <MaterialIcon name={icon} className="text-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-[10px] font-bold text-on-surface/20 uppercase tracking-[0.3em]">
          © 2026 PT Ngoper Global Infinity. All rights reserved.
        </div>
      </div>
    </footer>
  );
}