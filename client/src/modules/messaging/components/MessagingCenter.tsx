'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  messagingService,
  ConversationItem,
  DirectMessageItem,
} from '../services/messaging.service';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/services/api';

export function MessagingCenter() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DirectMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // New message modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [newMsgContent, setNewMsgContent] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await messagingService.getConversations();
      if (res?.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConvId) {
          setActiveConvId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const loadMessages = async (convId: string) => {
    try {
      setLoadingMessages(true);
      const res = await messagingService.getMessages(convId);
      if (res?.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConvId) return;

    const currentConv = conversations.find((c) => c.id === activeConvId);
    if (!currentConv) return;

    try {
      setSending(true);
      const res = await messagingService.sendMessage({
        recipientId: currentConv.otherUser.id,
        content: messageText.trim(),
      });
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
        setMessageText('');
        loadConversations();
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleOpenNewModal = async () => {
    setShowNewModal(true);
    try {
      setLoadingUsers(true);
      // Fetch available contacts (instructors if student, students if instructor)
      const res = await api.get('/courses/tenant-students');
      if (res?.data?.data) {
        setAvailableUsers(
          res.data.data.filter((u: any) => u.id !== user?.id)
        );
      }
    } catch (err) {
      // Fallback: load users list
      try {
        const res = await api.get('/users?limit=50');
        if (res?.data?.data) {
          setAvailableUsers(
            res.data.data.filter((u: any) => u.id !== user?.id)
          );
        }
      } catch (e) {
        console.error('Failed to load contacts', e);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipientId || !newMsgContent.trim()) {
      toast.warning('Please select a recipient and enter a message');
      return;
    }

    try {
      setSending(true);
      const res = await messagingService.sendMessage({
        recipientId: selectedRecipientId,
        content: newMsgContent.trim(),
      });
      if (res?.data) {
        toast.success('Message sent!');
        setShowNewModal(false);
        setNewMsgContent('');
        setSelectedRecipientId('');
        await loadConversations();
        setActiveConvId(res.data.conversationId);
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const name = `${c.otherUser.firstName} ${c.otherUser.lastName}`.toLowerCase();
    return name.includes(searchFilter.toLowerCase());
  });

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle overflow-hidden shadow-sm flex flex-col md:flex-row h-[75vh]">
      {/* Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-border-subtle flex flex-col bg-surface-container-low shrink-0">
        <div className="p-4 border-b border-border-subtle flex items-center justify-between gap-3">
          <h2 className="font-headline-md text-base font-bold text-on-surface">Messages</h2>
          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-white font-bold rounded-lg text-xs hover:shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            New
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border-subtle">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-lg text-xs text-on-surface outline-none focus:border-secondary"
            />
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
          {loading ? (
            <div className="py-12 flex justify-center text-xs text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-xs p-4">
              <span className="material-symbols-outlined text-3xl mb-1 opacity-30">chat</span>
              <p className="font-semibold">No conversations yet</p>
              <p className="mt-1 opacity-70">Start a chat with your instructor or students</p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isActive = c.id === activeConvId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                    isActive ? 'bg-secondary/10' : 'hover:bg-surface-container'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden mt-0.5">
                    {c.otherUser.avatar ? (
                      <img
                        src={c.otherUser.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      c.otherUser.firstName[0]
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="font-bold text-xs text-on-surface truncate">
                        {c.otherUser.firstName} {c.otherUser.lastName}
                      </p>
                      <span className="text-[10px] text-on-surface-variant shrink-0">
                        {new Date(c.lastMessageAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant truncate">
                      {c.lastMessage?.content || 'No messages yet'}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-semibold text-secondary uppercase bg-secondary/10 px-1 rounded">
                        {c.otherUser.role}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat Window */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-container-low shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                  {activeConv.otherUser.avatar ? (
                    <img
                      src={activeConv.otherUser.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    activeConv.otherUser.firstName[0]
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">
                    {activeConv.otherUser.firstName} {activeConv.otherUser.lastName}
                  </h3>
                  <span className="text-[10px] text-on-surface-variant capitalize">
                    {activeConv.otherUser.role} • Lumina Learning
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="py-12 flex justify-center text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant text-xs">
                  Say hello! Start the conversation.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-sm ${
                          isMine
                            ? 'bg-secondary text-white rounded-br-none'
                            : 'bg-surface-container border border-border-subtle text-on-surface rounded-bl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        {msg.fileUrl && (
                          <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-[11px] underline opacity-90"
                          >
                            <span className="material-symbols-outlined text-[14px]">attachment</span>
                            Attachment
                          </a>
                        )}
                      </div>
                      <span className="text-[9px] text-on-surface-variant mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border-subtle flex items-center gap-2 bg-surface-container-low shrink-0">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-4 py-2 bg-surface-container-lowest border border-border-subtle rounded-xl text-xs text-on-surface outline-none focus:border-secondary"
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="px-4 py-2 bg-secondary text-white font-bold rounded-xl text-xs flex items-center gap-1 hover:shadow-md transition-all disabled:opacity-50"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-5xl mb-2 opacity-25">forum</span>
            <p className="font-semibold">Select a conversation</p>
            <p className="text-xs text-center max-w-xs mt-1">
              Choose an existing chat from the left sidebar or click &quot;New&quot; to message an instructor or student.
            </p>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-border-subtle p-6 animate-scaleUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-on-surface">New Message</h3>
              <button onClick={() => setShowNewModal(false)} className="text-on-surface-variant hover:text-on-surface">
                ✕
              </button>
            </div>

            <form onSubmit={handleStartConversation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Select Contact
                </label>
                {loadingUsers ? (
                  <div className="text-xs text-on-surface-variant py-2">Loading contacts...</div>
                ) : (
                  <select
                    value={selectedRecipientId}
                    onChange={(e) => setSelectedRecipientId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface outline-none focus:border-secondary"
                    required
                  >
                    <option value="">-- Choose recipient --</option>
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName} ({u.role || 'User'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  placeholder="Type your message..."
                  value={newMsgContent}
                  onChange={(e) => setNewMsgContent(e.target.value)}
                  className="w-full h-28 px-3 py-2 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface outline-none focus:border-secondary resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 bg-secondary text-white font-bold rounded-lg text-xs hover:shadow-md transition-all disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
