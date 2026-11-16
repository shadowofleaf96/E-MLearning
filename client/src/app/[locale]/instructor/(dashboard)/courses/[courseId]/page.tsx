'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import {
  BookOpen,
  Settings,
  Plus,
  Save,
  Rocket,
  ChevronDown,
  // MoreVertical,
  Code,
  Edit,
  Paperclip,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  CloudUpload,
  Eye,
  Users,
  UserPlus,
  Trash2,
  Award,
  Sparkles,
  FileText,
  Calendar,
  // Check,
} from 'lucide-react';
import { InstructorAssignmentsPanel } from '@/modules/assignments/components/InstructorAssignmentsPanel';
import { aiClientService } from '@/modules/ai/services/ai.service';
import {
  gamificationService,
  BadgeData,
  XpConfig,
} from '@/modules/gamification/services/gamification.service';
import { coursesService } from '@/modules/courses/services/courses.service';
import { modulesService } from '@/modules/courses/services/modules.service';
import { lessonsService } from '@/modules/courses/services/lessons.service';
import { CurriculumBuilder } from '@/modules/courses/components/instructor/CurriculumBuilder';
import { examsService } from '@/modules/exams/services/exams.service';
import { uploadService } from '@/services/upload.service';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function CourseBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'editor' | 'resources' | 'settings'
  >('editor');

  const { currentTenant } = useAppSelector((state) => state.tenant);

  // Settings Modal
  const [isCourseSettingsModalOpen, setIsCourseSettingsModalOpen] =
    useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [coursePrice, setCoursePrice] = useState<number>(0);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  // Enrollment Modal
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [tenantStudents, setTenantStudents] = useState<any[]>([]);
  const [bulkEmails, setBulkEmails] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isFetchingEnrolled, setIsFetchingEnrolled] = useState(false);

  // Assignments Modal
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);

  // Selection state
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Gamification Modal
  const [isGamificationModalOpen, setIsGamificationModalOpen] = useState(false);
  const [xpConfig, setXpConfig] = useState<XpConfig>({
    moduleCompletionXp: 100,
    courseCompletionXp: 500,
    examPassXp: 200,
    dailyBonusXp: 100,
  });
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [isGamificationLoading, setIsGamificationLoading] = useState(false);
  const [isCreatingBadge, setIsCreatingBadge] = useState(false);
  const [newBadge, setNewBadge] = useState<Partial<BadgeData>>({
    title: '',
    description: '',
    icon: '🏆',
    color: '#FFD700',
    triggerType: 'module_completion',
    triggerValue: 1,
  });
  const [isSavingXp, setIsSavingXp] = useState(false);

  const fetchGamificationData = async () => {
    setIsGamificationLoading(true);
    try {
      const [xpRes, badgesRes] = await Promise.all([
        gamificationService.getXpConfig(courseId),
        gamificationService.getCourseBadges(courseId),
      ]);
      setXpConfig(xpRes.data);
      setBadges(badgesRes.data);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to load gamification settings'
      );
    } finally {
      setIsGamificationLoading(false);
    }
  };

  const handleSaveXpConfig = async () => {
    setIsSavingXp(true);
    try {
      await gamificationService.updateXpConfig(courseId, xpConfig);
      toast.success('XP settings saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save XP settings');
    } finally {
      setIsSavingXp(false);
    }
  };

  const handleCreateBadge = async () => {
    if (!newBadge.title) {
      toast.error('Badge title is required');
      return;
    }
    setIsCreatingBadge(true);
    try {
      const res = await gamificationService.createBadge(courseId, newBadge);
      setBadges((prev) => [...prev, res.data]);
      setNewBadge({
        title: '',
        description: '',
        icon: '🏆',
        color: '#FFD700',
        triggerType: 'module_completion',
        triggerValue: 1,
      });
      toast.success('Badge created successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create badge');
    } finally {
      setIsCreatingBadge(false);
    }
  };

  const handleDeleteBadge = async (badgeId: string) => {
    try {
      await gamificationService.deleteBadge(badgeId);
      setBadges((prev) => prev.filter((b) => b.id !== badgeId));
      toast.success('Badge deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete badge');
    }
  };

  // Editor state
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState('video');
  const [lessonText, setLessonText] = useState('');
  const [lessonContentUrl, setLessonContentUrl] = useState('');
  const [lessonDuration, setLessonDuration] = useState<number>(0);
  const [lessonPublishAt, setLessonPublishAt] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoSourceType, setVideoSourceType] = useState<'upload' | 'youtube'>(
    'upload'
  );
  const [youtubeTitle, setYoutubeTitle] = useState('Loading video title...');
  const [isAiDrafting, setIsAiDrafting] = useState(false);

  const handleAiDraftContent = async () => {
    if (!lessonTitle) {
      toast.warning('Please enter a lesson title first so AI knows what to write about.');
      return;
    }
    setIsAiDrafting(true);
    try {
      const res = await aiClientService.generateLessonContent({
        lessonTitle,
        lessonType,
        courseTitle: course?.title,
      });
      if (res && res.data?.content) {
        setLessonText(res.data.content);
        toast.success('AI lesson content drafted!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to draft AI content');
    } finally {
      setIsAiDrafting(false);
    }
  };

  const draftsRef = useRef<Record<string, any>>({});

  // Auto-save drafts as user types
  useEffect(() => {
    if (activeLessonId) {
      draftsRef.current[activeLessonId] = {
        title: lessonTitle,
        type: lessonType,
        text: lessonText,
        contentUrl: lessonContentUrl,
        duration: lessonDuration,
        videoSourceType,
      };
    }
  }, [
    lessonTitle,
    lessonType,
    lessonText,
    lessonContentUrl,
    lessonDuration,
    videoSourceType,
    activeLessonId,
  ]);

  useEffect(() => {
    // Immediately clear/set loading state when URL changes
    setYoutubeTitle('Loading video title...');

    const fetchYoutubeTitle = async () => {
      const videoId = getYoutubeVideoId(lessonContentUrl);
      if (videoId && videoSourceType === 'youtube') {
        try {
          const response = await fetch(`/api/youtube?id=${videoId}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          if (data.title) {
            setYoutubeTitle(data.title);
          } else {
            setYoutubeTitle('YouTube Video');
          }
        } catch (error) {
          setYoutubeTitle('YouTube Video');
        }
      } else {
        setYoutubeTitle('YouTube Video');
      }
    };

    const timeoutId = setTimeout(() => {
      fetchYoutubeTitle();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [lessonContentUrl, videoSourceType]);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById(
      'lesson-description-textarea'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = lessonText.substring(start, end);

    const newText =
      lessonText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      lessonText.substring(end);
    setLessonText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await coursesService.getCourse(courseId);
      setCourse(response.data);
      setCourseTitle(response.data.title);
      setCourseDescription(response.data.description || '');
      setCourseThumbnail(response.data.thumbnail || '');
      setCoursePrice(Number(response.data.price) || 0);

      // Auto-select first lesson
      const modules = response.data.modules || [];
      if (modules.length > 0) {
        const firstModule = modules[0];
        if (
          firstModule &&
          firstModule.lessons &&
          firstModule.lessons.length > 0 &&
          !activeLessonId
        ) {
          handleSelectLesson(firstModule.lessons[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  // Module Settings Modal
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleToEdit, setModuleToEdit] = useState<any>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [modulePublishAt, setModulePublishAt] = useState<string | null>(null);

  const handleAddModule = () => {
    setModuleToEdit(null);
    setModuleTitle('');
    setModuleDescription('');
    setModulePublishAt(null);
    setIsModuleModalOpen(true);
  };

  const handleEditModule = (module: any) => {
    setModuleToEdit(module);
    setModuleTitle(module.title);
    setModuleDescription(module.description || '');
    setModulePublishAt(module.publishAt || null);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async () => {
    if (!moduleTitle.trim()) {
      toast.error('Module title is required');
      return;
    }
    try {
      if (moduleToEdit) {
        await modulesService.updateModule(moduleToEdit.id, {
          title: moduleTitle,
          description: moduleDescription,
          publishAt: modulePublishAt || null,
        });
        toast.success('Module updated');
      } else {
        await modulesService.createModule({
          courseId,
          title: moduleTitle,
          description: moduleDescription,
          publishAt: modulePublishAt || null,
          orderIndex: course.modules?.length || 0,
        });
        toast.success('Module created');
      }
      setIsModuleModalOpen(false);
      fetchCourse();
    } catch (error) {
      toast.error('Failed to save module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this module? This will delete all its lessons and exams.'
      )
    )
      return;
    try {
      await modulesService.deleteModule(moduleId);
      toast.success('Module deleted');
      fetchCourse();
    } catch (error) {
      toast.error('Failed to delete module');
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    try {
      const moduleObj = course.modules.find((m: any) => m.id === moduleId);
      await lessonsService.createLesson({
        moduleId,
        title: 'New Lesson',
        type: 'video',
        orderIndex: moduleObj?.lessons?.length || 0,
      });
      toast.success('Lesson added');
      fetchCourse();
    } catch (error) {
      toast.error('Failed to add lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await lessonsService.deleteLesson(lessonId);
      toast.success('Lesson deleted');
      if (activeLessonId === lessonId) {
        setActiveLessonId(null);
      }
      fetchCourse();
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  const handleAddExam = async (moduleId: string) => {
    try {
      await examsService.createExam({
        moduleId,
        title: 'New Final Exam',
        type: 'qcm',
        passingScore: 70,
        durationMinutes: 60,
        maxAttempts: 3,
      });
      toast.success('Exam drafted');
      fetchCourse();
    } catch (error) {
      toast.error('Failed to add exam');
    }
  };

  const handleAddCodingChallenge = async (moduleId: string) => {
    try {
      await examsService.createExam({
        moduleId,
        title: 'New Coding Challenge',
        type: 'coding',
        passingScore: 70,
        durationMinutes: 60,
        maxAttempts: 3,
      });
      toast.success('Coding challenge drafted');
      fetchCourse();
    } catch (error) {
      toast.error('Failed to add coding challenge');
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!window.confirm('Are you sure you want to delete this exam/challenge?'))
      return;
    try {
      await examsService.deleteExam(examId);
      toast.success('Exam deleted');
      fetchCourse();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const handleSelectLesson = (lesson: any) => {
    setActiveLessonId(lesson.id);

    // Check for existing draft
    const draft = draftsRef.current[lesson.id];

    if (draft) {
      setLessonTitle(draft.title);
      setLessonType(draft.type);
      setLessonText(draft.text);
      setLessonContentUrl(draft.contentUrl);
      setLessonDuration(draft.duration);
      setVideoSourceType(draft.videoSourceType);
    } else {
      setLessonTitle(lesson.title || '');
      setLessonType(lesson.type || 'video');
      setLessonText(lesson.content || '');
      setLessonContentUrl(lesson.contentUrl || '');
      setLessonDuration(lesson.duration || 0);
      setLessonPublishAt(lesson.publishAt || null);

      if (lesson.type === 'video') {
        const isYouTube =
          lesson.contentUrl?.includes('youtube.com') ||
          lesson.contentUrl?.includes('youtu.be');
        setVideoSourceType(isYouTube ? 'youtube' : 'upload');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadService.uploadFile(file);
      setLessonContentUrl(url);
      toast.success('File uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!activeLessonId) return;
    try {
      await lessonsService.updateLesson(activeLessonId, {
        title: lessonTitle,
        type: lessonType,
        content: lessonText,
        contentUrl: lessonContentUrl,
        duration: lessonDuration,
        publishAt: lessonPublishAt || null,
      });
      toast.success('Lesson content saved');
      // Clear draft upon successful save
      delete draftsRef.current[activeLessonId];
      fetchCourse();
    } catch (error) {
      toast.error('Failed to save lesson content');
    }
  };

  const handleSaveCourseSettings = async () => {
    try {
      await coursesService.updateCourse(courseId, {
        title: courseTitle,
        description: courseDescription,
        thumbnail: courseThumbnail,
        price: currentTenant?.hasPaidCourses ? coursePrice : undefined,
      });
      toast.success('Course settings updated');
      setIsCourseSettingsModalOpen(false);
      fetchCourse();
    } catch (error) {
      toast.error('Failed to update course settings');
    }
  };

  const handlePublishToggle = async () => {
    try {
      await coursesService.publishCourse(courseId, !course?.isPublished);
      toast.success(
        course?.isPublished ? 'Course unpublished' : 'Course published!'
      );
      fetchCourse();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-primary">
        Loading...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center text-error">
        Course not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -mt-4 -mx-4 md:-mx-0 overflow-hidden bg-surface-bg text-on-surface font-body-md selection:bg-secondary/20 rounded-xl border border-border-subtle shadow-sm">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Sub-Header / Tool Bar */}
        <div className="bg-surface-container-lowest px-6 md:px-10 py-6 border-b border-border-subtle shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h2 className="font-headline-lg text-[32px] font-bold text-primary">
                    {course.title}
                  </h2>
                  {course.isPublished ? (
                    <span className="px-2 py-0.5 bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold rounded uppercase tracking-widest border border-on-tertiary-container/20">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-surface-container-high text-on-secondary-fixed-variant text-[10px] font-bold rounded uppercase tracking-widest border border-secondary/20">
                      Draft
                    </span>
                  )}
                </div>
                <nav className="flex items-center gap-2 mt-1 text-on-surface-variant text-body-sm">
                  <button
                    onClick={() => router.push('/instructor/courses')}
                    className="hover:underline"
                  >
                    My Courses
                  </button>
                  <ChevronRight size={16} />
                  <span className="text-secondary font-semibold">
                    Course Builder
                  </span>
                </nav>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCourseSettingsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container border border-border-subtle transition-all active:scale-95"
              >
                <Settings size={20} />
                <span className="text-[12px]">Course Settings</span>
              </button>
              <button
                onClick={() => {
                  setIsGamificationModalOpen(true);
                  fetchGamificationData();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container border border-border-subtle transition-all active:scale-95"
              >
                <Award size={20} />
                <span className="text-[12px]">Gamification</span>
              </button>
              <button
                onClick={async () => {
                  setIsEnrollmentModalOpen(true);
                  setIsFetchingEnrolled(true);
                  try {
                    const [enrolledRes, tenantRes] = await Promise.all([
                      coursesService.getEnrolledStudents(courseId),
                      coursesService.getTenantStudents(),
                    ]);
                    setEnrolledStudents(enrolledRes.data || []);
                    setTenantStudents(tenantRes.data || []);
                  } catch (err: any) {
                    toast.error(
                      err.response?.data?.message ||
                        'Failed to load enrollment data'
                    );
                  } finally {
                    setIsFetchingEnrolled(false);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container border border-border-subtle transition-all active:scale-95"
              >
                <Users size={20} />
                <span className="text-[12px]">
                  Students ({enrolledStudents.length || 0})
                </span>
              </button>
              <button
                onClick={() => setIsAssignmentsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container border border-border-subtle transition-all active:scale-95"
              >
                <FileText size={20} />
                <span className="text-[12px]">Assignments</span>
              </button>
              <button
                onClick={() =>
                  router.push(`/${locale}/student/course/${course.id}/learn`)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container border border-border-subtle transition-all active:scale-95"
              >
                <Eye size={20} />
                <span className="text-[12px]">Preview Course</span>
              </button>
              <button
                onClick={handlePublishToggle}
                className="flex items-center gap-2 px-6 py-2 bg-secondary text-white rounded-lg font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-95"
              >
                <Rocket
                  size={20}
                  fill="currentColor"
                  className="opacity-20 absolute"
                />
                <Rocket size={20} />
                <span className="text-[12px]">
                  {course.isPublished ? 'Unpublish' : 'Publish'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Builder Workspace */}
        <div className="flex-1 p-8 flex gap-8 min-h-0 overflow-hidden bg-surface-bg">
          {/* Left Column: Curriculum Navigator */}
          <aside className="w-[380px] flex flex-col bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-sm shrink-0 min-h-0">
            <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-surface-bright rounded-t-2xl">
              <h3 className="font-bold text-primary text-[18px]">
                Course Curriculum
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-surface-container-lowest/50">
              <CurriculumBuilder
                courseId={courseId}
                modules={course.modules || []}
                onUpdate={fetchCourse}
                onAddModule={handleAddModule}
                onEditModule={handleEditModule}
                onDeleteModule={handleDeleteModule}
                onAddLesson={handleAddLesson}
                onEditLesson={handleSelectLesson}
                onDeleteLesson={handleDeleteLesson}
                onAddExam={handleAddExam}
                onAddCodingChallenge={handleAddCodingChallenge}
                onEditExam={(exam) =>
                  router.push(
                    `/instructor/courses/${courseId}/exam-builder/${exam.id}`
                  )
                }
                onDeleteExam={handleDeleteExam}
              />
            </div>
          </aside>

          {/* Right Column: Lesson Workspace */}
          <section className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-sm overflow-hidden min-h-0">
            {activeLessonId ? (
              <>
                {/* Workspace Tabs */}
                <div className="flex bg-surface-bright border-b border-border-subtle shrink-0">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-8 py-4 font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'editor' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
                  >
                    <Edit size={20} />
                    Lesson Editor
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-8 py-4 font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'resources' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
                  >
                    <Paperclip size={20} />
                    Resources
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-8 py-4 font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
                  >
                    <Settings size={20} />
                    Lesson Settings
                  </button>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-surface-container-lowest">
                  {activeTab === 'editor' && (
                    <>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-2">
                          <label className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-wider">
                            Lesson Title
                          </label>
                          <input
                            className="w-full text-[24px] font-bold p-3 border-b-2 border-border-subtle focus:border-primary outline-none transition-all bg-transparent text-primary focus:bg-surface-container-low rounded-t-lg"
                            type="text"
                            value={lessonTitle}
                            onChange={(e) => setLessonTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-wider">
                            Lesson Type
                          </label>
                          <div className="relative">
                            <select
                              value={lessonType}
                              onChange={(e) => setLessonType(e.target.value)}
                              className="w-full p-3 bg-surface-bg border border-border-subtle rounded-xl appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium transition-all"
                            >
                              <option value="video">Video Content</option>
                              <option value="text">Text Lesson</option>
                              <option value="pdf">PDF Document</option>
                            </select>
                            <ChevronDown
                              size={20}
                              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline-variant"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-wider">
                          Rich Text Description
                        </label>
                        <div className="border border-border-subtle rounded-xl overflow-hidden shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                          <div className="bg-surface-bright p-2 border-b border-border-subtle flex gap-1">
                            <button
                              onClick={() => insertFormatting('**', '**')}
                              className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <Bold size={18} />
                            </button>
                            <button
                              onClick={() => insertFormatting('_', '_')}
                              className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <Italic size={18} />
                            </button>
                            <button
                              onClick={() => insertFormatting('- ')}
                              className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <List size={18} />
                            </button>
                            <div className="w-px h-6 bg-border-subtle mx-1 my-auto"></div>
                            <button
                              onClick={() =>
                                insertFormatting('[', '](https://)')
                              }
                              className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <LinkIcon size={18} />
                            </button>
                            <button
                              onClick={() => insertFormatting('`', '`')}
                              className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <Code size={18} />
                            </button>
                            <div className="h-4 w-px bg-border-subtle mx-1 self-center" />
                            <button
                              type="button"
                              onClick={handleAiDraftContent}
                              disabled={isAiDrafting}
                              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all border border-secondary/30 ml-auto"
                              title="Generate comprehensive lesson content using AI"
                            >
                              <Sparkles size={14} className={isAiDrafting ? 'animate-spin' : ''} />
                              {isAiDrafting ? 'Drafting...' : '✨ AI Draft Article'}
                            </button>
                          </div>
                          <textarea
                            id="lesson-description-textarea"
                            className="w-full p-4 min-h-40 bg-surface-bg outline-none text-body-md focus:bg-surface-container-lowest transition-colors resize-y"
                            placeholder="Describe what students will learn in this lesson..."
                            value={lessonText}
                            onChange={(e) => setLessonText(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Media Source Toggle & Input */}
                      {lessonType === 'video' && (
                        <div className="flex gap-4 mb-4">
                          <button
                            onClick={() => setVideoSourceType('upload')}
                            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all border ${
                              videoSourceType === 'upload'
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-surface-bright text-on-surface-variant border-border-subtle hover:bg-surface-container-low'
                            }`}
                          >
                            Upload File
                          </button>
                          <button
                            onClick={() => setVideoSourceType('youtube')}
                            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all border ${
                              videoSourceType === 'youtube'
                                ? 'bg-[#FF0000] text-white border-[#FF0000] shadow-sm'
                                : 'bg-surface-bright text-on-surface-variant border-border-subtle hover:bg-surface-container-low'
                            }`}
                          >
                            YouTube Link
                          </button>
                        </div>
                      )}

                      {lessonType === 'video' &&
                      videoSourceType === 'youtube' ? (
                        <div className="space-y-2 mb-6">
                          <label className="font-semibold text-[12px] text-on-surface-variant uppercase tracking-wider">
                            YouTube Video URL
                          </label>
                          <Input
                            placeholder="e.g. https://www.youtube.com/watch?v=..."
                            value={lessonContentUrl}
                            onChange={(e) =>
                              setLessonContentUrl(e.target.value)
                            }
                            className="bg-surface-bg border-border-subtle focus:ring-secondary text-primary"
                          />
                          {lessonContentUrl &&
                            getYoutubeVideoId(lessonContentUrl) && (
                              <div className="mt-4 flex items-center gap-4 p-4 border border-border-subtle rounded-xl bg-surface-container-lowest">
                                <img
                                  src={`https://img.youtube.com/vi/${getYoutubeVideoId(lessonContentUrl)}/mqdefault.jpg`}
                                  alt="YouTube Thumbnail"
                                  className="w-32 h-20 object-cover rounded-lg border border-border-subtle shadow-sm"
                                />
                                <div className="overflow-hidden">
                                  <p className="font-bold text-primary text-sm line-clamp-2">
                                    {youtubeTitle}
                                  </p>
                                  <p className="text-xs text-on-surface-variant mt-1 truncate">
                                    {lessonContentUrl}
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      ) : (
                        <label
                          className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-4 transition-all cursor-pointer ${isUploading ? 'border-primary bg-primary/5' : 'border-border-subtle bg-surface-bright hover:border-primary hover:bg-surface-container-low group'}`}
                        >
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            accept={
                              lessonType === 'video'
                                ? 'video/mp4,video/webm'
                                : 'application/pdf'
                            }
                          />
                          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                            <CloudUpload
                              size={32}
                              className={`transition-colors ${isUploading ? 'text-primary animate-pulse' : 'text-on-surface-variant group-hover:text-primary'}`}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-primary text-[18px]">
                              {isUploading
                                ? 'Uploading...'
                                : 'Upload Lesson Media'}
                            </p>
                            <p className="text-sm text-on-surface-variant mt-1">
                              {lessonContentUrl &&
                              !lessonContentUrl.includes('youtube.com') &&
                              !lessonContentUrl.includes('youtu.be') ? (
                                <span className="text-secondary font-medium">
                                  File uploaded! Click to replace.
                                </span>
                              ) : (
                                'Click or drag and drop to upload.'
                              )}
                            </p>
                          </div>
                        </label>
                      )}
                    </>
                  )}

                  {activeTab === 'resources' && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-primary text-[18px]">
                        Lesson Resources
                      </h4>
                      <div className="space-y-2">
                        <label className="font-semibold text-[12px] text-on-surface-variant">
                          Resource Link / Document URL
                        </label>
                        <input
                          className="w-full p-3 bg-surface-bg border border-border-subtle rounded-lg focus:ring-2 focus:ring-secondary/20 outline-none text-primary"
                          type="text"
                          placeholder="Paste PDF link, Zip file link, or resource website here..."
                          value={lessonContentUrl}
                          onChange={(e) => setLessonContentUrl(e.target.value)}
                        />
                        <p className="text-xs text-on-surface-variant">
                          Students can download or access this resource directly
                          inside the course player.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-primary text-[18px]">
                        Lesson Settings
                      </h4>
                      <div className="space-y-2">
                        <label className="font-semibold text-[12px] text-on-surface-variant">
                          Duration (Minutes)
                        </label>
                        <input
                          className="w-full p-3 bg-surface-bg border border-border-subtle rounded-lg focus:ring-2 focus:ring-secondary/20 outline-none text-primary"
                          type="number"
                          min="0"
                          value={lessonDuration}
                          onChange={(e) =>
                            setLessonDuration(parseInt(e.target.value) || 0)
                          }
                        />
                        <p className="text-xs text-on-surface-variant">
                          Establishes the estimated time for completion shown to
                          the student.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="font-semibold text-[12px] text-on-surface-variant flex items-center gap-1.5">
                          <Calendar size={14} /> Release Date & Time (Drip Release)
                        </label>
                        <input
                          className="w-full p-3 bg-surface-bg border border-border-subtle rounded-lg focus:ring-2 focus:ring-secondary/20 outline-none text-primary"
                          type="datetime-local"
                          value={lessonPublishAt ? new Date(lessonPublishAt).toISOString().slice(0, 16) : ''}
                          onChange={(e) =>
                            setLessonPublishAt(e.target.value ? new Date(e.target.value).toISOString() : null)
                          }
                        />
                        <p className="text-xs text-on-surface-variant">
                          Optionally lock this lesson until this date and time. Leave empty to make it immediately available upon sequence unlock.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Actions */}
                <div className="p-4 flex justify-end gap-4 border-t border-border-subtle bg-surface-bright shrink-0">
                  <button
                    onClick={() => {
                      const allLessons = course.modules.flatMap(
                        (m: any) => m.lessons || []
                      );
                      const match = allLessons.find(
                        (l: any) => l.id === activeLessonId
                      );
                      if (match) handleSelectLesson(match);
                    }}
                    className="px-6 py-2 rounded-lg font-semibold text-on-surface-variant hover:bg-surface-container transition-all"
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={handleSaveLesson}
                    className="px-8 py-2 bg-secondary text-white rounded-lg font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Save size={18} /> Save Lesson Content
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-outline-variant">
                <BookOpen size={64} className="opacity-20 mb-4" />
                <p className="text-lg font-semibold">
                  Select a lesson to start editing
                </p>
                <p className="text-sm mt-2">
                  Or add a new module and lesson from the sidebar.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Course Settings Modal */}
      <Dialog
        open={isCourseSettingsModalOpen}
        onOpenChange={setIsCourseSettingsModalOpen}
      >
        <DialogContent className="sm:max-w-125 bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              Course Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-on-surface font-semibold">
                Course Title
              </Label>
              <Input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="bg-surface-bg border-border-subtle focus:ring-secondary text-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-on-surface font-semibold">
                Description
              </Label>
              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="w-full bg-surface-bg border border-border-subtle focus:ring-2 focus:ring-secondary outline-none text-primary rounded-md p-3 min-h-25"
              />
            </div>
            {currentTenant?.hasPaidCourses && (
              <div className="space-y-2">
                <Label className="text-on-surface font-semibold">
                  Course Price (MAD)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full border-border-subtle bg-surface-bg text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all p-3 pl-12 rounded-xl outline-none"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-bold text-sm">
                    MAD
                  </span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-on-surface font-semibold">
                Course Thumbnail Image
              </Label>
              <div className="flex items-center gap-4">
                {courseThumbnail ? (
                  <img
                    src={courseThumbnail}
                    alt="Thumbnail"
                    className="w-24 h-24 object-cover rounded-lg border border-border-subtle"
                  />
                ) : (
                  <div className="w-24 h-24 bg-surface-container rounded-lg border border-border-subtle flex items-center justify-center text-outline-variant">
                    No Image
                  </div>
                )}
                <label
                  className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${isUploadingThumbnail ? 'bg-surface-container text-on-surface-variant' : 'bg-secondary/10 text-secondary hover:bg-secondary/20'}`}
                >
                  {isUploadingThumbnail ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isUploadingThumbnail}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setIsUploadingThumbnail(true);
                        const url = await uploadService.uploadFile(file);
                        setCourseThumbnail(url);
                        toast.success('Thumbnail uploaded');
                      } catch (error: any) {
                        toast.error(
                          error.response?.data?.message ||
                            'Failed to upload image'
                        );
                      } finally {
                        setIsUploadingThumbnail(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              onClick={() => setIsCourseSettingsModalOpen(false)}
              className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCourseSettings}
              className="px-4 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Module Settings Modal */}
      <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
        <DialogContent className="sm:max-w-125 bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              {moduleToEdit ? 'Edit Module' : 'Create Module'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-on-surface font-semibold">
                Module Title
              </Label>
              <Input
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="e.g. Introduction to React"
                className="bg-surface-bg border-border-subtle focus:ring-secondary text-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-on-surface font-semibold">
                Module Description
              </Label>
              <textarea
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                placeholder="Brief description of what students will learn in this module..."
                className="w-full bg-surface-bg border border-border-subtle focus:ring-2 focus:ring-secondary outline-none text-primary rounded-md p-3 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-on-surface font-semibold flex items-center gap-1.5">
                <Calendar size={14} /> Scheduled Release Date (Drip Content)
              </Label>
              <Input
                type="datetime-local"
                value={modulePublishAt ? new Date(modulePublishAt).toISOString().slice(0, 16) : ''}
                onChange={(e) =>
                  setModulePublishAt(e.target.value ? new Date(e.target.value).toISOString() : null)
                }
                className="bg-surface-bg border-border-subtle focus:ring-secondary text-primary"
              />
              <p className="text-xs text-on-surface-variant">
                Optionally restrict access to all lessons in this module until this date and time. Leave empty for normal progression.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              onClick={() => setIsModuleModalOpen(false)}
              className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveModule}
              className="px-4 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignments & Grading Modal */}
      <Dialog
        open={isAssignmentsModalOpen}
        onOpenChange={setIsAssignmentsModalOpen}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
              <FileText size={22} className="text-secondary" />
              Course Assignments & Submissions
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <InstructorAssignmentsPanel
              courseId={courseId}
              modules={course?.modules || []}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Enrollment Management Modal */}
      <Dialog
        open={isEnrollmentModalOpen}
        onOpenChange={setIsEnrollmentModalOpen}
      >
        <DialogContent className="sm:max-w-160 bg-surface-card border-border-subtle">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
              <Users size={22} className="text-secondary" />
              Manage Course Enrollment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Enroll New Student Section */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle space-y-4">
              <Label className="text-on-surface font-semibold text-sm flex items-center gap-2">
                <UserPlus size={16} className="text-secondary" />
                Bulk Enroll Students
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A: Pick existing tenant student */}
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs text-on-surface-variant font-medium">
                    Select from registered tenant students:
                  </label>
                  {tenantStudents.length > 0 ? (
                    <div className="border border-border-subtle rounded-lg bg-surface-bg p-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {tenantStudents.map((st) => {
                        const isAlreadyEnrolled = enrolledStudents.some(
                          (es) => es.studentId === st.id
                        );
                        return (
                          <label
                            key={st.id}
                            className={`flex items-center gap-2 text-sm text-on-surface p-2 rounded-lg hover:bg-surface-container cursor-pointer ${isAlreadyEnrolled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <input
                              type="checkbox"
                              disabled={isAlreadyEnrolled}
                              checked={selectedStudentIds.includes(st.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudentIds((prev) => [
                                    ...prev,
                                    st.id,
                                  ]);
                                } else {
                                  setSelectedStudentIds((prev) =>
                                    prev.filter((id) => id !== st.id)
                                  );
                                }
                              }}
                              className="rounded border-border-subtle text-secondary focus:ring-secondary accent-secondary"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {st.firstName} {st.lastName}
                              </span>
                              <span className="text-xs text-on-surface-variant">
                                {st.email}
                              </span>
                            </div>
                            {isAlreadyEnrolled && (
                              <span className="text-[10px] text-secondary ml-auto font-bold uppercase">
                                Enrolled
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-on-surface-variant italic p-2 border border-border-subtle rounded-lg">
                      No students registered in this tenant yet.
                    </div>
                  )}
                </div>

                {/* Option B: Enter email address */}
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs text-on-surface-variant font-medium">
                    Or enter student emails (comma separated):
                  </label>
                  <textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="student1@example.com, student2@example.com"
                    className="bg-surface-bg border border-border-subtle rounded-lg focus:ring-2 focus:ring-secondary text-primary w-full p-3 flex-1 resize-none text-sm outline-none"
                  />
                </div>
              </div>

              <button
                disabled={
                  isEnrolling ||
                  (selectedStudentIds.length === 0 && !bulkEmails.trim())
                }
                onClick={async () => {
                  setIsEnrolling(true);
                  try {
                    const emails = bulkEmails
                      .split(',')
                      .map((e) => e.trim())
                      .filter(Boolean);
                    const res = await coursesService.bulkEnrollStudents(
                      courseId,
                      { emails, studentIds: selectedStudentIds }
                    );

                    if (res.data?.errors?.length > 0) {
                      toast.warning(
                        `Enrolled some, but had errors: ${res.data.errors[0]}`,
                        { autoClose: 5000 }
                      );
                    } else {
                      toast.success('Students enrolled successfully!');
                    }

                    setBulkEmails('');
                    setSelectedStudentIds([]);
                    // Refresh list
                    const listRes =
                      await coursesService.getEnrolledStudents(courseId);
                    setEnrolledStudents(listRes.data || []);
                  } catch (err: any) {
                    toast.error(
                      err.response?.data?.message || 'Failed to enroll students'
                    );
                  } finally {
                    setIsEnrolling(false);
                  }
                }}
                className="px-4 py-2.5 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full mt-2"
              >
                {isEnrolling
                  ? 'Enrolling...'
                  : `Enroll Selected Students (${selectedStudentIds.length + (bulkEmails.trim() ? bulkEmails.split(',').filter((e) => e.trim()).length : 0)})`}
              </button>
            </div>

            {/* Enrolled Students List */}
            <div className="space-y-3">
              <h4 className="font-semibold text-on-surface text-sm">
                Enrolled Students ({enrolledStudents.length})
              </h4>
              {isFetchingEnrolled ? (
                <div className="p-8 text-center text-on-surface-variant text-sm">
                  Loading enrolled students...
                </div>
              ) : enrolledStudents.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant/60 border border-dashed border-border-subtle rounded-xl text-sm">
                  No students enrolled in this course yet.
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {enrolledStudents.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-surface-bg rounded-xl border border-border-subtle hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-sm">
                          {item.student?.firstName?.[0] || 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface text-sm">
                            {item.student?.firstName} {item.student?.lastName}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {item.student?.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (
                            !confirm(
                              `Are you sure you want to remove ${item.student?.firstName} from this course?`
                            )
                          )
                            return;
                          try {
                            await coursesService.unenrollStudent(
                              courseId,
                              item.studentId
                            );
                            toast.success('Student unenrolled.');
                            setEnrolledStudents((prev) =>
                              prev.filter((s) => s.id !== item.id)
                            );
                          } catch (err: any) {
                            toast.error(
                              err.response?.data?.message ||
                                'Failed to unenroll'
                            );
                          }
                        }}
                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Unenroll student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border-subtle">
            <button
              onClick={() => setIsEnrollmentModalOpen(false)}
              className="px-5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gamification Modal */}
      <Dialog
        open={isGamificationModalOpen}
        onOpenChange={setIsGamificationModalOpen}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-surface-bg border-border-subtle max-h-[90vh] flex flex-col rounded-2xl">
          <DialogHeader className="p-6 border-b border-border-subtle bg-surface-bright flex flex-row items-center justify-between shrink-0">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary">
              <Award className="text-secondary" size={24} />
              Gamification Settings
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface-container-lowest/50">
            {isGamificationLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-on-surface-variant">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p>Loading gamification settings...</p>
              </div>
            ) : (
              <>
                {/* XP Config Section */}
                <section className="bg-surface-bright rounded-2xl border border-border-subtle p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">
                        XP Configuration
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        Set custom XP rewards for this course
                      </p>
                    </div>
                    <button
                      onClick={handleSaveXpConfig}
                      disabled={isSavingXp}
                      className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2 hover:bg-primary-hover disabled:opacity-50 transition-colors"
                    >
                      {isSavingXp ? 'Saving...' : 'Save XP Config'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-on-surface-variant">
                        Module Completion XP
                      </Label>
                      <Input
                        type="number"
                        value={xpConfig.moduleCompletionXp}
                        onChange={(e) =>
                          setXpConfig({
                            ...xpConfig,
                            moduleCompletionXp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-surface-container-lowest border-border-subtle h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-on-surface-variant">
                        Course Completion XP
                      </Label>
                      <Input
                        type="number"
                        value={xpConfig.courseCompletionXp}
                        onChange={(e) =>
                          setXpConfig({
                            ...xpConfig,
                            courseCompletionXp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-surface-container-lowest border-border-subtle h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-on-surface-variant">
                        Exam Pass XP
                      </Label>
                      <Input
                        type="number"
                        value={xpConfig.examPassXp}
                        onChange={(e) =>
                          setXpConfig({
                            ...xpConfig,
                            examPassXp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-surface-container-lowest border-border-subtle h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-on-surface-variant">
                        Daily Bonus XP (Default)
                      </Label>
                      <Input
                        type="number"
                        value={xpConfig.dailyBonusXp}
                        onChange={(e) =>
                          setXpConfig({
                            ...xpConfig,
                            dailyBonusXp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-surface-container-lowest border-border-subtle h-11"
                      />
                    </div>
                  </div>
                </section>

                {/* Badges Section */}
                <section className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">
                      Course Badges
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Create badges that students can earn in this course
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Create Badge Form */}
                    <div className="bg-surface-bright rounded-2xl border border-border-subtle p-6 shadow-sm flex flex-col h-full">
                      <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                        <Plus size={18} />
                        Create New Badge
                      </h4>
                      <div className="space-y-4 flex-1">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-on-surface-variant">
                            Title
                          </Label>
                          <Input
                            placeholder="e.g. Speed Runner"
                            value={newBadge.title}
                            onChange={(e) =>
                              setNewBadge({
                                ...newBadge,
                                title: e.target.value,
                              })
                            }
                            className="bg-surface-container-lowest border-border-subtle"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-on-surface-variant">
                            Description (Optional)
                          </Label>
                          <Input
                            placeholder="e.g. Complete 5 modules in one day"
                            value={newBadge.description}
                            onChange={(e) =>
                              setNewBadge({
                                ...newBadge,
                                description: e.target.value,
                              })
                            }
                            className="bg-surface-container-lowest border-border-subtle"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-on-surface-variant">
                              Icon
                            </Label>
                            <select
                              value={newBadge.icon}
                              onChange={(e) =>
                                setNewBadge({
                                  ...newBadge,
                                  icon: e.target.value,
                                })
                              }
                              className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 text-on-surface text-lg"
                            >
                              {[
                                '🏆',
                                '🎯',
                                '🔥',
                                '⭐',
                                '💎',
                                '🎓',
                                '📚',
                                '🥇',
                                '🥈',
                                '🥉',
                                '🎖️',
                                '🏅',
                                '🌟',
                                '💡',
                                '🚀',
                                '🎨',
                                '🧠',
                                '📖',
                                '✅',
                                '🔓',
                                '💪',
                                '🎉',
                                '🎪',
                                '🏁',
                                '📊',
                                '🔬',
                                '🎵',
                                '🎮',
                                '🛡️',
                                '👑',
                              ].map((icon) => (
                                <option key={icon} value={icon}>
                                  {icon}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-on-surface-variant">
                              Color
                            </Label>
                            <input
                              type="color"
                              value={newBadge.color}
                              onChange={(e) =>
                                setNewBadge({
                                  ...newBadge,
                                  color: e.target.value,
                                })
                              }
                              className="w-full h-10 p-1 bg-surface-container-lowest border border-border-subtle rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-on-surface-variant">
                              Trigger Type
                            </Label>
                            <select
                              value={newBadge.triggerType}
                              onChange={(e) =>
                                setNewBadge({
                                  ...newBadge,
                                  triggerType: e.target.value,
                                })
                              }
                              className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 text-sm text-on-surface"
                            >
                              <option value="module_completion">
                                Module Completion
                              </option>
                              <option value="course_completion">
                                Course Completion
                              </option>
                              <option value="xp_threshold">XP Threshold</option>
                              <option value="exam_pass">Exam Pass Score</option>
                              <option value="streak_milestone">
                                Streak Milestone
                              </option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-on-surface-variant">
                              Trigger Value
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              value={newBadge.triggerValue}
                              onChange={(e) =>
                                setNewBadge({
                                  ...newBadge,
                                  triggerValue: parseInt(e.target.value) || 1,
                                })
                              }
                              className="bg-surface-container-lowest border-border-subtle"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleCreateBadge}
                        disabled={isCreatingBadge || !newBadge.title}
                        className="w-full mt-6 py-3 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50"
                      >
                        {isCreatingBadge ? 'Creating...' : 'Create Badge'}
                      </button>
                    </div>

                    {/* Badges List */}
                    <div className="bg-surface-bright rounded-2xl border border-border-subtle p-6 shadow-sm h-full flex flex-col">
                      <h4 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                        <Award size={18} className="text-secondary" />
                        Existing Badges ({badges.length})
                      </h4>
                      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 min-h-[300px]">
                        {badges.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-on-surface-variant text-sm p-6 text-center opacity-70">
                            <Award size={48} className="mb-4 opacity-50" />
                            <p>No badges created yet.</p>
                            <p>Create one to start motivating your students!</p>
                          </div>
                        ) : (
                          badges.map((badge) => (
                            <div
                              key={badge.id}
                              className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-border-subtle hover:border-primary/30 transition-colors group"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm"
                                  style={{
                                    backgroundColor: `${badge.color}20`,
                                    border: `1px solid ${badge.color}50`,
                                  }}
                                >
                                  {badge.icon}
                                </div>
                                <div>
                                  <h5 className="font-bold text-on-surface text-sm">
                                    {badge.title}
                                  </h5>
                                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">
                                    {badge.triggerType.replace('_', ' ')}:{' '}
                                    {badge.triggerValue}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteBadge(badge.id)}
                                className="p-2 text-error/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete badge"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ChevronRight icon component since it wasn't imported from lucide-react in the block above
function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
