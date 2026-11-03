import React, { useState, useMemo } from 'react';
import { COMMUNITY_POSTS, OFFICIAL_ANNOUNCEMENT } from '../../data/mockData';
import {
  ThumbsUp,
  MessageSquare,
  Plus,
  CheckCircle2,
  Send,
  X,
  ChevronDown,
  Megaphone,
  User,
  Sparkles,
  Info,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Heart,
  Smile,
  ArrowRight,
  Filter,
  Flame,
  Lightbulb,
  Compass,
  Users2,
  Lock,
  MessageSquareHeart,
  Search,
} from 'lucide-react';
import EchoLogo from '../common/EchoLogo';

export default function CommunityBoardView({
  onNewPost,
  onShowToast,
  isAnnouncementPublished: propIsPublished,
  setIsAnnouncementPublished: propSetIsPublished,
  userRole = 'employee',
  onNavigateToFeedback,
  highlightPostId,
  onClearHighlight,
}) {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [announcement, setAnnouncement] = useState(OFFICIAL_ANNOUNCEMENT);
  const [activeTab, setActiveTab] = useState('discussions'); // 'discussions' | 'announcements'
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showEkoPrompt, setShowEkoPrompt] = useState(false);
  const [ekoPromptPostId, setEkoPromptPostId] = useState(null);
  const [reactions, setReactions] = useState({
    'COM-1': { relatable: 24, beenThere: 8, support: 6 },
    'COM-2': { relatable: 11, beenThere: 5, support: 9 },
    'COM-3': { relatable: 8, beenThere: 14, support: 4 },
    'COM-4': { relatable: 5, beenThere: 12, support: 3 },
  });
  const [userReacted, setUserReacted] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Workload & Role Clarity');
  const [toast, setToast] = useState(null);

  // Auto-scroll and highlight referred post (e.g. COM-1)
  React.useEffect(() => {
    if (highlightPostId) {
      setActiveTab('discussions');
      const timer = setTimeout(() => {
        const el = document.getElementById(`post-${highlightPostId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [highlightPostId]);

  // Local fallback if parent doesn't pass announcement state
  const [localIsPublished, setLocalIsPublished] = useState(false);
  const isPublished = propIsPublished !== undefined ? propIsPublished : localIsPublished;
  const setIsPublished = propSetIsPublished || setLocalIsPublished;

  const triggerToast = (msg) => {
    if (onShowToast) onShowToast(msg);
  };

  const handleUpvote = (id) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const hasVoted = p.userUpvoted;
          const newCount = hasVoted ? p.upvotes - 1 : p.upvotes + 1;
          return {
            ...p,
            upvotes: newCount,
            userUpvoted: !hasVoted,
          };
        }
        return p;
      })
    );
    // Smoothly show gentle Eko suggestion right under the upvoted post!
    setEkoPromptPostId(id);
    setShowEkoPrompt(true);
  };

  const handleReaction = (postId, reactionType) => {
    const key = `${postId}-${reactionType}`;
    const alreadyReacted = userReacted[key];

    setReactions((prev) => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || { relatable: 0, beenThere: 0, support: 0 }),
        [reactionType]: alreadyReacted
          ? Math.max(0, (prev[postId]?.[reactionType] || 1) - 1)
          : (prev[postId]?.[reactionType] || 0) + 1,
      },
    }));

    setUserReacted((prev) => ({
      ...prev,
      [key]: !alreadyReacted,
    }));

    // Trigger gentle Eko prompt on reaction as well
    setEkoPromptPostId(postId);
    setShowEkoPrompt(true);
  };

  const toggleReplies = (id) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const newReply = {
      author: 'Anonymous Employee',
      time: 'Just now',
      text,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedReplies = p.replies ? [...p.replies, newReply] : [newReply];
          return {
            ...p,
            replies: updatedReplies,
            comments: (p.comments || 0) + 1,
          };
        }
        return p;
      })
    );

    setExpandedReplies((prev) => ({ ...prev, [postId]: true }));
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    triggerToast('Comment added anonymously.');
  };

  const handleAcknowledgeAnnouncement = () => {
    setAnnouncement((prev) => ({
      ...prev,
      acknowledged: !prev.acknowledged,
    }));
    triggerToast(
      announcement.acknowledged
        ? 'Announcement unacknowledged'
        : 'Thank you! You have acknowledged this company update.'
    );
  };

  const handleCreatePost = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostObj = {
      id: `COM-${Date.now()}`,
      author: 'Anonymous Employee',
      time: 'Just now',
      badge: 'Anonymous',
      title: newTitle.trim(),
      content: newContent.trim(),
      upvotes: 1,
      userUpvoted: true,
      comments: 0,
      tag: newTag,
      categoryKey:
        newTag === 'Workload & Role Clarity'
          ? 'con_01'
          : newTag === 'Manager Support & Guidance'
            ? 'con_02'
            : newTag === 'Recognition & Career Growth'
              ? 'con_03'
              : 'con_04',
      replies: [],
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowModal(false);
    triggerToast('Anonymous post published to Community Board.');
    if (onNewPost) onNewPost();
  };

  // Filter posts by tag and search query
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedTag !== 'all') {
      result = result.filter(
        (p) =>
          p.tag === selectedTag ||
          p.categoryKey === selectedTag ||
          (selectedTag === 'con_01' && p.tag?.includes('Workload')) ||
          (selectedTag.includes('Workload') && p.tag?.includes('Workload')) ||
          (selectedTag.includes('Manager') && p.tag?.includes('Manager')) ||
          (selectedTag.includes('Recognition') && p.tag?.includes('Recognition')) ||
          (selectedTag.includes('Collaboration') && p.tag?.includes('Collaboration'))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.tag?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, selectedTag, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full">


      {/* 2. MAIN 2-COLUMN LAYOUT: Utilizing the entire screen */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] xl:grid-cols-[1fr_360px] gap-6 items-start w-full">
        {/* LEFT COLUMN: Main Feed, Tabs, and Posts */}
        <div className="flex flex-col gap-5 w-full">
          {/* TABS & SEARCH BAR (Search beside Company Announcements button) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBECEF] pb-3">
            {/* Tab switchers + Search bar directly beside Company Announcement tab button */}
            <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setActiveTab('discussions')}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-5 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'discussions'
                  ? 'bg-[#5455EE] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EBECEF]'
                  }`}
              >
                <MessageSquare size={14} />
                <span>Discussions ({filteredPosts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('announcements')}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-5 transition-all cursor-pointer flex items-center gap-2 relative whitespace-nowrap ${activeTab === 'announcements'
                  ? 'bg-[#5455EE] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EBECEF]'
                  }`}
              >
                <Megaphone size={14} />
                <span>Company Announcements</span>
                {isPublished ? (
                  <span className="text-xs font-medium text-white bg-emerald-500 px-2 py-0.5 rounded-full shadow-2xs">
                    1 New
                  </span>
                ) : (
                  <span className="text-xs font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    0
                  </span>
                )}
              </button>

              {/* Search input beside Company Announcements button */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search discussions or announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#EBECEF] focus:border-[#5455EE] rounded-2xl pl-9 pr-8 py-2 text-sm font-normal text-slate-800 placeholder-slate-400 outline-none transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TAB 1: COMMUNITY DISCUSSIONS */}
          {activeTab === 'discussions' && (
            <div className="flex flex-col gap-4">
              {/* Expandable Inline Post Creation Box */}
              {!isPostComposerOpen ? (
                <div
                  onClick={() => setIsPostComposerOpen(true)}
                  className="bg-white border border-[#EBECEF] hover:border-[#5455EE]/40 rounded-3xl p-4 sm:p-4.5 shadow-card transition-all cursor-pointer flex items-center gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center flex-shrink-0 shadow-2xs border border-[#5455EE]/20 font-bold text-xs group-hover:scale-105 transition-transform">
                    <User size={18} />
                  </div>
                  <div className="flex-1 py-2.5 px-4 rounded-2xl bg-[#F8F9FD] border border-slate-200/80 text-xs sm:text-sm text-slate-500 group-hover:text-slate-800 transition-colors">
                    What's on your mind? Share your thoughts, suggestions, or team experiences...
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#EEF0FF] group-hover:bg-[#5455EE] text-[#5455EE] group-hover:text-white rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Share</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-[#5455EE]/40 ring-2 ring-[#5455EE]/10 rounded-3xl p-5 shadow-card transition-all flex flex-col gap-3.5 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center flex-shrink-0 shadow-2xs border border-[#5455EE]/20 font-bold text-xs mt-0.5">
                      <User size={18} />
                    </div>
                    <div className="flex-1 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">Maya Tan</span>
                          <span className="text-[10px] font-bold text-[#5455EE] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full border border-[#5455EE]/20 flex items-center gap-1">
                            <Lock size={10} />
                            <span>Anonymous Peer Post</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-500">Topic:</span>
                          <select
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="p-1.5 px-3 rounded-xl border border-[#EBECEF] bg-[#F8F9FD] text-xs font-semibold text-slate-700 outline-none focus:border-[#5455EE] cursor-pointer"
                          >
                            <option value="Workload & Role Clarity">Workload & Role Clarity</option>
                            <option value="Manager Support & Guidance">Manager Support & Guidance</option>
                            <option value="Recognition & Career Growth">Recognition & Career Growth</option>
                            <option value="Collaboration & Change">Collaboration & Change</option>
                          </select>
                        </div>
                      </div>

                      <input
                        type="text"
                        autoFocus
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Post title (e.g. Tips for managing sprint handoffs)..."
                        className="w-full p-2.5 px-3.5 rounded-2xl border border-[#EBECEF] bg-[#F8F9FD] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#5455EE] focus:bg-white transition-all"
                      />

                      <textarea
                        rows={3}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="What's on your mind? Share your constructive ideas, team experiences, or ask peers for advice..."
                        className="w-full p-3 rounded-2xl border border-[#EBECEF] bg-[#F8F9FD] text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#5455EE] focus:bg-white transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-medium">
                      🛡️ Protected: Shared as Anonymous Peer on the Community Board
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPostComposerOpen(false);
                          setNewTitle('');
                          setNewContent('');
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          handleCreatePost(e);
                          setIsPostComposerOpen(false);
                        }}
                        disabled={!newTitle.trim() || !newContent.trim()}
                        className="px-4 py-2 bg-[#5455EE] hover:bg-[#4344dd] disabled:opacity-40 disabled:hover:bg-[#5455EE] text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send size={13} />
                        <span>Post Anonymously</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filteredPosts.length === 0 && (
                <div className="bg-white border border-[#EBECEF] rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center">
                    <Search size={22} />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">No discussions found</h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    {searchQuery
                      ? `No peer posts matched "${searchQuery}". Try a different keyword or clear your filters.`
                      : 'No posts in this topic yet. Be the first to start a conversation!'}
                  </p>
                  {(searchQuery || selectedTag !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTag('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#5455EE] text-white text-xs font-bold hover:bg-[#4344dd] transition-all cursor-pointer"
                    >
                      Clear Search & Filters
                    </button>
                  )}
                </div>
              )}

              {filteredPosts.map((post) => {
                const isRepliesOpen = expandedReplies[post.id];
                const replyCount = post.replies?.length || post.comments || 0;
                const postReactions = reactions[post.id] || { relatable: 0, beenThere: 0, support: 0 };

                // Custom badge color per tag
                const tagColorClass = post.tag?.includes('Workload')
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : post.tag?.includes('Manager')
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : post.tag?.includes('Recognition')
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200';

                const isHighlighted = highlightPostId === post.id;

                return (
                  <article
                    key={post.id}
                    id={`post-${post.id}`}
                    className={`bg-white border rounded-3xl p-6 shadow-card hover:border-[#5455EE]/40 hover:shadow-md transition-all flex flex-col gap-4 group ${isHighlighted
                      ? 'border-2 border-[#5455EE] ring-4 ring-[#5455EE]/20 shadow-lg'
                      : 'border-[#EBECEF]'
                      }`}
                  >

                    {/* Header: Author, Badge, Time, and Tag */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EEF0FF] to-[#E0E4FF] text-[#5455EE] flex items-center justify-center flex-shrink-0 shadow-2xs border border-[#5455EE]/20 font-medium text-sm">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-semibold leading-5 text-slate-900">{post.author}</span>
                            <span className="text-xs font-medium leading-[18px] text-[#5455EE] bg-[#EEF0FF] px-2 py-0.5 rounded-md border border-[#5455EE]/20">
                              Anonymous Peer
                            </span>
                          </div>
                          <span className="text-xs font-normal leading-[18px] text-slate-500 mt-0.5 block">
                            Posted {post.time}
                          </span>
                        </div>
                      </div>

                      {post.tag && (
                        <span
                          className={`text-xs font-medium leading-[18px] px-2.5 py-1 rounded-full border ${tagColorClass}`}
                        >
                          {post.tag}
                        </span>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-slate-900 leading-[26px] group-hover:text-[#5455EE] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-base font-normal text-slate-700 leading-6 whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* Micro-Reaction Chips */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleReaction(post.id, 'relatable')}
                        className={`px-2.5 py-1 rounded-xl text-[13px] font-medium leading-5 transition-all cursor-pointer flex items-center gap-1.5 ${userReacted[`${post.id}-relatable`]
                          ? 'bg-[#EEF0FF] text-[#5455EE] border border-[#5455EE]/30 shadow-2xs'
                          : 'bg-[#F8F9FD] text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                      >
                        <span>👍</span>
                        <span>Relatable</span>
                        <span className="opacity-75 tabular-nums">{postReactions.relatable}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReaction(post.id, 'beenThere')}
                        className={`px-2.5 py-1 rounded-xl text-[13px] font-medium leading-5 transition-all cursor-pointer flex items-center gap-1.5 ${userReacted[`${post.id}-beenThere`]
                          ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs'
                          : 'bg-[#F8F9FD] text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                      >
                        <span>🙋</span>
                        <span>Been there</span>
                        <span className="opacity-75 tabular-nums">{postReactions.beenThere}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReaction(post.id, 'support')}
                        className={`px-2.5 py-1 rounded-xl text-[13px] font-medium leading-5 transition-all cursor-pointer flex items-center gap-1.5 ${userReacted[`${post.id}-support`]
                          ? 'bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs'
                          : 'bg-[#F8F9FD] text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                      >
                        <span>❤️</span>
                        <span>Support</span>
                        <span className="opacity-75 tabular-nums">{postReactions.support}</span>
                      </button>
                    </div>

                    {/* Actions Bar: Upvote & Reply toggle */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleUpvote(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium leading-5 transition-all cursor-pointer ${post.userUpvoted
                            ? 'bg-[#5455EE] text-white shadow-xs'
                            : 'bg-[#F4F5FA] text-slate-700 hover:bg-[#EEF0FF] hover:text-[#5455EE] border border-[#EBECEF]'
                            }`}
                          title="Upvote this discussion"
                        >
                          <ThumbsUp size={14} className={post.userUpvoted ? 'fill-current' : ''} />
                          <span className="tabular-nums">{post.upvotes} Upvotes</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleReplies(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MessageSquare size={14} />
                          <span>{replyCount} Replies</span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-150 ${isRepliesOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Subtle Eko Suggestion Banner from Demo.md Section 3.3 */}
                    {(ekoPromptPostId === post.id || (showEkoPrompt && (ekoPromptPostId ? ekoPromptPostId === post.id : post.id === 'COM-1'))) && (
                      <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-r from-[#EEF0FF] via-[#F5F6FF] to-white border border-[#5455EE]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-3 duration-500 ease-out">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#5455EE] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#5455EE]/25">
                            <EchoLogo size={18} color="#FFFFFF" animated />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5455EE]">
                                Eko Assistant
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-[#5455EE]/15">
                                Confidential Support
                              </span>
                            </div>
                            <p className="text-xs text-slate-800 font-medium leading-relaxed mt-0.5">
                              {userRole === 'manager'
                                ? 'If you are observing workload imbalance or process friction across your team, you can share feedback with leadership or submit a confidential report.'
                                : 'If you have a similar concern or are experiencing workload friction, you may share feedback or submit an anonymous report'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap flex-shrink-0 self-start md:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              setShowEkoPrompt(false);
                              setEkoPromptPostId(null);
                              if (onNavigateToFeedback) onNavigateToFeedback('feedback');
                            }}
                            className="px-3.5 py-2 rounded-xl bg-white border border-[#5455EE]/30 hover:border-[#5455EE] text-[#5455EE] text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <MessageSquareHeart size={13} />
                            <span>Share Feedback</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowEkoPrompt(false);
                              setEkoPromptPostId(null);
                              if (onNavigateToFeedback) onNavigateToFeedback('report');
                            }}
                            className="px-4 py-2 rounded-xl bg-[#5455EE] hover:bg-[#4344dd] text-white text-xs font-bold transition-all shadow-md shadow-[#5455EE]/25 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <ShieldCheck size={13} />
                            <span>Submit Anonymous Report</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowEkoPrompt(false);
                              setEkoPromptPostId(null);
                            }}
                            className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Threaded Replies & Comment Input */}
                    {isRepliesOpen && (
                      <div className="mt-1 pt-3 border-t border-slate-100 flex flex-col gap-3 bg-[#F8F9FD] p-4 rounded-2xl">
                        {post.replies && post.replies.length > 0 && (
                          <div className="flex flex-col gap-2.5">

                            {post.replies.map((rep, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-3 bg-white rounded-xl border border-[#EBECEF] text-xs flex flex-col gap-1 shadow-2xs"
                              >
                                <div className="flex items-center justify-between text-slate-500">
                                  <div className="flex items-center gap-1.5">
                                    <User size={12} className="text-[#5455EE]" />
                                    <span className="font-bold text-slate-800">{rep.author}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">{rep.time}</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed mt-0.5 pl-4">{rep.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inline Reply Box */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }}
                          className="flex items-center gap-2 pt-2 border-t border-slate-200"
                        >
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            placeholder="Share an anonymous tip or reply..."
                            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white outline-none focus:border-[#5455EE] shadow-2xs"
                          />
                          <button
                            type="submit"
                            disabled={!commentInputs[post.id]?.trim()}
                            className="px-4 py-2.5 bg-[#5455EE] hover:bg-[#4344dd] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send size={12} />
                            <span>Reply</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* TAB 2: COMPANY ANNOUNCEMENTS (Only displays after HR post) */}
          {activeTab === 'announcements' && (
            <div className="flex flex-col gap-4">
              {!isPublished ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3.5 shadow-2xs">
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center shadow-xs">
                    <Megaphone size={26} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    No Company Announcements Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Official announcements are published here by HR to close the feedback loop, address workplace themes, and communicate systemic improvements.
                  </p>

                  <div className="mt-3 p-4 rounded-2xl bg-[#F8F9FD] border border-[#5455EE]/30 flex flex-col sm:flex-row items-center gap-3">
                    <div className="text-left text-xs">
                      <span className="font-bold text-slate-900 block">Demonstration Action:</span>
                      <span className="text-slate-500 text-[11px]">
                        Simulate HR publishing the official company-wide update.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPublished(true);
                        triggerToast('Official HR announcement published to Community Board.');
                      }}
                      className="px-4 py-2 bg-[#5455EE] hover:bg-[#4344dd] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Megaphone size={13} />
                      <span>Publish HR Announcement</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#EEF0FF]/90 via-white to-[#F8F9FE] border-2 border-[#5455EE]/30 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#5455EE] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Megaphone size={19} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">{announcement.author}</span>
                          <span className="text-[10px] font-extrabold text-[#5455EE] bg-white px-2.5 py-0.5 rounded-full border border-[#5455EE]/30 shadow-2xs">
                            {announcement.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Posted: {announcement.posted}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {announcement.acknowledged && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Acknowledged</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setIsPublished(false);
                          triggerToast('Announcement reverted to draft.');
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Revert to unpublished (demo reset)"
                      >
                        <RotateCcw size={13} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      {announcement.title}
                    </h4>
                    <div className="mt-3 flex flex-col gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        👋 <strong>Hello team!</strong> Thank you to everyone who participated in recent pulse check-ins and shared honest experiences in our Community Board. We heard your feedback on workload friction, unclear sprint priorities, and informal task handoffs.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-1">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <span>⚖️</span>
                            <span>1. Workload Allocation Audit</span>
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Reviewing squad capacity to ensure commitments are realistic. Unofficial task handoffs must be approved by squad leads.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-1">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <span>🎯</span>
                            <span>2. Clearer Task Briefs & Trade-offs</span>
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Standardized launch checklists. Managers must provide explicit trade-offs when conflicting priorities arise.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-1">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <span>🛡️</span>
                            <span>3. Protected Voice-Up Channels</span>
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Strengthened confidential reporting with verified anonymity. Asking for clarity or flagging workload is protected.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-1">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                            <span>📋</span>
                            <span>4. Transparent Tracking (AP-01)</span>
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Action plans are monitored by Head of Engineering and Senior HRBP. Bi-weekly progress updates will be posted here.
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs">
                        💡 <strong>Our commitment:</strong> You should never have to work silently late or carry ambiguous expectations alone. Let's build a supportive, sustainable workplace together! 🚀
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-[#5455EE]/15">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#5455EE]" />
                      Closing the loop: Organisational acknowledgement of employee feedback
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAcknowledgeAnnouncement}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${announcement.acknowledged
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-[#5455EE] hover:bg-[#4344dd] text-white shadow-xs'
                          }`}
                      >
                        <CheckCircle2 size={13} />
                        <span>{announcement.acknowledged ? 'Acknowledged ✓' : 'Acknowledge Update'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Community Intelligence Rail (Topic Filters, Privacy Notice, Trending Topics, Safety Guidelines) */}
        <div className="flex flex-col gap-5 w-full">
          {/* Topic Filters Tag Box placed directly above Community Safety & Privacy */}
          <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 shadow-card flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center">
                  <Filter size={13} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold leading-5 text-slate-900">Topic Filters</h4>
                  <span className="text-xs font-normal leading-[18px] text-slate-500">Filter peer discussions</span>
                </div>
              </div>
              {selectedTag !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedTag('all')}
                  className="text-xs font-medium leading-[18px] text-[#5455EE] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'Workload & Role Clarity', label: '🔥 Workload' },
                { id: 'Manager Support & Guidance', label: '💡 Managers' },
                { id: 'Recognition & Career Growth', label: '🌱 Growth' },
                { id: 'Collaboration & Change', label: '🤝 Team' },
              ].map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setSelectedTag(tag.id);
                    setActiveTab('discussions');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[13px] font-medium leading-5 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedTag === tag.id
                      ? 'bg-[#5455EE] text-white shadow-2xs'
                      : 'bg-[#F8F9FD] text-slate-600 hover:text-slate-900 border border-[#EBECEF] hover:border-[#5455EE]/30'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1. SEAMLESS PRIVACY & SAFETY RULES CARD (Fulfills Item 3: perfectly fitted in right rail) */}
          <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 shadow-card flex flex-col gap-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#5455EE] flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold leading-5 text-slate-900">Community Safety & Privacy</h4>
                <span className="text-xs font-normal leading-[18px] text-slate-500">Psychologically safe peer space</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Lock size={15} className="text-[#5455EE] flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-[22px] font-normal">
                  <strong className="font-medium text-slate-800">100% Anonymity:</strong> Names, employee IDs, and departments are stripped before publication.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Info size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-[22px] font-normal">
                  <strong className="font-medium text-slate-800">Constructive & Respectful:</strong> Focus on workload and process barriers. Do not post names or identifying peer details.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Compass size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-[22px] font-normal">
                  <strong className="font-medium text-slate-800">Need Urgent Support?</strong> For individual grievances, submit a confidential report directly to HR.
                </p>
              </div>
            </div>

            {onNavigateToFeedback && (
              <button
                type="button"
                onClick={onNavigateToFeedback}
                className="mt-1 w-full py-2 px-3 rounded-xl bg-[#F8F9FD] hover:bg-[#EEF0FF] border border-[#EBECEF] hover:border-[#5455EE]/30 text-[#5455EE] text-sm font-medium leading-5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Confidential Reporting</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* 2. TRENDING CONVERSATION THEMES */}
          <div className="bg-white border border-[#EBECEF] rounded-3xl p-5 shadow-card flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <TrendingUp size={15} className="text-[#5455EE]" />
              <h4 className="text-xs font-bold text-slate-900">Trending Peer Topics</h4>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { tag: 'Workload & Role Clarity', label: '#ConflictingDeadlines', count: '24 upvotes', heat: '🔥 High' },
                { tag: 'Recognition & Career Growth', label: '#UnacknowledgedOvertime', count: '11 upvotes', heat: '📈 Active' },
                { tag: 'Manager Support & Guidance', label: '#OneOnOneQuality', count: '8 upvotes', heat: '💬 3 replies' },
                { tag: 'Collaboration & Change', label: '#RemoteDecisionLag', count: '5 upvotes', heat: '💡 Solution' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveTab('discussions');
                    setSelectedTag(item.tag);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FD] border border-transparent hover:border-[#EBECEF] text-left transition-all cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#5455EE] transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.count}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                    {item.heat}
                  </span>
                </button>
              ))}
            </div>
          </div>


        </div>
      </div>



      {/* Modal for New Anonymous Post */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EBECEF] p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBECEF] mb-4">
              <div className="flex items-center gap-2">
                <User size={18} className="text-[#5455EE]" />
                <h3 className="text-base font-bold text-slate-900">
                  New Community Discussion
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
              <div className="p-3.5 rounded-2xl bg-[#EEF0FF] border border-[#5455EE]/20 text-xs text-slate-700 flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#5455EE] flex-shrink-0" />
                <span>
                  Posted as <strong>Anonymous Peer</strong>. Your name, department, and employee ID are never attached.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Topic Category</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="p-3 rounded-2xl border border-[#EBECEF] text-xs font-bold text-slate-800 bg-[#F4F5FA] outline-none focus:border-[#5455EE] cursor-pointer"
                >
                  <option value="Workload & Role Clarity">Workload & Role Clarity</option>
                  <option value="Manager Support & Guidance">Manager Support & Guidance</option>
                  <option value="Recognition & Career Growth">Recognition & Career Growth</option>
                  <option value="Collaboration & Change">Collaboration & Change</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Discussion Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Dealing with conflicting priorities without clear trade-offs :/"
                  className="p-3 rounded-2xl border border-[#EBECEF] text-sm text-slate-900 outline-none focus:border-[#5455EE] bg-[#F4F5FA] placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Message / Context</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details of your experience, questions, or tips for teammates..."
                  className="p-3 rounded-2xl border border-[#EBECEF] text-sm text-slate-900 outline-none focus:border-[#5455EE] bg-[#F4F5FA] placeholder:text-slate-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className="px-5 py-2.5 bg-[#5455EE] hover:bg-[#4344dd] disabled:opacity-40 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-[#5455EE]/20 cursor-pointer"
                >
                  Publish Anonymously
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
