import { MaterialIcon } from '../ui/MaterialIcon';

interface Jastiper {
  id: number;
  name: string;
  location: string;
  trips: number;
  rating: number;
  image: string;
  alt: string;
}

const jastipers: Jastiper[] = [
  {
    id: 1,
    name: 'Marcus Lee',
    location: 'Seoul • Tokyo • Singapore',
    trips: 142,
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMHYE36fjA9YSc-Ve-XS60xEkubGcxMls9Rgp-785x_CJnWxDahvMnUvvSyRCFVQp5gQ-kJDkREaiQO6nAEyxWRmj8sPRQM1Wg3dCe-KmZPF3Rqj-WUK2ctGQMHk63xw1cv8zcsOU9sTjQcaR60An_Bvci6ppzVjr3zSWhMXO25bBvE8YuKw1BWMn_ajz6qzYMxHAZ43yQNYlgWeb4TwGIU7ueZ3OifUc9xs9kL1Hvc4zPbV3Wqe84wHLgKwQRqdrw7s5HEPL07Xk',
    alt: 'Portrait of Marcus Lee',
  },
  {
    id: 2,
    name: 'Sarah Tan',
    location: 'Paris • London • Milan',
    trips: 89,
    rating: 5.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvqem_Ebq5zPNh5PS7ySlWU1wtKUJhNbZzrB-vh97DTo4ENM20v5zM2Ufpj9hnNqI81HbqY_9N_PLSBdHnpqfQM9phGJa4W1pnFd1VmE1GTBhGc47GCgGNhw_sY3TA7y0Ma7LepygxCeHNwA_xNsJqoNWMp-3KXlXp1kDCtb_9s9fsyFBpALGF6nSOqBfT30njA3NqmcbkuvzwrcF25zQx3KIMyjTffug0bT2YTiscpfzqEX_QvnsvkTK7eMyfa10eTCjP6OOnkFY',
    alt: 'Portrait of Sarah Tan',
  },
  {
    id: 3,
    name: 'Ahmad Faisal',
    location: 'Dubai • Istanbul • Jakarta',
    trips: 210,
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALCpeWo08qwwyYfOndU03v2mXZC1bZhwlPRIfjuYwIkVjdlwVDlYMdACrTa2W-m_d6FpLeFYcR4JSBmw4YxCS_kRrkUjZvnAwXri4I8VMAebdUJ0iFVioq_IN31Him2v221_4HuV_3Eo9Z9pk5x6jkKXkjXFe3dIrWY-JlNdlQxLW3JgxSocgwZOMXV1RdovaVVLRaPT6o2YT_AHSSOSy9RvjvBTVioMsUCS-rYeBkICdRu_GG3sW8DxpYFj-0veT_H2iZDHVKLz4',
    alt: 'Portrait of Ahmad Faisal',
  },
  {
    id: 4,
    name: 'Yuna Kim',
    location: 'Seoul • New York • LA',
    trips: 56,
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1zDbkNCF4kHRXWqBHf9MGzLJzhJotz0u-ECZsx0x8unuZzIGVIXaXdI9s3-wTL-U-oJmNi5a27XFcdWf-_B_lL1ROV5EmIX5hoYkYoNOP5aGSz95crNyoSV1WUgEIVuUj5QzZYoYPDiVObf6dCUssWRGSzkPZBve62DdhRulJndfpd05AgWmO_NDHw3rJxNw3Du9iNVI4qoO-k_YlLgBYM0lfRGvcKB_PqmeZK-SbwadOgn8XTp2Kki2qkEQaM2D5c35hVfdyTd8',
    alt: 'Portrait of Yuna Kim',
  },
];

export function TopJastipers() {
  return (
    <section className="py-24 px-8 lg:px-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <h3 className="text-3xl font-black tracking-tight mb-12 flex items-center gap-3">
          <span className="w-3 h-8 bg-primary-container rounded-full" />
          Top Verified Jastipers
        </h3>

        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-12 -mx-4 px-4 snap-x snap-mandatory">
          {jastipers.map((jastiper) => (
            <div
              key={jastiper.id}
              className="flex-shrink-0 w-[320px] snap-start glass-card rounded-[32px] overflow-hidden group"
            >
              <div className="h-[360px] relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={jastiper.alt}
                  src={jastiper.image}
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                  <MaterialIcon name="star" className="text-primary text-[14px]" filled />
                  <span className="text-xs font-bold text-white">
                    {jastiper.rating}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h5 className="text-xl font-bold mb-1">{jastiper.name}</h5>
                <p className="text-primary text-xs font-black uppercase tracking-widest mb-4">
                  {jastiper.location}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-surface/40 uppercase font-bold tracking-tighter">
                    {jastiper.trips} Successful Trips
                  </span>
                  <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary-container transition-all">
                    <MaterialIcon
                      name="chat_bubble"
                      className="text-on-surface group-hover:text-on-primary-container"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}