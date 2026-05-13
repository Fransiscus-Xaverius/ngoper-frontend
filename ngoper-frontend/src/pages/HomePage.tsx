import { useState, useRef } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { Header } from '../components/layout/Header';

interface FeedPost {
  id: string;
  type: 'trip' | 'product' | 'member_only';
  creator: {
    name: string;
    avatar: string;
    location: string;
  };
  timestamp: string;
  content: string;
  title?: string;
  images?: string[];
  likes: number;
  comments: number;
  isLive?: boolean;
  price?: string;
  isLocked?: boolean;
}

const mockPosts: FeedPost[] = [
  {
    id: '1',
    type: 'trip',
    creator: {
      name: 'Sarah Wanderer',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj0rOv2cqKTBwIDiN21TxCf7ZdpLud9jLoDA92cyTS9icAxUHIB_P9RfTjq9gdvqVk_mogtfoI9gnTqyYoSkFo-yvMaziOpWbfovgtFKnI7cMrfAk7G-gU4L2cYSfk3oadXBMHbcgW9fJh-Lim618qHLacewHZztPZ-KphTlzfjo_y9TkkNuJtggFjSPJCf7BaPEPFVu2pSA__QNr8zhI_Xu5oZwdL51EGgHWtPhTZklJ0rPggBrulHcR8YNHEFkew7xtdgEiQPXg',
      location: 'Tokyo',
    },
    timestamp: '2h ago',
    content: "Just landed in Shinjuku! Accepting requests for limited edition anime merch and local stationery for the next 24 hours. 🇯🇵",
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAhuSVngv0_xrV0x7tp3RFO1pP6w946Dfz6aBdpjU9vVYuKx1GaVGAIz4ssEZxWsdBw3QVhElUJGgAVqiW-toytilq0UgB8iREXnKGL8g4o3A5HW39KLPa-zGsas5QpWTByC97zWMzA_LvPsaycwHu9T4Q3hTHAYboUEke6U0N6rdDcwzxl0C6_OCZV3CO2r8EW9jTiHfG6iWllREtQ1RpT9zlNqUOonIsyFgeFDD5AKoPT3Zz4ZZhnkVE2ouibwAjiN4fFXoJ2yVQ'],
    likes: 1200,
    comments: 48,
    isLive: true,
  },
  {
    id: '2',
    type: 'member_only',
    creator: {
      name: 'Curated By Marco',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyiNdTRDhnDut8GwDajZnH2Rc_iIECbEUYsVpENRlWDigrpDsMT-2YMoete55bpVJx1iEiso4myv86bCAEMKN9Q0swDRe9xEhwSr4363kdOtwiBmeA5Zlbrh9TbO0uv4bHU-mScYBm48QGxOG3ITrdYeHbXlbIl6vcb6JYHPfJQQuMRZyHi2R3uQemqV77jKX7cOWW3JFzWiwh9ZAGF4cVBNyvRrd1poonxhUgYRIEivuEqZ73hmtOv8Y24V-Fnnv4vzDWSIQcmo4',
      location: 'Paris',
    },
    timestamp: '5h ago',
    content: 'I found a stash of original 90s designer accessories at a private estate sale...',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBLyMOyDFEOspNgkzDYVVYmojPLLV2MM_1sw7ZdfNt-2Xv5DnJY3-y3tIEE_g0NIzuoP-OKZUQMWaoox2LxQ6e5A_CGhiM06nqEFbqOrqIL9GVhc0TaMCIFOEdbGIr19fvk0DK9fbtq7KuLeW4I9rOpcc0WqdOaNc5mzKss4RT7leyVm_3k8K0ScrG7pXXFt2kg2IFvURPtn9yYjvFbuJg3X1evwuykhdUV4TGYzimTwVQGIgV4wNvQWVspReOQZtG5S6i_mzMPCiQ'],
    likes: 89,
    comments: 12,
    isLocked: true,
    title: 'Rare Vintage Find in Le Marais',
  },
  {
    id: '3',
    type: 'product',
    creator: {
      name: 'K-Beauty Scout',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmi0-wRlNKt7AjtgLYSpJF_h-HHO_UUNM4vpT8AMTncYzWxcvDHiB8h-ogwRVgMVjN0YnJpandPpCm49kHrHaQsOMlFHs5N8QPsw7ZeEKKEvA1Ji78jmsLJ52uPWEsRqQKw8FRAZYU_w4wIePLESfOp1hZHsnCGzP6J6cR0NMpfj5IN-gwE8_FJuoOk6AdzZ83Vz5CKYHp-ENm2Cz1yAQBYHi22BcRRYtxUa_siBMdSsgEzl-VQc9cJ5qZonWL-kRmRKbnhx4Y9Cw',
      location: 'Seoul',
    },
    timestamp: '8h ago',
    content: "Limited stock Alert! The new Glow-Serum that's viral in Myeongdong is finally restocked. I can grab 10 more bottles before I head back.",
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWlXHgFtNhenomJqVOQWpy-HYCoXU6YdhmovhAxFbz0lSkF7ApA2EQVUKsQ6uWf-REiAbS7fKMzfU1C84sCHEiJd6_9k1PTzD_mPFv21q6pfEIiJsKUZxpXv4gbDYYKc1U3kInFsnFcriSBQXYMVM4RLrPGVeJz0UfYkaPedGES9N2E5PTNGUUy3dVr6FS8hkdUwYAct87XldbsaoWjGflbrvEoc4EFRW6-8gHg3BRsTpauOIC_rRG64JlVUpf4ThyPjgOzoIXR2c',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvk5oIf92MxvQNzz1-e0xASyAcLmiEeHeSlH10bUxtIH7kZ4mw-68HiS-7g7ciRDE4G4_6_1Uhm_nqNUcpdCEenB7pNlF5hhbOBBVC_dJU2OY4ZVRl1CIlWosqAhxCK3mRQe59YeOODpFI_GCeHWwy8nJhHPPHoaJyvlrFCWtP2CXLoTj5CdGxyx7XVuVi78YWV3h9m2rJ2DtEkFYeR2qUkfnQ2Y30Fn5_pza2BrsZ3gJ0GA9gNDC26ask1rV8RHxtsKsFfNbT4OI',
    ],
    likes: 256,
    comments: 34,
    price: '$24.00',
  },
  {
    id: '4',
    type: 'trip',
    creator: {
      name: 'Travel Mike',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt3fx0PVaY_8kfeKhYjpCMLeqt1aroQOVO1FmLnlNyV5Oq2lDI9_ZkLZK5_AP13-0U1chFHPwDV-D1uWLjBrstrwWl_vnImKzwfaAQUUk2GTHqPPdS5rZGWkoqqL4ZjFQcYiYnXd83jng8-IVeeWhuiR5Z4fhjSQUESY1ZSUmebNoNOEl9bzOXwCgei-VEii8FBuGDOK8klTiPpiCwjnbKq5jN8JZu1pCoZuN2cNd7XxqyFvAkbzDLMMhGspD6KIJwRzHrjl-dl7A',
      location: 'Bangkok',
    },
    timestamp: '12h ago',
    content: "Exploring Chatuchak Market today! Found some amazing vintage finds. Who wants me to grab anything?",
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAg79_O83tgpWRxcsjM1IZriVnpX1JhvyVpMpnTYe_Q5HT5o4SObSsKkikLBopXriT5BzAl7DJOIc2SuBCswKzwxULYrn-N3ZjOftxBzf3Bmpubmw29xDkAR5YtUgHPytyCGY9PIJDuJL1GX79qwnb1y8Ie5kyBVlEl0j40JjYEsLdiPDm3kgEQfBgRgnOuBH4P2vVhncH-u7vjIsPJ6o6aYmh3OMt-XrqibkjR25gfvKgIq9Xq2ntV5fsBmEsqVrtzZZWE23-bVak',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBArG2XDnfvHjfYigN6NEE6dMzS5sypI6WzLZmNRZ6XBokJURoRoaUl6Ijv29kAkm6K89UglN2oQxFRr4B3B6lcMweJPw1b8U5nhLpDMwZ9n61hsocbJzOUvfW7mAInodW-0pBlQz46UFEycmcFvEcbbfM4NYSjIKABrK2AVUDniDhNIjKrTbYOSzQyMF6p1BPS0f9v_QuuPJxqW9zLwzA9opIqGmoTS4KhcFO-fIM8Wj0fiLZwuvWda88ro2svSuOTjGTeGffroDQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAI7-57HS0WPf_m8KXxRWucbgWIvucczekQNaoU2svm6EhBAbB29Sc3ENizmuQi4YPw0bVpbvFuQiJ2_bHDYLS2XRtTKd8MnsFaCb5laHoehNe_LvUu9mdG45xPGrpYBiW9_f7_SRvW6AW5C2IBufAMH5aRzuNUOusuJTKch0pAS0GPqaoDYkAtbYQDnvZlwn01NvczassR_oLrmN6eW6NU-cVsQMjVeX6aXiOW_yPwPMu_99Y8_U7ymxVKhN9WSV5mruOSKJga9Dg',
    ],
    likes: 89,
    comments: 23,
  },
];

const filterChips = ['All Updates', 'Trips', 'Product Finds', 'Exclusive'];

const currentUser = {
  name: 'John Doe',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt3fx0PVaY_8kfeKhYjpCMLeqt1aroQOVO1FmLnlNyV5Oq2lDI9_ZkLZK5_AP13-0U1chFHPwDV-D1uWLjBrstrwWl_vnImKzwfaAQUUk2GTHqPPdS5rZGWkoqqL4ZjFQcYiYnXd83jng8-IVeeWhuiR5Z4fhjSQUESY1ZSUmebNoNOEl9bzOXwCgei-VEii8FBuGDOK8klTiPpiCwjnbKq5jN8JZu1pCoZuN2cNd7XxqyFvAkbzDLMMhGspD6KIJwRzHrjl-dl7A',
};

export function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All Updates');
  const [posts, setPosts] = useState<FeedPost[]>(mockPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = () => {
    if (postContent.trim() || uploadedImages.length > 0) {
      const newPost: FeedPost = {
        id: Date.now().toString(),
        type: 'trip',
        creator: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          location: 'New Post',
        },
        timestamp: 'Just now',
        content: postContent,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        likes: 0,
        comments: 0,
      };
      setPosts([newPost, ...posts]);
      setPostContent('');
      setUploadedImages([]);
      setIsModalOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages((prev) => [...prev, event.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />

      <div className="pt-16 h-screen overflow-hidden">
        {/* Main Center Feed */}
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Action Card */}
            <section 
              className="glass-card rounded-xl p-6 border border-red-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
              style={{ boxShadow: '0 0 20px rgba(255,77,90,0.2)' }}
              onClick={() => setIsModalOpen(true)}
            >
              <h1 className="text-xl font-bold mb-4 text-on-surface">What do you want to request?</h1>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="bg-primary-container text-on-primary-container font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 duration-200 transition-all shadow-lg"
                  style={{ boxShadow: '0 4px 15px rgba(255,82,93,0.3)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  <MaterialIcon name="add_circle" className="text-2xl" />
                  Create a new post
                </button>
                <button className="bg-surface-container-highest text-on-surface font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/10 active:scale-95 duration-200 transition-all">
                  <MaterialIcon name="explore" className="text-2xl" />
                  Browse Open Trips
                </button>
              </div>
            </section>

            {/* Feed Filtering Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {filterChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setActiveFilter(chip)}
                  className={`px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                    activeFilter === chip
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-on-surface-variant border border-white/5'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Feed Posts */}
            {posts.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* Floating Action Button */}
        <button 
          className="fixed bottom-10 right-10 w-14 h-14 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
          style={{ boxShadow: '0 8px 30px rgba(255,77,90,0.6)' }}
          onClick={() => setIsModalOpen(true)}
        >
          <MaterialIcon name="add" className="text-3xl group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface-container-high rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
              <button 
                onClick={handleCreatePost}
                disabled={!postContent.trim() && uploadedImages.length === 0}
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                  postContent.trim() || uploadedImages.length > 0
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <div className="flex gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img alt={currentUser.name} className="w-full h-full object-cover" src={currentUser.avatar} />
                </div>
                
                {/* Text Area */}
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value.slice(0, 2000))}
                    placeholder="What do you want to share?"
                    className="w-full bg-transparent text-on-surface text-lg placeholder:text-slate-500 resize-none outline-none min-h-[120px]"
                    autoFocus
                  />
                  
                  {/* Image Preview Grid */}
                  {uploadedImages.length > 0 && (
                    <div className={`mt-3 grid gap-1 ${
                      uploadedImages.length === 1 ? 'grid-cols-1' :
                      uploadedImages.length === 2 ? 'grid-cols-2' :
                      'grid-cols-2'
                    }`}>
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            alt={`Upload ${idx + 1}`} 
                            src={img} 
                            className="w-full h-40 object-cover rounded-lg" 
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MaterialIcon name="close" className="text-white text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Character Count */}
              <div className="flex justify-end mt-2">
                <span className={`text-xs ${postContent.length >= 1900 ? 'text-red-500' : 'text-slate-500'}`}>
                  {postContent.length}/2000
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <MaterialIcon name="image" className="text-red-500 text-xl" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MaterialIcon name="gif_box" className="text-slate-400 text-xl" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MaterialIcon name="location_on" className="text-slate-400 text-xl" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedCard({ post }: { post: FeedPost }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getGridClass = (count: number) => {
    switch (count) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-2 [&>*:first-child]:row-span-2';
      case 4: return 'grid-cols-2';
      default: return 'grid-cols-2';
    }
  };

  return (
    <article className={`glass-card rounded-xl overflow-hidden ${post.type === 'member_only' ? 'border border-red-500/10' : ''}`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border-2 p-0.5 ${post.type === 'trip' ? 'border-red-500' : 'border-slate-700'}`}>
            <img alt={post.creator.name} className="w-full h-full rounded-full object-cover" src={post.creator.avatar} />
          </div>
          <div>
            <h3 className="font-bold text-sm">{post.creator.name}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-tighter">{post.creator.location} • {post.timestamp}</p>
          </div>
        </div>
        {post.type === 'member_only' ? (
          <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded uppercase">Member Only</span>
        ) : (
          <MaterialIcon name="more_horiz" className="text-slate-500" />
        )}
      </div>

      {/* Content */}
      {post.isLocked ? (
        <div className="relative h-48 w-full group overflow-hidden">
          <img alt="Locked content" className="w-full h-full object-cover blur-xl scale-110 opacity-50" src={post.images?.[0]} />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <MaterialIcon name="lock" className="text-4xl text-red-500 mb-2" />
            <button className="bg-red-500 text-white px-6 py-2 rounded-full font-medium text-sm active:scale-95 transition-all" style={{ boxShadow: '0 0 20px rgba(255,77,90,0.2)' }}>
              Unlock with Pro Membership
            </button>
          </div>
        </div>
      ) : post.images && post.images.length > 0 ? (
        <div className="relative">
          {/* Twitter-style image grid */}
          {post.images.length > 1 ? (
            <div className={`grid ${getGridClass(post.images.length)} gap-0.5`}>
              {post.images.slice(0, 4).map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img 
                    alt={`Post image ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    src={img} 
                  />
                  {/* Show overlay on selected image */}
                  {idx === currentImageIndex && (
                    <div className="absolute inset-0 bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <img alt="Post image" className="w-full h-auto max-h-96 object-cover" src={post.images[0]} />
            </div>
          )}

          {/* Image carousel for multiple images */}
          {post.images.length > 1 && (
            <>
              {/* Navigation arrows */}
              {currentImageIndex > 0 && (
                <button 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-black/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(currentImageIndex - 1);
                  }}
                >
                  <MaterialIcon name="chevron_left" className="text-white" />
                </button>
              )}
              {currentImageIndex < post.images.length - 1 && (
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-black/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(currentImageIndex + 1);
                  }}
                >
                  <MaterialIcon name="chevron_right" className="text-white" />
                </button>
              )}
              
              {/* Image indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Live badge */}
          {post.isLive && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Updates</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Post Content */}
      <div className="p-4 space-y-2">
        {post.title && <h4 className="font-bold text-lg mb-1 text-on-surface">{post.title}</h4>}
        <p className="text-sm text-on-surface whitespace-pre-wrap">{post.content}</p>

        {/* Price & CTA for product posts */}
        {post.price && (
          <div className="pt-2 flex items-center justify-between bg-white/5 p-3 rounded-lg mt-2">
            <div>
              <span className="text-xs text-slate-500">Product Price</span>
              <p className="text-lg font-bold text-red-500">{post.price}</p>
            </div>
            <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:bg-red-400 active:scale-95 transition-all shadow-md" style={{ boxShadow: '0 0 15px rgba(255,179,178,0.3)' }}>
              I want this!
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-6">
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors group">
              <MaterialIcon name="favorite" className="text-xl group-hover:filled" filled={false} />
              <span className="text-xs font-bold">{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors">
              <MaterialIcon name="chat_bubble" className="text-xl" />
              <span className="text-xs font-bold">{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-green-400 transition-colors">
              <MaterialIcon name="share" className="text-xl" />
            </button>
          </div>
          <button className="text-slate-400 hover:text-yellow-400 transition-colors">
            <MaterialIcon name="bookmark_border" className="text-xl" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default HomePage;