import { useState } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { Header } from '../components/layout/Header';

const tabs = [
  { id: 'posts', label: 'Posts' },
  { id: 'trips', label: 'Trips' },
  { id: 'items', label: 'Items' },
  { id: 'reviews', label: 'Reviews' },
] as const;

type TabId = typeof tabs[number]['id'];

const profileData = {
  name: 'Alex "The Courier" J.',
  location: 'Tokyo → Jakarta',
  specialty: 'Rare sneakers, luxury goods, and tech gadgets',
  rating: 4.9,
  reviewCount: 248,
  completedOrders: 1204,
  responseTime: '< 15 Mins',
  memberSince: 'Feb 2022',
  bio: 'Tokyo → Jakarta. Specialized in rare sneakers, luxury goods, and tech gadgets. 100% success rate on customs clearance.',
  banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3hhbUC6EtMv-IenMCxa9sIB7Ue9spFBf5cFQ-NVR46LELCrwhhhG4A3chcgexUTARTjHEXUob2_KW5Et-OCS5ARPeYINsVfuC8O46tg5Z2jcbqTLkU0g9Qk3uQTRPrpTjE5cmQ1o6yccdqkpP6BN46kaeIQrMSNhcrlaY33H5ZRSkHxzxksOp8uGNQ2AsyabnWGjkasmxy0v6Tz5LLtPvPgJ5GuZ5DcxUrsY7t-IFuJriVL9ujz7jr_IRCpXZ1qSd2ohWOXEr6mI',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0mvmutzYzLWwIBaVt8HxKwr0mO6cecULq4h7Uh99ENz6vw8-L_s9a7_HFgw7j6NtnMWsIuiAvK0zxrYucgehx-smP_PIJ5m8T1hx9Qi0MGrdF7i-piWtab2W9rpi-eYWszlJvd4UnZXXqDK0pcFIBTOby9kVeEVDPAuCQsNmA7MLDxQ2VmgZ7VrqmHrywwXBgjFZ-alToDRFpyy5alnFxIDCoqRIev3hjghZLOTqY40NGCgtJM5Lo2hbuxwhct-so4UN293QI5u8',
};

const trips = [
  {
    id: 1,
    route: 'Tokyo → Jakarta',
    departure: 'Nov 12, 2024',
    status: 'Open',
    availableWeight: 12,
    maxWeight: 30,
  },
  {
    id: 2,
    route: 'Jakarta → Tokyo',
    departure: 'Dec 05, 2024',
    status: 'Scheduled',
    availableWeight: 30,
    maxWeight: 30,
  },
];

const items = [
  {
    id: 1,
    name: 'Nike Air Max Red Edition',
    price: 189.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-9izabn5fQnM2CUNOKubsnykffG1AFQOjrktfOTA9ZBtxzwwnyCNNI31akffl4VBupejBhjEy3nAy3R_bU3l55Y6BsCWRXdT5P-OcqzPDgeKydfoLlng5GP8In3w0wAGMaL5CJ27z70B2YVXmJPoC62Ei7xfqJ_vnysPgr5biaJzJXTxO9xPGbxDb59AU4Puzhw_2ms9htvC0NfVjkw9SOYa4U2c5RqpJ0Pq3mOJv3N4Uf2Dwx4qkx6yXFB8boXbGPIrpOWjgqaM',
  },
  {
    id: 2,
    name: 'Premium Mechanical Watch',
    price: 450.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIZzLua2K-ef67Ve-OeT36MzoIon0Rjsf942VIaI3ivhAEM3fM0arXHnzdSzB5r7eXQRP4son6JEHdmzzut7eFN8ICfipOFCpdm2ChIzD3GggzlePoiLg2aaWS1v2qVw9Rrnq1rqcUgRBqQ6nmhB4vJzKywIByvhzbP307NYvjloUNZW89f5fBFupTULeJdCzRDksJkwc7uFoqNUyVWvNEkVCw1hxtzD1gAqISjl0eaH07FUyVWO2ZqopXWBKIJKSEbrpbhvQp2HE',
  },
];

const posts = [
  {
    id: 1,
    title: 'Exclusive Drop: Tokyo Ginza Limited Sneakers',
    content: "I'm visiting the flagship Nike store in Ginza this Friday. Limited slots for the 'Cherry Blossom' Edition are open now for Pro Members.",
    time: '2 hours ago',
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    title: 'Just landed in Tokyo!',
    content: 'Available for pickup requests until Sunday. Drop me a message if you need anything from Akihabara or Shibuya.',
    time: '1 day ago',
    likes: 89,
    comments: 23,
  },
];

const reviews = [
  {
    id: 1,
    text: "Alex found the exact limited edition Zojirushi thermos I wanted in Osaka. Shipped it perfectly. Best Jastiper!",
    author: '@sandra_k',
    date: '2 weeks ago',
  },
  {
    id: 2,
    text: 'Super fast delivery and excellent packaging. Will definitely order again!',
    author: '@travel_lover',
    date: '1 month ago',
  },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('posts');

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-surface-container border border-white/5 rounded-3xl p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  <span className="text-primary-container text-[10px] font-black uppercase tracking-[0.2em]">
                    Active Now
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
                <p className="text-white/60 mb-4">{post.content}</p>
                <div className="flex items-center gap-6 text-sm text-white/40">
                  <span className="flex items-center gap-2">
                    <MaterialIcon name="favorite" className="text-sm" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-2">
                    <MaterialIcon name="chat_bubble" className="text-sm" />
                    {post.comments}
                  </span>
                  <span className="ml-auto">{post.time}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'trips':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-surface-container border border-white/5 rounded-3xl p-5 hover:border-primary-container/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="bg-surface-container-high w-12 h-12 rounded-2xl flex items-center justify-center text-primary-container">
                      <MaterialIcon
                        name={trip.status === 'Open' ? 'flight_takeoff' : 'flight_land'}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{trip.route}</h4>
                      <p className="text-white/40 text-xs">Departure: {trip.departure}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      trip.status === 'Open'
                        ? 'bg-primary-container/10 text-primary-container border border-primary-container/20'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 py-3 border-t border-white/5">
                  <div className="flex-1">
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
                      Available Weight
                    </p>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container"
                        style={{
                          width: `${(trip.availableWeight / trip.maxWeight) * 100}%`,
                          boxShadow: '0 0 10px rgba(255, 82, 93, 0.4)',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {trip.availableWeight}/{trip.maxWeight} kg
                  </span>
                </div>
                <button
                  className={`w-full mt-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                    trip.status === 'Open'
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'bg-white/5 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {trip.status === 'Open' ? 'Reserve Space' : 'Notify Me'}
                </button>
              </div>
            ))}
          </div>
        );

      case 'items':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-primary-container/30 transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={item.name}
                    src={item.image}
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-white text-sm font-bold truncate">{item.name}</h4>
                  <p className="text-primary-container font-bold text-sm">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-surface-container border border-white/5 rounded-3xl p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-white/10" />
                  <span className="text-xs font-bold text-white">{review.author}</span>
                  <span className="text-white/40 text-xs ml-auto">{review.date}</span>
                </div>
                <p className="text-white/80 italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header variant="loggedIn" />

      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <header className="relative rounded-3xl overflow-hidden bg-surface-container-low border border-white/10 mb-8">
            <div className="h-48 md:h-64 relative">
              <img
                className="w-full h-full object-cover"
                alt="Banner"
                src={profileData.banner}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="px-6 pb-6 -mt-16 relative flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-background shadow-2xl relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Profile"
                    src={profileData.avatar}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary-container p-2 rounded-xl shadow-lg border border-white/20">
                  <MaterialIcon name="verified" className="text-white text-sm" filled />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {profileData.name}
                  </h1>
                  <div className="flex items-center gap-1 bg-surface-container px-3 py-1 rounded-full border border-white/5">
                    <MaterialIcon name="star" className="text-yellow-500 text-sm" filled />
                    <span className="text-sm font-bold text-white">
                      {profileData.rating} ({profileData.reviewCount})
                    </span>
                  </div>
                </div>
                <p className="text-white/60 max-w-xl mb-4">{profileData.bio}</p>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex flex-col">
                    <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">
                      Completed
                    </span>
                    <span className="text-white font-bold text-lg">
                      {profileData.completedOrders.toLocaleString()} Orders
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-6">
                    <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">
                      Response Time
                    </span>
                    <span className="text-white font-bold text-lg">
                      {profileData.responseTime}
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-6">
                    <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">
                      Member Since
                    </span>
                    <span className="text-white font-bold text-lg">
                      {profileData.memberSince}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="bg-primary-container text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,82,93,0.3)] active:scale-95 transition-all">
                  <MaterialIcon name="person_add" />
                  Follow
                </button>
                <button className="flex-1 md:flex-none border border-white/10 hover:bg-white/5 px-4 py-3 rounded-2xl font-bold text-sm transition-all">
                    Request Item
                  </button>
              </div>
            </div>

            <div className="px-6 border-t border-white/5">
              <div className="flex gap-8 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 border-b-2 font-bold text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-primary-container border-primary-container'
                        : 'text-white/40 border-transparent hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <div className="lg:col-span-8 space-y-8">{renderContent()}</div>
          </div>
        </div>
      </main>
    </div>
  );
}