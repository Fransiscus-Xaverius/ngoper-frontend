import { Header } from '../components/layout';
import { MaterialIcon } from '../components/ui/MaterialIcon';

const categories = [
  { label: 'Cosmetics', active: true },
  { label: 'Anime', active: false },
  { label: 'Snacks', active: false },
  { label: 'Luxury Gear', active: false },
];

const trendingItems = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPtpCrkr382jIpsT3qJwcRC0pcVFKe5GmvpGMOy5tfLhgEHRNwE16FbXdCnt3XC-5piMYR_wlMpKvJedIbM_x6Is3YeAIiNvG0VuBGgHwkApd-ZoLm-UpmKv_uHRtX5_PvgS8Z7BZGdw1Ez447yi4JD_uZu4judte0RPhfgPbDHic2ZeIxJLEAT1S3r8SEWIqPPlknvCxUTBjtvtN9NCN6LdjEXGESmMWGLyH5vQkb7SIHBp9gLNhYnQLXPDRKc2qxlE9e6OOqtks',
    title: 'SK-II Essence',
    desc: '230ml Facial Treatment',
    price: '$165.00',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQCDOAwSGQbxLwiOkTHwYFalecah2bK5VcPvv1WvfRB0yvFQ8ieXYAN2Zubv280dzOjh-PegXWcFLyRpUoCmOXdEaH8hslGpHhxqcnxd7gjqxGsP4dGzUoLVzOHN5eklnHTsSD2TebYTO_Y0SRzDmNztbJ3XUxUqaEI7_gpixru7hCSE-0RG680QB829KLhNnUHTP_e7_EpAcoN8KGtA8---ANVQGPpzvgrP6UL9QSMIk6DRuLJbXcVBTFqQBeqDiREJsLw9B4tP0',
    title: 'Tokyo Banana',
    desc: 'Original 8-pc Box',
    price: '$22.00',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvPaQ62YbIwh186Vy9TdR6sJPdpk1m9dz-tLlgW1sixdJ2bySGV08x-uj5pmLMYnyB_4xcgLdrwB_-iD0PjI3eOuuwbwwUt3EyJW_-H9krcmlobe-cgsxPWeJ65QItnmGJOQ4-gzB22fiE-Hzc2ZG5sl6hVFm0vZHrV_483FQQOA7_alxNIcfrBE5vw6IsLBSGXs-TzrTAu2gre1PIFWx2LDW4COWjk5uPYmwwGlMnLfJ5ix63PK6x_BVsjGLp_f8dQoaKkdgWk1c',
    title: 'Ichiran Ramen',
    desc: 'Instant Kit 5-servings',
    price: '$35.00',
  },
];

const timelineSteps = [
  {
    title: 'Departure from Tokyo',
    subtitle: 'March 15, 2024 \u2022 Narita International',
    badge: 'Completed',
    badgeClass: 'bg-zinc-800 text-zinc-300',
    dotClass: 'border-[#FF4D5A]',
    active: false,
  },
  {
    title: 'Ginza Luxury Haul',
    subtitle: 'March 17, 2024 \u2022 Chuo City, Tokyo',
    badge: 'Active Drop',
    badgeClass: 'bg-[#FF4D5A]/10 text-[#FF4D5A] border border-[#FF4D5A]/20',
    dotClass: 'border-[#FF4D5A]',
    active: true,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLe6OjDxnLPvMK43Wpn6UTDiYz6fjJwjRjfewO33NLckEmREzOIAUozDciJFhMvHncYw8XEzn9foS5jqJIeArLOqaSqWRjBWopUG1wRMC-mYhMUdDsFXz6mkFTeW7AjiMkFOnb4JAU5xjhHXNOUR7aGD_RQP49GgG_fqjQrn6184lKG0RI5vWS52d1-LqcVA12e3E2yBmq-JMZKVWEfI6hHdJPdPwwF3eBmnGL9tTqVjaBz9SlPvf2aeGQu1aQr8XyY7zJ2x688no',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXeSjhwjsQICHoFxTgp9dR0ZY-bXZPjXJO2PuG03XDRk8fCc9oSgKdEttNN-FbFDDoRzpNHKDYpYlkL1eLFEKh87QrCcMkzLBd04QJsQjpETul3FFnkFkGlrtiv7SoRUGlyrIBLA8hFy5FMnhcFAZmr_ettE1PBgEud-lZ8ccd32HDPIJineFai5_jQUutIiw4BeMkaaE-c07o3FU5qjqee985AF08ZF4pIN5Q4hxr7dXWggQerCUod3kQgltXhF960fxpHco95cc',
    ],
  },
  {
    title: 'Shinjuku Tech Finds',
    subtitle: 'March 20, 2024 \u2022 Upcoming Stop',
    badge: 'Scheduled',
    badgeClass: 'bg-zinc-900 text-zinc-600',
    dotClass: 'border-zinc-800',
    active: false,
  },
  {
    title: 'Arrival in Kyoto',
    subtitle: 'March 25, 2024 \u2022 Final Destination',
    dotClass: 'border-zinc-800',
    active: false,
  },
];

export function TripPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header variant="loggedIn" />
      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[400px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              alt="Japan Spring Scene"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgkMKF3YnzNEBN7f6haUXLCnMAiKa20zj5yZsTFYLYKP_aFNJLpK-Odk0uyBsN7ilutdvt1mmJDhMmfFyNlQerAk_qt826_cewmjeV-12CIgaEbctQn49yXbBfauSl72HtIG8bWc8LnfUB_yjkuTB0BM6qxgTVFGRvvLJ6nUiJSPG9XcisaEZfdtDwLIvSCZcpJfyju9u6qTQ9Qt3Aiafs03rIoW0jX6cdpa5ppqyyBlDXdpbIIXAVGUrlDEveCxl1bSv1X_4eIs0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="absolute bottom-12 left-4 md:left-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-container text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                LIVE TRIP
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
                Japan Spring Expedition
              </span>
            </div>
            <h2 className="md:text-5xl text-3xl font-extrabold tracking-tight text-white mb-2">
              Tokyo to Kyoto Discovery
            </h2>
            <p className="text-zinc-300 text-lg max-w-xl">
              Hunting the best skincare, snacks, and exclusive anime merch across
              the Kansai region.
            </p>
          </div>
        </section>

        {/* Trip Info Bar */}
        <div className="px-4 md:px-12 -mt-8 relative z-10">
          <div className="glass-card rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl border border-white/5">
                  <MaterialIcon name="route" className="text-primary-container" />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Current Route
                  </p>
                  <p className="text-white font-bold flex items-center gap-2">
                    TYO
                    <MaterialIcon name="arrow_forward" className="text-xs text-zinc-600" />
                    OSA
                    <MaterialIcon name="arrow_forward" className="text-xs text-zinc-600" />
                    KYO
                  </p>
                </div>
              </div>
              <div className="hidden md:block h-10 w-px bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-900 rounded-xl border border-white/5">
                  <MaterialIcon name="weight" className="text-primary-container" />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Available Space
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-bold">14.8 kg left</p>
                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-container h-full w-[65%]"
                        style={{ boxShadow: '0 0 10px rgba(255, 82, 93, 0.5)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                type="button"
                className="flex-1 md:flex-none bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all border border-white/5 cursor-pointer"
              >
                Request Custom Item
              </button>
              <button
                type="button"
                className="flex-1 md:flex-none bg-primary-container text-white px-8 py-2.5 rounded-xl font-bold hover:scale-105 transition-all cursor-pointer"
              >
                Join This Trip
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-12 py-12">
          {/* Trip Journey Timeline */}
          <div className="lg:col-span-8">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <MaterialIcon name="timeline" className="text-primary-container" />
              Trip Journey
            </h3>
            <div className="relative pl-8 border-l-2 border-zinc-800 space-y-12 pb-8">
              {timelineSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-[41px] top-0 w-5 h-5 bg-zinc-950 border-4 ${step.dotClass} rounded-full z-10`}
                  />
                  {step.active && step.images ? (
                    <div className="glass-card rounded-2xl p-6 border-l-4 border-l-primary-container">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div>
                          <h4 className="text-lg font-bold text-white">{step.title}</h4>
                          <p className="text-zinc-500 text-sm">{step.subtitle}</p>
                        </div>
                        {step.badge && (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${step.badgeClass}`}>
                            {step.badge}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {step.images.map((img, j) => (
                          <img
                            key={j}
                            alt={`Trip item ${j + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                            src={img}
                          />
                        ))}
                        <div className="bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500 font-bold text-sm">
                          +12 Items
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h4 className={`text-lg font-bold ${step.active ? 'text-white' : 'text-zinc-400'}`}>
                            {step.title}
                          </h4>
                          <p className={`text-sm ${step.active ? 'text-zinc-500' : 'text-zinc-600'}`}>
                            {step.subtitle}
                          </p>
                        </div>
                        {step.badge && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${step.badgeClass}`}>
                            {step.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Verified Traveler Card */}
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 blur-3xl" />
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    alt="Creator Profile"
                    className="h-14 w-14 rounded-full border-2 border-primary-container p-0.5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH6e7EHHTCZqzd1EPhKsd7QzDtFfT21mMBuQzaar0iyxYcX_57Pajv7DqhAvFeKcfMQdkDcy1HqotCBw8rCWdVi0ahbcVzZKxb4ujxtczXUGpUDtwHcxT9TD1U-ejOGgIdco9mFquZAUqr6MWXOrW5ba7tgP01sLDf6KFkab9ZXnpI_GVhT-IpE8xHKnVYYCHyNAB_7cit4rclHaQj-A8uU2qUU7fqyDwX06IUv9LftwlaaaIi4xx8oMHNSHVFOB8Wew02H5Xwwec"
                  />
                  <MaterialIcon
                    name="verified"
                    filled
                    className="text-xs bg-primary-container text-white p-1 rounded-full border-2 border-zinc-900 absolute -bottom-1 -right-1"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold">Kenji Nakamura</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-container text-sm font-bold">4.9</span>
                    <div className="flex text-primary-container scale-75 origin-left">
                      <MaterialIcon name="star" filled />
                      <MaterialIcon name="star" filled />
                      <MaterialIcon name="star" filled />
                      <MaterialIcon name="star" filled />
                      <MaterialIcon name="star_half" filled />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                    Success Trips
                  </p>
                  <p className="text-white text-xl font-extrabold">24</p>
                </div>
                <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                    Verification
                  </p>
                  <p className="text-primary-container text-xs font-bold mt-2">Level 4 Elite</p>
                </div>
              </div>
            </div>

            {/* Buying For You Categories */}
            <div>
              <h5 className="text-white font-bold mb-4 px-1">Buying For You</h5>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-105 ${
                      cat.active
                        ? 'bg-primary-container text-white'
                        : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:border-primary-container/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Items */}
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <h5 className="text-white font-bold">Trending Items</h5>
                <button
                  type="button"
                  className="text-primary-container text-xs font-bold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {trendingItems.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className="flex gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/10 w-full text-left"
                  >
                    <img
                      alt={item.title}
                      className="h-20 w-20 rounded-xl object-cover shrink-0"
                      src={item.image}
                    />
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-white font-bold group-hover:text-primary-container transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-zinc-500 text-xs mb-2 truncate">{item.desc}</p>
                      <p className="text-primary-container font-black">{item.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TripPage;
