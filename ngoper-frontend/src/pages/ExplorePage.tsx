import { useState } from 'react';
import { Header } from '../components/layout/Header';

const locationChips = [
  { label: 'All Locations', active: true },
  { label: 'Japan 🇯🇵', active: false },
  { label: 'Korea 🇰🇷', active: false },
  { label: 'Thailand 🇹🇭', active: false },
  { label: 'USA 🇺🇸', active: false },
  { label: 'Italy 🇮🇹', active: false },
];

const topJastipers = [
  {
    id: 1,
    name: 'Takumi Kenji',
    specialty: 'Anime, Tech',
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvz20579Rg01OD3DU48KgjDUYWJBl_hvfZi0rZZZjIPhxIYTFZ8-xFS3DTiZt39EtGhAqaiJ4gmdvsUuS1LdZ-3MKqAHcgNtdGqFX0ixipJY3JWUk2t3hljgs4bwDnkIzF2y6W4B92GLC1ETOqEGpWEqq0wkTIDdEKNiBNIdu9yAoPcjFaeZYAbuE9MDboRfaowtXjurAlUixT-KJ0qJ_ZoVoB3eW1x_iFQ4IigjGlPEByw3iPNoBj3Zw8nSSg2mDZr3YOAF8qNPs',
  },
  {
    id: 2,
    name: 'Kim Min-Seo',
    specialty: 'K-Beauty, Fashion',
    rating: 5.0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI7-57HS0WPf_m8KXxRWucbgWIvucczekQNaoU2svm6EhBAbB29Sc3ENizmuQi4YPw0bVpbvFuQiJ2_bHDYLS2XRtTKd8MnsFaCb5laHoehNe_LvUu9mdG45xPGrpYBiW9_f7_SRvW6AW5C2IBufAMH5aRzuNUOusuJTKch0pAS0GPqaoDYkAtbYQDnvZlwn01NvczassR_oLrmN6eW6NU-cVsQMjVeX6aXiOW_yPwPMu_99Y8_U7ymxVKhN9WSV5mruOSKJga9Dg',
  },
  {
    id: 3,
    name: 'Sarawut P.',
    specialty: 'Local Snacks',
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBArG2XDnfvHjfYigN6NEE6dMzS5sypI6WzLZmNRZ6XBokJURoRoaUl6Ijv29kAkm6K89UglN2oQxFRr4B3B6lcMweJPw1b8U5nhLpDMwZ9n61hsocbJzOUvfW7mAInodW-0pBlQz46UFEycmcFvEcbbfM4NYSjIKABrK2AVUDniDhNIjKrTbYOSzQyMF6p1BPS0f9v_QuuPJxqW9zLwzA9opIqGmoTS4KhcFO-fIM8Wj0fiLZwuvWda88ro2svSuOTjGTeGffroDQ',
  },
  {
    id: 4,
    name: 'Yuki Tanaka',
    specialty: 'Electronics',
    rating: 4.7,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC71bDD9wuHN5zE3dRU0TTNtWQ4rwmjQl6VupocQ-byqefP2v3Qlfc5qjdB0WkU_N-Ee_aGlkzuUvzg6BXnHjFtYW2ae_PSVRJ204s5XU1kYyvWK_NdqAo6gQgcm-b3HaxoexpMKPXGL7_pIsI4w9eNJpwU0a1TVVx0CEgWcvfbl98grNatdfW6BElaN1NedJVg9DVnSJA81IUsw1hV8CiNbl6S7VKPaYiqwvyrBjjO8ZZqaGOMIGYNS3MLVsLkSZIbpNFY0wQDUCY',
  },
];

const popularItems = [
  {
    title: 'Beauty Hauls',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg79_O83tgpWRxcsjM1IZriVnpX1JhvyVpMpnTYe_Q5HT5o4SObSsKkikLBopXriT5BzAl7DJOIc2SuBCswKzwxULYrn-N3ZjOftxBzf3Bmpubmw29xDkAR5YtUgHPytyCGY9PIJDuJL1GX79qwnb1y8Ie5kyBVlEl0j40JjYEsLdiPDm3kgEQfBgRgnOuBH4P2vVhncH-u7vjIsPJ6o6aYmh3OMt-XrqibkjR25gfvKgIq9Xq2ntV5fsBmEsqVrtzZZWE23-bVak',
  },
  {
    title: 'Rare Snacks',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5D_pDRbrdWr8MYVSqShpHr5OU-xISxEcvyFL9pbf2P7F75HKG-0SN_3xznM5cDKOqXi28rxOuqXJC9pjKFr1ItUG-ebDOeXtcMvzMnBsAs1J52g3L1v0gMaGiB5LJjzZkBQzNIgUBuuLdQszcRuYXpxxzCmISKlBVTsYdA74wsZbe8wFLGXoBUHCMMDQ8nsigA1e-hb6_AncKaoeYp42R_k_VhgnMt4zZgNZ1jq2zM5LAHhlQ2AxGHUIRjwWqOwepzW2iVoiifbE',
  },
  {
    title: 'Luxury Fashion',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc1CFQhxRkZ6JGKGVXe_BeWubEDbfWVBQ49mYua97GwXhCOxbIZLLWhsR-svfshn10rG01xyeJcYywgXL8TYJacKlUFtR5vZNzZkrlCcJ4euOiEN_HtiXVFgeo-_jCbCE3IVb4L02a-fqpNKxyQf8Ry5692GsaQyvXDBl6oC5gl1mA-6O2MS0F15_d9DkH4jFqCSKGdoBbto0ZxZGHHRpe6M7eZcIkrbj1iyj4OVKp0Cw-_MiVlfAfdNAdnxei-1eKhh0QP9cdG-I',
  },
  {
    title: 'Tech Gadgets',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAe0oSDbXYAqX3gfspPU-sT7c3enIpOkTPax80zcE6CC8d7OIfk9p7QjzJYMnz-_3xHffxVGr3x7hYHBO6ahvVl03ysiyibPmEcb6PpENHCgQMR9WECNiV8XFH6UlCAFTbXBQKc74APlrqYnCXW-VkiCjInoT5Pcy0EeJ3HNSNP2_pxCJu59klHvebdO-4NLJoUVwl3mc5X6dhP4GBSOIhvwcJroqg8si4_xMLU7wVEvTowoEmg4qKwOiKb9voGyLFnsAbEeIMQu3o',
  },
  {
    title: 'Anime Merch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt3fx0PVaY_8kfeKhYjpCMLeqt1aroQOVO1FmLnlNyV5Oq2lDI9_ZkLZK5_AP13-0U1chFHPwDV-D1uWLjBrstrwWl_vnImKzwfaAQUUk2GTHqPPdS5rZGWkoqqL4ZjFQcYiYnXd83jng8-IVeeWhuiR5Z4fhjSQUESY1ZSUmebNoNOEl9bzOXwCgei-VEii8FBuGDOK8klTiPpiCwjnbKq5jN8JZu1pCoZuN2cNd7XxqyFvAkbzDLMMhGspD6KIJwRzHrjl-dl7A',
  },
  {
    title: 'K-Pop Merch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIKrDIZ4Ph-7aeSQCJ1ItseZZeeK2RFvfmIhT2w4cqFoe-4UobZZgtYwe9dZQZeN4Idl2iQ-Yk2v3Ge0llxzFFy7oPCp3kXakqhwWUntL-RdliI1DDk7Wqfhf7ySHluRt_vtx9cfRQZG-c0VImXC71op8oC9Ptmei72PJFaqRNGRsqFVxwJ2HO94wZ503bpKLY3T4sIFvzPhSXWiOjxB68n-qrOwLuhec1EsKtHNhR5UnafkpKlSJ-SIxaUQ0-cc6Verf79zoOurQ',
  },
];

const popularStores = [
  {
    id: 1,
    name: 'Elite Shop Paris',
    description: 'High-end bags and accessories from Paris',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLU9pD0TZjw8iX9xF-yonHP3Pr7X1rY7u5PjwMSwO4L9YUwokNwlyKIQPzj6RoX5YxbSeWbNnRlF_WHzE3dDChlVGGjqhtUNY1d6m4iWAMnIEHB2tuQfvCLJOKNmk8HFvwvFeCZm8aPFOeI5ljN7A1hizRs4Wgmv7z3Gaa24_m9mVupx4AD2fBHlcpfLZzHFxIGKwGjWoG4XxcmzGcpVB77ZY6s6bfQNafsGBxHP5ESoZoDa1BgYQxHdnmetUmlRewe7asnrwaR_4',
  },
  {
    id: 2,
    name: 'London Luxury',
    description: 'Custom orders from Harrods & Bond Street',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl7UKX52xNgBD9-1IIM4w-d1FwPCa7JDQUpKRiQSjEiwGv4-T7JCKM935QHjunPlXbkO3uP-0xCJknymZ_gnRX_00xLFXJrN772-m3nCiFH4NPx-DF6GOPQaW2lBfxaSpROmUC9oCCQCnJqXL-QABIzEHA2q7cJ0-pi4P0CQwuHGbQpUOA1fXBlDaTMAjWsEtq3Zz0Lk0xSX7wL_MyeXlv1a_7_7sp2T-9Z9PC2vQKR9L_UhcJ2mvAySWDwUSGFH9dsgt4dmsUej8',
  },
  {
    id: 3,
    name: 'Tokyo Tech',
    description: 'Latest gadgets from Akihabara',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMXPxnjTRbIIjQvgICiWV8P_6oQs-y8xUqQjzp7w5mx-O6QmEFmoM6H93D97l1IxcBTdPuKQgKV-O49RALrkBpyMieVsjgTjeC9JP42PpeQD2EuXhmOUNBCL4_cRkw4sdlXxJtDiTexVaNUCBnDUgxmxrl_ox9QlI4Cip50H09v1VSIPP8XfxMk7P6pQYBDxpo32D_WmwPaVEXJEjLy9HfXwPIX5dLATj4xYzBIZcen9QDmN2TlcYcerA9pbSzqH-t3kXKKekOj08',
  },
];

const recentlyPopular = [
  {
    id: 1,
    name: 'Sonia Kim',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIKrDIZ4Ph-7aeSQCJ1ItseZZeeK2RFvfmIhT2w4cqFoe-4UobZZgtYwe9dZQZeN4Idl2iQ-Yk2v3Ge0llxzFFy7oPCp3kXakqhwWUntL-RdliI1DDk7Wqfhf7ySHluRt_vtx9cfRQZG-c0VImXC71op8oC9Ptmei72PJFaqRNGRsqFVxwJ2HO94wZ503bpKLY3T4sIFvzPhSXWiOjxB68n-qrOwLuhec1EsKtHNhR5UnafkpKlSJ-SIxaUQ0-cc6Verf79zoOurQ',
    isTop: true,
  },
  {
    id: 2,
    name: 'Marco Rossi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMXPxnjTRbIIjQvgICiWV8P_6oQs-y8xUqQjzp7w5mx-O6QmEFmoM6H93D97l1IxcBTdPuKQgKV-O49RALrkBpyMieVsjgTjeC9JP42PpeQD2EuXhmOUNBCL4_cRkw4sdlXxJtDiTexVaNUCBnDUgxmxrl_ox9QlI4Cip50H09v1VSIPP8XfxMk7P6pQYBDxpo32D_WmwPaVEXJEjLy9HfXwPIX5dLATj4xYzBIZcen9QDmN2TlcYcerA9pbSzqH-t3kXKKekOj08',
    isTop: false,
  },
  {
    id: 3,
    name: 'Yuki Sato',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbgaPdjW_gK_KXP9joryejSIufqbNTXKhh-JNyWlnIDxKmzrYLMQxdjuzEuMT7iSE5VdutQpq0NuK5-Vf9Zu0CxXAp7BRMJkUgSrm_L3BWDWI2DwLjiWFEDYjNuzuQBDuUX4s7a2EcPaQ_hJvBeLKnOvDW0AiFO__UVSvqhnl5Opn2n1r3amLXpaI-owBGxhjko6-ODGHIdEKDta5xPP-hVE2oPwAco8qfB9C78Z6I28WGO1cTbXGRZe1vjhsPHRL1OKC67v-sotc',
    isTop: false,
  },
  {
    id: 4,
    name: 'Linda Wu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC71bDD9wuHN5zE3dRU0TTNtWQ4rwmjQl6VupocQ-byqefP2v3Qlfc5qjdB0WkU_N-Ee_aGlkzuUvzg6BXnHjFtYW2ae_PSVRJ204s5XU1kYyvWK_NdqAo6gQgcm-b3HaxoexpMKPXGL7_pIsI4w9eNJpwU0a1TVVx0CEgWcvfbl98grNatdfW6BElaN1NedJVg9DVnSJA81IUsw1hV8CiNbl6S7VKPaYiqwvyrBjjO8ZZqaGOMIGYNS3MLVsLkSZIbpNFY0wQDUCY',
    isTop: false,
  },
];

export function ExplorePage() {
  const [activeLocation, setActiveLocation] = useState('All Locations');

  return (
    <div className="min-h-screen bg-background">
      <Header variant="loggedIn" />

      <main className="pt-20 max-w-[1600px] mx-auto">
        <section className="px-4 lg:px-8 py-8 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-white/40">search</span>
              </div>
              <input
                className="w-full bg-surface-variant border-none text-white rounded-full py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary-container placeholder-white/30 transition-all outline-none text-lg"
                placeholder="Search jastipers, items, or countries"
                type="text"
              />
            </div>
          </div>
        </section>

        <section className="py-4 px-4 lg:px-8">
          <div className="flex overflow-x-auto no-scrollbar space-x-3 max-w-3xl mx-auto">
            {locationChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => setActiveLocation(chip.label)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeLocation === chip.label
                    ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20'
                    : 'bg-surface border border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 px-4 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold">Top Jastipers</h2>
            <span className="text-primary text-sm font-semibold cursor-pointer hover:underline">
              View all
            </span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar pb-6 gap-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {topJastipers.map((jastiper) => (
              <div
                key={jastiper.id}
                className="flex-shrink-0 w-44 lg:w-auto bg-surface rounded-2xl p-4 border border-white/5 hover:border-primary-container/30 transition-colors cursor-pointer group"
              >
                <div className="relative mb-3">
                  <img
                    alt={`Jastiper ${jastiper.name}`}
                    className="w-full aspect-square object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    src={jastiper.image}
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                    <span className="text-[10px] font-bold text-white">
                      {jastiper.rating}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-sm truncate">{jastiper.name}</h3>
                <p className="text-xs text-white/40 mt-1 truncate">
                  {jastiper.specialty}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Popular Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularItems.map((item, index) => (
              <div
                key={index}
                className="relative h-28 lg:h-32 rounded-xl overflow-hidden group cursor-pointer"
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                  alt={item.title}
                  src={item.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="font-bold text-sm">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 px-4 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold">Popular this week</h2>
            <span className="text-primary text-sm font-semibold cursor-pointer hover:underline">
              View all
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularStores.map((store) => (
              <div
                key={store.id}
                className="flex items-center space-x-4 bg-surface/50 p-4 rounded-xl border border-white/5 hover:border-primary-container/30 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    alt={store.name}
                    className="w-full h-full object-cover"
                    src={store.image}
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-sm truncate">{store.name}</h4>
                  <p className="text-xs text-white/40 mt-1 truncate">
                    {store.description}
                  </p>
                </div>
                <button className="bg-primary-container/10 text-primary-container text-xs font-bold py-2 px-4 rounded-full border border-primary-container/20 hover:bg-primary-container hover:text-white transition-all whitespace-nowrap">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 px-4 lg:px-8 pb-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold">Recently Popular</h2>
            <span className="text-primary text-sm font-semibold cursor-pointer hover:underline">
              View all
            </span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar pb-6 gap-4 lg:grid lg:grid-cols-6 lg:overflow-visible">
            {recentlyPopular.map((person) => (
              <div
                key={person.id}
                className="flex-shrink-0 w-32 lg:w-auto flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-24 h-24 lg:w-28 lg:h-28 rounded-full border-2 p-1 mb-3 transition-all group-hover:scale-105 ${
                    person.isTop ? 'border-primary-container' : 'border-white/20'
                  }`}
                >
                  <img
                    className="w-full h-full rounded-full object-cover"
                    alt={person.name}
                    src={person.image}
                  />
                </div>
                <span className="text-sm font-semibold text-center truncate w-full group-hover:text-primary transition-colors">
                  {person.name}
                </span>
                {person.isTop && (
                  <span className="text-[10px] text-primary-container font-bold mt-1">
                    TOP JASTIPER
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}