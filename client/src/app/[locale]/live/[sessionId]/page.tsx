'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  Hand,
  Send,
  Users,
  FolderOpen,
  MessageSquare,
  LogOut,
  FileText,
  ExternalLink,
  // ChevronDown,
  // Info,
  // CircleDot,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { liveService, LiveSession } from '@/modules/live/services/live.service';
import { toast } from 'react-toastify';

interface Message {
  sender: string;
  time: string;
  content: string;
  isSelf: boolean;
  avatar?: string;
  isInstructor?: boolean;
}

export default function LiveSessionWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user } = useAppSelector((state) => state.auth);

  // States
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoMode, setVideoMode] = useState<'webrtc' | 'studio'>('webrtc');
  const [activeTab, setActiveTab] = useState<'chat' | 'people' | 'files'>(
    'chat'
  );

  // Controls Toggles
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(true);
  const [handRaised, setHandRaised] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'Jamie L.',
      time: '2:14 PM',
      content:
        'Should we consider the accessibility tokens early in the design system build or as an audit later?',
      isSelf: false,
      avatar: 'https://placehold.co/100x100/e2e8f0/475569?text=JL',
    },
    {
      sender: 'Sarah Chen',
      time: '2:15 PM',
      content:
        "Great question, Jamie. Always early! We'll cover the 'A11y-First' token strategy in the next module.",
      isSelf: false,
      isInstructor: true,
      avatar: 'https://placehold.co/100x100/3b82f6/ffffff?text=SC',
    },
    {
      sender: 'Alex Rivera',
      time: '2:18 PM',
      content:
        'Thanks Sarah! The Figma file is really helpful for following along.',
      isSelf: false,
      avatar: 'https://placehold.co/100x100/e2e8f0/475569?text=AR',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Session Duration Timer
  const [timerString, setTimerString] = useState('00:00:00');
  const sessionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    fetchSession();
    // Register Join session
    liveService.joinSession(sessionId).catch((err) => {
      console.error('Failed to log join session in database', err);
    });

    // Start clock timer
    const interval = setInterval(() => {
      const diffMs = Date.now() - sessionStartTime.current;
      const hours = Math.floor(diffMs / 3600000)
        .toString()
        .padStart(2, '0');
      const mins = Math.floor((diffMs % 3600000) / 60000)
        .toString()
        .padStart(2, '0');
      const secs = Math.floor((diffMs % 60000) / 1000)
        .toString()
        .padStart(2, '0');
      setTimerString(`${hours}:${mins}:${secs}`);
    }, 1000);

    return () => {
      clearInterval(interval);
      // Auto-leave session on unmount
      liveService.leaveSession(sessionId).catch((err) => {
        console.error('Failed to log leave session in database', err);
      });
    };
  }, [sessionId]);

  useEffect(() => {
    // Scroll chat to bottom
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await liveService.getSessionById(sessionId);
      setSession(res.data);
      if (res.data.isActive === false) {
        // Automatically set active when instructor enters
        if (user?.role === 'instructor') {
          await liveService.updateSession(sessionId, { isActive: true });
        }
      }
    } catch (error) {
      toast.error('Failed to load session details');
      router.push('/instructor/live');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const timeString = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const msg: Message = {
      sender: user ? `${user.firstName} ${user.lastName}` : 'Guest User',
      time: timeString,
      content: newMessage,
      isSelf: true,
      avatar:
        user?.avatar || 'https://placehold.co/100x100/10b981/ffffff?text=ME',
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
  };

  const handleRaiseHand = () => {
    const nextState = !handRaised;
    setHandRaised(nextState);
    if (nextState) {
      // Post announcement in chat
      const msg: Message = {
        sender: 'System Notice',
        time: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
        content: `${user?.firstName || 'User'} raised their hand ✋`,
        isSelf: true,
      };
      setMessages((prev) => [...prev, msg]);
    }
  };

  const handleLeave = async () => {
    try {
      await liveService.leaveSession(sessionId);
      toast.info('You left the live session.');
      if (user?.role === 'instructor') {
        // Instructors can choose to deactivate session or just leave
        const end = confirm('Would you like to end the session for everyone?');
        if (end) {
          await liveService.updateSession(sessionId, { isActive: false });
        }
        router.push('/instructor/live');
      } else {
        router.push('/student/dashboard');
      }
    } catch (error) {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f172a] text-white">
        Loading interactive live workspace...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f172a] text-white">
        Failed to fetch live room.
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-[#0f172a] text-white font-body-md">
      {/* Session Top Bar */}
      <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg text-secondary tracking-tight">
            Lumina Live
          </span>
          <div className="h-4 w-px bg-slate-800"></div>
          <div>
            <h1 className="font-bold text-sm md:text-base text-slate-100 truncate max-w-md">
              {session.title}
            </h1>
            <p className="text-xs text-slate-400">
              Instructor: {session.instructor?.firstName}{' '}
              {session.instructor?.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setVideoMode('webrtc')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                videoMode === 'webrtc'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              WebRTC Room
            </button>
            <button
              onClick={() => setVideoMode('studio')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                videoMode === 'studio'
                  ? 'bg-secondary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Studio Stage
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Live • Recording</span>
          </div>
          <button
            onClick={handleLeave}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            <LogOut size={14} />
            Leave Room
          </button>
        </div>
      </header>

      {/* Workspace Core Area */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Side: Call Streams Area */}
        <section className="flex-1 flex flex-col p-6 min-w-0 overflow-hidden relative">
          {/* Main Video Screen Share Stage */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
            {videoMode === 'webrtc' && session.roomId ? (
              <iframe
                src={`https://meet.jit.si/${session.roomId}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false`}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0 rounded-2xl"
                title="Live Classroom Stream"
              />
            ) : screenShareActive ? (
              <Image
                src="https://placehold.co/1280x720/1e293b/ffffff?text=Sarah+Chen's+Screen+Share+(Figma+Design+Workspace)"
                alt="Figma screen share content"
                fill
                className="w-full h-full object-cover opacity-90"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <MicOff size={48} className="opacity-30 mb-2" />
                <p className="text-sm font-semibold">No screen share active</p>
                <p className="text-xs">
                  Instructor or presenter has paused screen share.
                </p>
              </div>
            )}

            {videoMode !== 'webrtc' && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                {/* Float Camera View for Instructor */}
                <div className="absolute top-4 right-4 w-44 aspect-video rounded-lg overflow-hidden border border-slate-700 shadow-lg bg-slate-900 relative">
                  {cameraActive ? (
                    <Image
                      src="https://placehold.co/200x120/312e81/ffffff?text=Sarah+Chen+(Host)"
                      alt="Sarah Chen presenter webcam"
                      fill
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-xs text-slate-500">
                      Camera Paused
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/60 rounded text-[9px] text-white font-medium uppercase tracking-wider z-10">
                    Instructor
                  </div>
                </div>

                {/* Presenter Name Tag */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 z-10">
                  <div className="bg-secondary text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg text-xs font-semibold">
                    <ScreenShare size={14} />
                    <span>Sarah Chen's Screen</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Participant Webcam Strip */}
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 shrink-0 select-none scrollbar-hide">
            <div className="flex-shrink-0 w-40 aspect-video rounded-xl bg-slate-800 relative overflow-hidden border border-slate-700">
              <Image
                src="https://placehold.co/200x120/111827/ffffff?text=Alex+Rivera"
                alt="Alex Rivera webcam feed"
                fill
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white px-1.5 py-0.5 bg-black/40 rounded z-10">
                Alex Rivera
              </div>
            </div>

            <div className="flex-shrink-0 w-40 aspect-video rounded-xl bg-slate-800 relative overflow-hidden border border-slate-700">
              <Image
                src="https://placehold.co/200x120/111827/ffffff?text=Jamie+L."
                alt="Jamie L webcam feed"
                fill
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white px-1.5 py-0.5 bg-black/40 rounded z-10">
                Jamie L.
              </div>
            </div>

            <div className="flex-shrink-0 w-40 aspect-video rounded-xl bg-slate-800 relative overflow-hidden border border-slate-700">
              <Image
                src="https://placehold.co/200x120/111827/ffffff?text=Elena+Sato"
                alt="Elena Sato webcam feed"
                fill
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white px-1.5 py-0.5 bg-black/40 rounded z-10">
                Elena Sato
              </div>
            </div>

            {/* Self User Video Mock */}
            <div className="flex-shrink-0 w-40 aspect-video rounded-xl bg-slate-800 relative overflow-hidden border border-slate-700">
              {cameraActive ? (
                <div className="w-full h-full bg-emerald-950/20 flex items-center justify-center text-xs font-semibold">
                  [Self Stream Mock]
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950 text-[10px] text-slate-500">
                  Camera Off
                </div>
              )}
              <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white px-1.5 py-0.5 bg-black/40 rounded">
                {user?.firstName} (You)
              </div>
            </div>
          </div>

          {/* Interactive Control Dock */}
          <div className="mt-auto w-full bg-slate-900 border border-slate-800 rounded-xl px-8 py-3 flex items-center justify-between shrink-0 shadow-lg">
            <div className="text-xs text-slate-400 font-semibold">
              Call Time: {timerString}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setMicActive(!micActive)}
                className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-colors group ${
                  micActive
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
                title={micActive ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micActive ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-colors group ${
                  cameraActive
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
                title={cameraActive ? 'Stop Camera' : 'Start Camera'}
              >
                {cameraActive ? <Video size={20} /> : <VideoOff size={20} />}
              </button>

              <div className="w-px h-8 bg-slate-800 mx-2"></div>

              <button
                onClick={() => setScreenShareActive(!screenShareActive)}
                className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-colors group ${
                  screenShareActive
                    ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                }`}
                title={
                  screenShareActive ? 'Stop Screen Share' : 'Start Screen Share'
                }
              >
                <ScreenShare size={20} />
              </button>

              <button
                onClick={handleRaiseHand}
                className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-colors group ${
                  handRaised
                    ? 'bg-secondary text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                }`}
                title="Raise Hand"
              >
                <Hand size={20} />
              </button>
            </div>

            <div className="w-[120px]"></div>
          </div>
        </section>

        {/* Right Side: Sidebar Panels */}
        <aside className="w-[380px] border-l border-slate-800 flex flex-col bg-slate-900 shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'text-secondary border-secondary'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <MessageSquare size={16} />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'people'
                  ? 'text-secondary border-secondary'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <Users size={16} />
              People
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'text-secondary border-secondary'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <FolderOpen size={16} />
              Files
            </button>
          </div>

          {/* Panel: Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {messages.map((msg, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    {msg.avatar ? (
                      <Image
                        src={msg.avatar}
                        alt=""
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                        {msg.sender.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold truncate max-w-[150px] ${msg.isInstructor ? 'text-secondary' : 'text-slate-200'}`}
                        >
                          {msg.sender}
                        </span>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {msg.time}
                        </span>
                      </div>
                      <p
                        className={`mt-1 px-3 py-2 rounded-xl rounded-tl-none font-body-sm leading-relaxed ${
                          msg.isInstructor
                            ? 'bg-secondary/10 border border-secondary/10 text-slate-200'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="mt-4 pt-4 border-t border-slate-800 shrink-0"
              >
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-slate-950 border-none rounded-xl py-3 pl-4 pr-12 focus:ring-1 focus:ring-secondary/50 font-body-sm text-sm text-slate-200 placeholder-slate-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 text-secondary p-1.5 rounded-lg hover:bg-secondary/10 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Panel: People */}
          {activeTab === 'people' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Host
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                    SC
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Sarah Chen
                    </p>
                    <p className="text-[10px] text-secondary font-medium">
                      Instructor
                    </p>
                  </div>
                </div>
                <Mic size={16} className="text-slate-400" />
              </div>

              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-4">
                Participants
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                    AR
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    Alex Rivera
                  </p>
                </div>
                <Mic size={16} className="text-slate-400" />
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                    JL
                  </div>
                  <p className="text-sm font-medium text-slate-300">Jamie L.</p>
                </div>
                <MicOff size={16} className="text-slate-500" />
              </div>

              {/* Self */}
              <div className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition-colors bg-secondary/5 border-l-2 border-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold">
                    {user?.firstName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">
                      {user?.firstName} {user?.lastName} (You)
                    </p>
                    <p className="text-[9px] text-slate-500 uppercase">
                      {user?.role}
                    </p>
                  </div>
                </div>
                {micActive ? (
                  <Mic size={16} className="text-emerald-400" />
                ) : (
                  <MicOff size={16} className="text-red-400" />
                )}
              </div>
            </div>
          )}

          {/* Panel: Files */}
          {activeTab === 'files' && (
            <div className="flex-1 p-4 space-y-4">
              <div className="p-4 border border-slate-800 rounded-xl hover:border-secondary transition-colors cursor-pointer group bg-slate-950/20">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-secondary transition-colors truncate">
                      Design_Systems_Checklist.pdf
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      2.4 MB • Updated today
                    </p>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-slate-500 group-hover:text-secondary"
                  />
                </div>
              </div>

              <div className="p-4 border border-slate-800 rounded-xl hover:border-secondary transition-colors cursor-pointer group bg-slate-950/20">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <ExternalLink size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-secondary transition-colors truncate">
                      Shared Figma Workspace
                    </h4>
                    <p className="text-[10px] text-slate-500">figma.com</p>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-slate-500 group-hover:text-secondary"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-slate-800 bg-slate-950/40">
                <h5 className="text-xs font-bold text-slate-200 mb-2">
                  Live Collaborative Notes
                </h5>
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  Students are currently documenting the key takeaways for the
                  "A11y-First" section. Join the doc to contribute.
                </p>
                <button className="w-full mt-3 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-bold text-xs transition-colors">
                  Join Shared Notes
                </button>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
