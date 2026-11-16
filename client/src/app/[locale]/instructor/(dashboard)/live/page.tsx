'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Video,
  History,
  // HelpCircle,
  // Bell,
  // MoreVertical,
  // ChevronRight,
  Play,
  Trash2,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { liveService, LiveSession } from '@/modules/live/services/live.service';
import { coursesService } from '@/modules/courses/services/courses.service';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InstructorLiveSessionsPage() {
  const router = useRouter();

  // Data State
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [submitting, setSubmitting] = useState(false);

  // Search State
  const searchQuery = '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Live Sessions
      const res = await liveService.getSessions();
      setSessions(res.data || []);

      // Fetch Instructor Courses for Scheduling Select
      const coursesRes = await coursesService.getCourses();
      setCourses(coursesRes.data || []);
    } catch (error) {
      toast.error('Failed to load live sessions data');
    } finally {
      setLoading(false);
    }
  };

  // Load modules when course is selected in the schedule modal
  const handleCourseChange = async (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedModuleId('');
    if (!courseId) {
      setModules([]);
      return;
    }
    try {
      const courseDetail = await coursesService.getCourse(courseId);
      setModules(courseDetail.data.modules || []);
    } catch (error) {
      toast.error('Failed to load course modules');
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !sessionTitle ||
      !selectedCourseId ||
      !selectedModuleId ||
      !scheduledAt ||
      !durationMinutes
    ) {
      toast.warn('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await liveService.createSession({
        title: sessionTitle,
        moduleId: selectedModuleId,
        scheduledAt,
        durationMinutes,
      });

      toast.success('Live session scheduled successfully!');
      setIsScheduleModalOpen(false);

      // Reset Form
      setSessionTitle('');
      setSelectedCourseId('');
      setSelectedModuleId('');
      setScheduledAt('');
      setDurationMinutes(60);

      fetchData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to schedule live session'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled session?'))
      return;
    try {
      await liveService.deleteSession(sessionId);
      toast.success('Session cancelled');
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel session');
    }
  };

  const handleStartSession = async (session: LiveSession) => {
    try {
      // Mark session as active in backend
      await liveService.updateSession(session.id, { isActive: true });
      // Join session participant count
      await liveService.joinSession(session.id);
      // Navigate to full-screen live workspace
      router.push(`/live/${session.id}`);
    } catch (error) {
      toast.error('Failed to initialize session workspace');
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingSessions = filteredSessions.filter((s) => {
    const isPast =
      new Date(s.scheduledAt).getTime() + s.durationMinutes * 60000 <
      Date.now();
    return !isPast;
  });

  const pastSessions = filteredSessions.filter((s) => {
    const isPast =
      new Date(s.scheduledAt).getTime() + s.durationMinutes * 60000 <
      Date.now();
    return isPast;
  });

  // KPI Calculations
  const todaySessionsCount = sessions.filter((s) => {
    const schedDate = new Date(s.scheduledAt).toDateString();
    const todayDate = new Date().toDateString();
    return schedDate === todayDate;
  }).length;

  const totalMinutes = sessions.reduce((acc, s) => {
    const isPast =
      new Date(s.scheduledAt).getTime() + s.durationMinutes * 60000 <
      Date.now();
    return isPast ? acc + s.durationMinutes : acc;
  }, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  return (
    <div className="flex-1 max-w-container-max mx-auto w-full p-6 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle/30 pb-6">
        <div>
          <h2 className="text-[32px] font-bold font-headline-lg text-primary tracking-tight">
            Live Session Management
          </h2>
          <p className="text-on-surface-variant text-body-md mt-1">
            Schedule, manage, and review your interactive classes.
          </p>
        </div>
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm self-start"
        >
          <Plus size={20} />
          Schedule New Session
        </button>
      </div>

      {/* Dashboard Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Scheduled Today Card */}
          <div className="bg-surface-card rounded-xl p-6 border border-border-subtle flex items-center justify-between group hover:border-secondary transition-colors">
            <div>
              <p className="text-[12px] font-semibold text-outline uppercase tracking-wider">
                Scheduled Today
              </p>
              <p className="text-[48px] text-primary mt-2 font-bold leading-none">
                {todaySessionsCount}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
              <Calendar size={24} />
            </div>
          </div>
          {/* Total Hours Card */}
          <div className="bg-surface-card rounded-xl p-6 border border-border-subtle flex items-center justify-between group hover:border-secondary transition-colors">
            <div>
              <p className="text-[12px] font-semibold text-outline uppercase tracking-wider">
                Total Hours Taught
              </p>
              <p className="text-[48px] text-primary mt-2 font-bold leading-none">
                {totalHours}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center text-xp-gold group-hover:bg-xp-gold group-hover:text-white transition-colors">
              <Clock size={24} />
            </div>
          </div>
        </div>

        {/* Attendance Overview Widget */}
        <div className="lg:col-span-8 bg-surface-card rounded-xl border border-border-subtle p-6 flex flex-col hover:border-secondary transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-primary">
              Attendance Overview
            </h3>
            <div className="px-3 py-1 bg-surface-container-low rounded-full border border-border-subtle text-on-surface-variant text-[12px] font-semibold flex items-center gap-1 cursor-pointer">
              Last 30 Days
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-36 mt-auto relative">
            <div className="w-full flex justify-between items-end h-full pt-4">
              <div className="w-[10%] bg-secondary-container/20 rounded-t-md h-[40%] hover:bg-secondary-container transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  65%
                </div>
              </div>
              <div className="w-[10%] bg-secondary-container/40 rounded-t-md h-[60%] hover:bg-secondary-container transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  72%
                </div>
              </div>
              <div className="w-[10%] bg-secondary-container/60 rounded-t-md h-[80%] hover:bg-secondary-container transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  85%
                </div>
              </div>
              <div className="w-[10%] bg-secondary rounded-t-md h-[95%] hover:bg-secondary-container transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  95%
                </div>
              </div>
              <div className="w-[10%] bg-secondary-container/50 rounded-t-md h-[70%] hover:bg-secondary-container transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  78%
                </div>
              </div>
              <div className="w-[10%] bg-secondary-container/80 rounded-t-md h-[88%] hover:bg-secondary-container transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  90%
                </div>
              </div>
              <div className="w-[10%] bg-secondary rounded-t-md h-[100%] hover:bg-secondary-container transition-colors relative group cursor-pointer">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  98%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          <Video className="text-secondary" />
          Upcoming Sessions
        </h3>
        <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-container-lowest">
                  <th className="py-4 px-6 text-[12px] font-bold text-outline uppercase tracking-wider">
                    Session Info
                  </th>
                  <th className="py-4 px-6 text-[12px] font-bold text-outline uppercase tracking-wider">
                    Course
                  </th>
                  <th className="py-4 px-6 text-[12px] font-bold text-outline uppercase tracking-wider">
                    Date &amp; Time
                  </th>
                  <th className="py-4 px-6 text-[12px] font-bold text-outline uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8">
                      <LoadingSpinner size="md" />
                    </td>
                  </tr>
                ) : upcomingSessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-outline italic"
                    >
                      No upcoming live sessions scheduled. Click "Schedule New
                      Session" to create one.
                    </td>
                  </tr>
                ) : (
                  upcomingSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-surface-container-low transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <p className="font-semibold text-primary">
                          {session.title}
                        </p>
                        <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-1">
                          <Users size={14} className="text-outline" />{' '}
                          {session.participants?.length || 0} Registered
                        </p>
                      </td>
                      <td className="py-4 px-6 text-sm text-primary">
                        {session.module?.course?.title || 'General Development'}
                      </td>
                      <td className="py-4 px-6 text-sm text-primary">
                        <div>
                          {new Date(session.scheduledAt).toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            }
                          )}
                        </div>
                        <span className="text-secondary text-xs font-semibold">
                          Duration: {session.durationMinutes} mins
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleStartSession(session)}
                          className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-sm text-sm"
                        >
                          <Play size={16} fill="currentColor" />
                          Start
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-error hover:bg-error/5 p-2 rounded-lg transition-colors inline-flex items-center"
                          title="Cancel Session"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Past Sessions */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          <History className="text-outline" />
          Past Sessions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <LoadingSpinner size="md" />
          ) : pastSessions.length === 0 ? (
            <div className="col-span-full bg-surface-card border border-border-subtle rounded-xl p-8 text-center text-outline italic">
              No past sessions recorded.
            </div>
          ) : (
            pastSessions.map((session) => (
              <div
                key={session.id}
                className="bg-surface-card rounded-xl border border-border-subtle p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold rounded">
                    {new Date(session.scheduledAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <CheckCircle className="text-emerald-500" size={20} />
                </div>
                <h4 className="text-md font-semibold text-primary mb-1 truncate">
                  {session.title}
                </h4>
                <p className="text-sm text-on-surface-variant mb-4 truncate">
                  {session.module?.course?.title || 'General Development'}
                </p>

                <div className="bg-surface-container-low rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-on-surface-variant">
                      Attendance
                    </span>
                    <span className="text-xs font-bold text-primary">88%</span>
                  </div>
                  <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: '88%' }}
                    ></div>
                  </div>
                </div>
                <button className="w-full bg-surface hover:bg-surface-container border border-border-subtle text-primary font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm">
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Schedule Live Session Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              Schedule Live Session
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleSession} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-on-surface font-semibold">
                Session Title
              </Label>
              <Input
                placeholder="e.g. Introduction to React Hooks"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                required
                className="bg-surface-bg border-border-subtle focus:ring-secondary text-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-on-surface font-semibold">
                Select Course
              </Label>
              <select
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                required
                className="w-full bg-surface-bg border border-border-subtle focus:ring-2 focus:ring-secondary outline-none text-primary rounded-md p-2.5 text-sm font-medium"
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-on-surface font-semibold">
                Select Module
              </Label>
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                required
                disabled={!selectedCourseId}
                className="w-full bg-surface-bg border border-border-subtle focus:ring-2 focus:ring-secondary outline-none text-primary rounded-md p-2.5 text-sm font-medium disabled:opacity-50"
              >
                <option value="">-- Select Module --</option>
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-on-surface font-semibold">
                  Scheduled Date &amp; Time
                </Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                  className="bg-surface-bg border-border-subtle focus:ring-secondary text-primary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-on-surface font-semibold">
                  Duration (Minutes)
                </Label>
                <Input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  required
                  min={15}
                  max={240}
                  className="bg-surface-bg border-border-subtle focus:ring-secondary text-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition-colors text-sm disabled:opacity-50"
              >
                {submitting ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
