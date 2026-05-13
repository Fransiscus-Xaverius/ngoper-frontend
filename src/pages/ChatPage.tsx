import { useState, useEffect, useRef, useCallback } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { Header } from '../components/layout/Header';
import clsx from 'clsx';

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isActive: boolean;
  isUnread: boolean;
  verified?: boolean;
  category?: 'order' | 'personal' | 'member';
  orderId?: string;
}

interface Message {
  id: string;
  type: 'incoming' | 'outgoing' | 'system';
  content: string;
  time: string;
  senderAvatar?: string;
  isRead?: boolean;
  quoteData?: {
    orderId: string;
    itemPrice: number;
    serviceFee: number;
    total: number;
  };
}

interface WebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'online';
  chatId?: string;
  message?: string;
  senderId?: string;
  timestamp?: string;
}

const mockWebSocket = {
  listeners: [] as ((data: WebSocketMessage) => void)[],
  connected: false,

  connect(onMessage: (data: WebSocketMessage) => void) {
    this.listeners.push(onMessage);
    this.connected = true;
    console.log('[WS] Connected');

    setTimeout(() => {
      onMessage({ type: 'online', chatId: '1', senderId: '1' });
    }, 1000);

    return () => {
      this.listeners = this.listeners.filter(l => l !== onMessage);
    };
  },

  send(message: WebSocketMessage) {
    console.log('[WS] Sending:', message);
    setTimeout(() => {
      this.listeners.forEach(l => l({
        type: 'message',
        chatId: message.chatId,
        message: `Echo: ${message.message}`,
        senderId: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 500);
  },

  simulateIncomingMessage(chatId: string, message: string) {
    this.listeners.forEach(l => l({
      type: 'message',
      chatId,
      message,
      senderId: 'other',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }
};

const chatList: ChatItem[] = [
  {
    id: '1',
    name: 'Sasha Kim',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcf9Cdi_J8kRSkhDTJU0ds4uGqDSEQGCI6dldiHlFXXhj85jyNhS82nvN58a23e86_ztuiXKPfEQNYw0Diq4eXNPpg376EEnQrX3uxDO6duUmWJqIkrbOlvj2vCj3NfzIVZtAQN2Mq_5eKCI67yq937LjGIVIK5IVLq0xRDOuAfQ1hjjeBW2GnUMTERp3zaJBYQGxmeyJ-t9dW5UEw4QT8aR5dIHeoKABsEC7gHleRItV9WE2U71F9dYD_Y-kOUnkMxinmMHuJG34',
    lastMessage: "Hey, I found the limited edition sneakers at the Ginza store!",
    time: '14:20',
    isActive: true,
    isUnread: true,
    category: 'order',
    orderId: 'NG-7729',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-wg1h8SmLmmWr6D1VzgEMsLwYIs3efv6G93XKSxc_5oDSvxt_9Lf5yTmiAdE8riVfHD_LSdsIRBJntsKcQt3CiL2SCSXfxMvW7lw7lLF_ZWdhffcOoxCdfJ3YNT7-GGZ_oaA_MoJhEuTrTOPF7m67TiN0Nhmtzh4HrLEgoFmYw4ImcOq-a_FUmOnQWjo_Hmx4ZlLIgU_t2j8sCtv7WKwG9VSSttv-mVWx7UN1rorT7v1P1ecJXZJk8IxQxgSX3vhdhDWffl-xmkA',
    lastMessage: 'The shipping details have been updated for your parcel.',
    time: 'Yesterday',
    isActive: false,
    isUnread: false,
    category: 'personal',
    verified: true,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5SO1nW2v_oUM-odeMhAcKkVhBr6IGfrlKwGHlJQiES7EbswAcXYrPMaXCI2aiIixEX59NbDxdn51R_MtKM0mN0vW10yhcItDKRF73qfM5qluuYE8Hub6GLe_du-_6gcJUdrm1IEf2Vm7fYb2Pqfb5_cH9UyAuO6-wHN7kW4wLfiZSfKdt3CPIhzIEe5M1VWdjKAYs7S82n6CHrmPlHrWpL64EBHmwrlnEuqTiXURDXZiw6QVaZAznsxumFmUJEOWhwwq6N1Y8M4A',
    lastMessage: 'Let me know when you\'re ready for the next batch!',
    time: 'Wed',
    isActive: false,
    isUnread: false,
    category: 'personal',
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEsW3KUuNQle1zppcW04T-qy5R0-rM1bphLBig5S45_Oe0X-9JRKYCWH49mt5PJEc0DBMuOwP4y_HlmT8mbPIEDGewKxbmOZxIgUxaf0RfJNyIfg2kE93buavm9AGtQy8rA0oR24BxnFF2hJI4yrbqJigVTD13Qlz45SJRITeGlA84elJxr8-Zcmy0gIiLHfM54fBCShyrtiTwbyklRTwZf5gcYEZTjfJJbPt6AZ0yzdFmXSezAnu9NsVbKHAN6k1GXix0dZ3DxDo',
    lastMessage: 'Received the payment, thank you!',
    time: 'Mon',
    isActive: false,
    isUnread: false,
    category: 'order',
    orderId: 'NG-6612',
  },
  {
    id: '5',
    name: 'Mina Sato',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-x5mthD3_cJZW1zRedAKSw1o7h-5G-saZkjFP2L82yyIsh5qRRU6ECEc2_z4MPPSwy8Eu2naJuYigNFNijRTt2Z5KJgBifLa-IzMNA4IHMvtr6TPVeGWQza0wu2H23sYgoFWp1DwlHOgDvUqSiW7FVuH3SLuYW7Gq0cIFct_4W5Hkh1tnb6T4PZlQhHLfd4yeYEgwSjtC7L0ro9-vPR8uuEiAWSPygL9F-rUJ158IU3aFeFuz7wy6NQjf97uGZYDyIVKeil-tbY',
    lastMessage: 'Can I still join the preorder for the designer lamp?',
    time: '22 Oct',
    isActive: false,
    isUnread: true,
    category: 'member',
  },
];

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'incoming',
    content: "Hey! I just found the Limited Edition Sennheiser headphones you were looking for at Ginza. I'm heading there now.",
    time: '14:15',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPTfrvcKm8uu5YpJ5Xu9M1HYc1hjeS2N26oZhB77TSLj-vfA-7-BBK_ofqaD-JFIBDVxN5hS_nzCHNjLNgLZj1lgOjZ-QZsS4hEuPWjWlLRaqOO0m71WFRibkak0jW1WQI-SaLx2eiQHIG6SyU2XfxrENY-sr9zQ77sfWr8Ba42-bmHNSV1x39zwdikRcZuHxWA8k3Zk8koSxvHMmKoWQ1lMNKF5pDRSzsWZo5-eH7gQs5nknif2KgHiTP9pkcAtCgcz2lblZG1Q8',
  },
  {
    id: '2',
    type: 'system',
    content: '',
    time: '',
    quoteData: {
      orderId: 'NG-9921',
      itemPrice: 399,
      serviceFee: 51,
      total: 450,
    },
  },
  {
    id: '3',
    type: 'outgoing',
    content: 'That looks perfect! The price is exactly what I expected. Going to approve the quote now.',
    time: '14:22',
    isRead: true,
  },
];

type ChatCategory = 'all' | 'unread' | 'orders' | 'members';

export function ChatPage() {
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory>('all');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories: { key: ChatCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'orders', label: 'Orders' },
    { key: 'members', label: 'Members' },
  ];

  useEffect(() => {
    const unsubscribe = mockWebSocket.connect((wsMessage) => {
      if (wsMessage.type === 'message' && wsMessage.chatId === activeChat?.id) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'incoming',
          content: wsMessage.message || '',
          time: wsMessage.timestamp || '',
          senderAvatar: activeChat?.avatar,
        };
        setMessagesList(prev => [...prev, newMessage]);
      }
    });
    return unsubscribe;
  }, [activeChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesList]);

  const getCategoryCount = (key: ChatCategory) => {
    if (key === 'all') return chatList.length;
    if (key === 'unread') return chatList.filter(c => c.isUnread).length;
    if (key === 'orders') return chatList.filter(c => c.category === 'order').length;
    if (key === 'members') return chatList.filter(c => c.category === 'member').length;
    return 0;
  };

  const filteredChats = chatList.filter((chat) => {
    if (selectedCategory === 'unread') return chat.isUnread;
    if (selectedCategory === 'orders') return chat.category === 'order';
    if (selectedCategory === 'members') return chat.category === 'member';
    return true;
  });

  const handleSelectChat = useCallback((chat: ChatItem) => {
    setActiveChat(chat);
    setMobileView('chat');
    setMessagesList(initialMessages);
  }, []);

  const handleBackToList = useCallback(() => {
    setMobileView('list');
    setActiveChat(null);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'outgoing',
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessagesList(prev => [...prev, newMessage]);
    setMessage('');

    mockWebSocket.send({
      type: 'message',
      chatId: activeChat.id,
      message: message,
    });

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'incoming',
          content: "Thanks for your message! I'll get back to you soon.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderAvatar: activeChat.avatar,
        };
        setMessagesList(prev => [...prev, replyMessage]);
      }, 2000);
    }, 1000);
  }, [message, activeChat]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Header - loggedIn variant with back button when in chat view */}
      <Header 
        variant="loggedIn" 
        backButton={{
          show: mobileView === 'chat',
          onClick: handleBackToList
        }}
      />

      

      {/* Chat List Panel */}
      <aside
        className={clsx(
          'flex flex-col border-r border-outline-variant bg-surface-container-low w-full md:w-96 shrink-0 pt-20',
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        )}
      >
        {/* Desktop Header */}
        <div className="hidden md:block p-6 border-b border-outline-variant">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-headline-md text-on-surface">Messages</h2>
            <button className="text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors">
              <MaterialIcon name="edit_square" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <MaterialIcon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"
            />
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-label-lg text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary-container focus:ring-0 outline-none transition-colors"
              placeholder="Search conversations..."
              type="text"
            />
          </div>

          {/* Desktop Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-label-lg whitespace-nowrap transition-all',
                  selectedCategory === cat.key
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(255,82,93,0.3)]'
                    : 'bg-surface-container-high border border-white/5 text-on-surface-variant hover:bg-surface-bright'
                )}
              >
                {cat.label}
                {cat.key !== 'all' && getCategoryCount(cat.key) > 0 && (
                  <span className={clsx(
                    'ml-1.5 px-1.5 py-0.5 text-xs rounded-full',
                    selectedCategory === cat.key ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                  )}>
                    {getCategoryCount(cat.key)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={clsx(
                'px-4 py-6 cursor-pointer transition-colors border-b border-white/5',
                activeChat?.id === chat.id && mobileView !== 'chat'
                  ? 'bg-surface-container-highest border-l-4 border-primary-container'
                  : 'hover:bg-surface-container border-l-4 border-transparent'
              )}
            >
              <div className="flex gap-3">
                <div className="relative shrink-0">
                  <div className={clsx(
                    'w-14 h-14 rounded-full p-[2px]',
                    chat.isUnread && 'ring-2 ring-primary'
                  )}>
                    <img
                      className={clsx('w-full h-full rounded-full object-cover', !chat.isActive && 'grayscale')}
                      src={chat.avatar}
                      alt={chat.name}
                    />
                  </div>
                  {chat.isActive && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary border-2 border-background rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={clsx(
                      'text-body-lg truncate',
                      chat.isUnread ? 'text-on-surface font-semibold' : 'text-on-surface'
                    )}>
                      {chat.name}
                    </h3>
                    <span className={clsx(
                      'text-label-sm shrink-0',
                      chat.isUnread ? 'text-primary' : 'text-on-surface-variant'
                    )}>
                      {chat.time}
                    </span>
                  </div>
                  {chat.category && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className={clsx(
                        'text-label-sm px-2 py-0.5 rounded-sm',
                        chat.category === 'order' ? 'bg-surface-container-highest text-primary' :
                        chat.category === 'member' ? 'bg-surface-container-highest text-primary' :
                        'bg-surface-container-highest text-secondary'
                      )}>
                        {chat.category === 'order' && chat.orderId && `Order #${chat.orderId}`}
                        {chat.category === 'member' && 'New Member'}
                        {chat.category === 'personal' && 'Japan Trip'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    {chat.isUnread && (
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        done_all
                      </span>
                    )}
                    <p className={clsx(
                      'text-body-md truncate',
                      chat.isUnread ? 'text-on-surface' : 'text-on-surface-variant'
                    )}>
                      {chat.lastMessage}
                    </p>
                    {chat.isUnread && (
                      <span className="ml-auto bg-primary-container text-on-primary-container w-5 h-5 rounded-full flex items-center justify-center text-label-sm shadow-[0_0_10px_rgba(255,82,93,0.4)]">
                        2
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Conversation Area */}
      <section
        className={clsx(
          'flex flex-col bg-surface overflow-hidden flex-1 pt-20',
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        )}
      >
        {/* Header - Simplified chat info for desktop */}
        <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-outline-variant glass-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={activeChat?.avatar}
                alt={activeChat?.name}
              />
              {activeChat?.isActive && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-surface rounded-full" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <h3 className="text-headline-md text-on-surface">{activeChat?.name}</h3>
                {activeChat?.verified && (
                  <MaterialIcon name="verified" className="text-primary text-base" filled />
                )}
              </div>
              <span className="text-label-md text-on-surface-variant">Tokyo → Singapore • Flight SQ637</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-all">
              <MaterialIcon name="info" />
            </button>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 no-scrollbar flex flex-col">
          {/* Day Marker */}
          <div className="flex justify-center">
            <span className="px-4 py-1 bg-surface-container rounded-full text-label-sm text-on-surface-variant uppercase tracking-widest">
              Today
            </span>
          </div>

          {messagesList.map((msg) => {
            if (msg.type === 'system' && msg.quoteData) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="glass-card p-6 rounded-xl border-primary-container/30 max-w-sm w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                        <MaterialIcon name="request_quote" className="text-primary-container" />
                      </div>
                      <div>
                        <p className="text-label-lg text-on-surface">New Quote Received</p>
                        <p className="text-label-md text-on-surface-variant">Order #{msg.quoteData.orderId}</p>
                      </div>
                    </div>
                    <div className="bg-surface-container-highest p-4 rounded-lg mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-label-md text-on-surface-variant">Item Price</span>
                        <span className="text-label-md text-on-surface">${msg.quoteData.itemPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-label-md text-on-surface-variant">Service Fee</span>
                        <span className="text-label-md text-on-surface">${msg.quoteData.serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-outline-variant my-3" />
                      <div className="flex justify-between">
                        <span className="text-label-lg text-on-surface">Total</span>
                        <span className="text-label-lg text-primary-container">${msg.quoteData.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-primary-container text-on-primary-container rounded-lg font-bold shadow-[0_0_20px_rgba(255,82,93,0.3)] active:scale-95 transition-transform">
                      Approve & Pay
                    </button>
                  </div>
                </div>
              );
            }

            if (msg.type === 'incoming') {
              return (
                <div key={msg.id} className="flex gap-3 max-w-[80%]">
                  <div className="shrink-0 pt-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={msg.senderAvatar}
                      alt="Sender"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-container p-4 rounded-xl rounded-tl-none border border-white/5">
                      <p className="text-body-md text-on-surface">{msg.content}</p>
                    </div>
                    <span className="text-label-sm text-on-surface-variant">{msg.time}</span>
                  </div>
                </div>
              );
            }

            if (msg.type === 'outgoing') {
              return (
                <div key={msg.id} className="flex gap-3 max-w-[80%] self-end flex-row-reverse">
                  <div className="flex flex-col gap-2 items-end">
                    <div className="bg-primary-container p-4 rounded-xl rounded-tr-none text-on-primary-container shadow-[0_0_20px_rgba(255,82,93,0.3)]">
                      <p className="text-body-md font-medium">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-label-sm text-on-surface-variant">{msg.time}</span>
                      {msg.isRead && <MaterialIcon name="done_all" className="text-primary-container text-sm" filled />}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="shrink-0 pt-2">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={activeChat?.avatar}
                  alt="Sender"
                />
              </div>
              <div className="bg-surface-container px-4 py-3 rounded-xl rounded-tl-none border border-white/5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="p-4 md:p-6 border-t border-outline-variant bg-surface-container-low shrink-0">
          <div className="flex items-end gap-2 md:gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl p-2">
            <button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
              <MaterialIcon name="add_circle" />
            </button>
            <textarea
              className="flex-1 bg-transparent border-none focus:ring-0 text-body-md py-2 resize-none no-scrollbar max-h-32"
              placeholder="Type a message..."
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex items-center gap-1 md:gap-2">
              <button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
                <MaterialIcon name="mood" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-10 h-10 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,82,93,0.5)] hover:scale-105 active:scale-90 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <MaterialIcon name="send" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile FAB - Only show on list view */}
      {mobileView === 'list' && (
        <button className="fixed bottom-8 right-8 md:hidden w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-[0_4px_25px_rgba(255,82,93,0.4)] hover:scale-105 active:scale-95 transition-all z-50">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            forum
          </span>
        </button>
      )}
    </div>
  );
}