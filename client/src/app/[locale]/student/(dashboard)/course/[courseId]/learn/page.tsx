'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourses } from '@/modules/courses/hooks/useCourses';
import { progressService } from '@/modules/courses/services/progress.service';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { StudentExamEngine } from '@/modules/exams/components/student/StudentExamEngine';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useGamificationStats } from '@/modules/gamification/hooks/useGamificationStats';
import { CourseDiscussionsTab } from '@/modules/discussions/components/CourseDiscussionsTab';
import { ModuleAssignmentViewer } from '@/modules/assignments/components/ModuleAssignmentViewer';

type TabState =
  | 'overview'
  | 'resources'
  | 'notes'
  | 'discussions'
  | 'assignments';

const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function StudentLearnPage() {
  const params = useParams();
  const router = useRouter();
  const { currentCourse, loading, error, loadCourseDetail } = useCourses();
  const { user } = useAuth();
  const { data: gamification } = useGamificationStats();
  const courseId = params.courseId as string;

  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeExam, setActiveExam] = useState<any>(null);
  const [activeModule, setActiveModule] = useState<any>(null);
  const [checkedLessons, setCheckedLessons] = useState<Set<string>>(new Set());
  const [overallProgress, setOverallProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<TabState>('overview');
  const [lessonNote, setLessonNote] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimeCompleted, setIsTimeCompleted] = useState<boolean>(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Lesson duration countdown timer
  useEffect(() => {
    if (!activeLesson) return;

    const isChecked = checkedLessons.has(activeLesson.id);
    if (isChecked) {
      setIsTimeCompleted(true);
      setTimeRemaining(0);
      return;
    }

    const targetSeconds =
      activeLesson.duration && activeLesson.duration > 0
        ? activeLesson.duration * 60
        : 0;

    if (targetSeconds <= 0) {
      setIsTimeCompleted(true);
      setTimeRemaining(0);
      return;
    }

    const savedElapsed = parseInt(
      localStorage.getItem(`lesson_time_${courseId}_${activeLesson.id}`) || '0',
      10
    );
    const initialRemaining = Math.max(0, targetSeconds - savedElapsed);
    setTimeRemaining(initialRemaining);
    setIsTimeCompleted(initialRemaining <= 0);

    if (initialRemaining <= 0) return;

    let elapsed = savedElapsed;
    const interval = setInterval(() => {
      elapsed += 1;
      localStorage.setItem(
        `lesson_time_${courseId}_${activeLesson.id}`,
        elapsed.toString()
      );
      const rem = Math.max(0, targetSeconds - elapsed);
      setTimeRemaining(rem);
      if (rem <= 0) {
        setIsTimeCompleted(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeLesson?.id, checkedLessons, courseId]);

  useEffect(() => {
    if (courseId) {
      loadCourseDetail(courseId);
    }
  }, [courseId, loadCourseDetail]);

  useEffect(() => {
    if (
      currentCourse &&
      currentCourse.modules &&
      currentCourse.modules.length > 0 &&
      !activeLesson &&
      !activeExam
    ) {
      const firstModuleWithLessons = currentCourse.modules.find(
        (m: any) => m.isLocked !== true && m.lessons && m.lessons.length > 0
      );
      if (firstModuleWithLessons && firstModuleWithLessons.lessons) {
        setActiveLesson(firstModuleWithLessons.lessons[0]);
        setActiveModule(firstModuleWithLessons);
      }
    }
  }, [currentCourse, activeLesson, activeExam]);

  // Load note from server (fallback to localStorage) when active lesson changes
  useEffect(() => {
    if (activeLesson && courseId) {
      progressService
        .getStudentNotes(courseId)
        .then((res) => {
          if (res?.data) {
            const found = res.data.find(
              (n: any) => n.lessonId === activeLesson.id
            );
            if (found) {
              setLessonNote(found.content);
              return;
            }
          }
          const key = `note_${courseId}_${activeLesson.id}`;
          const saved = localStorage.getItem(key);
          setLessonNote(saved || '');
        })
        .catch(() => {
          const key = `note_${courseId}_${activeLesson.id}`;
          const saved = localStorage.getItem(key);
          setLessonNote(saved || '');
        });
    } else {
      setLessonNote('');
    }
  }, [activeLesson, courseId]);

  // Load database-backed lesson progress and sync with local state
  useEffect(() => {
    if (courseId) {
      progressService
        .getCourseLessonProgress(courseId)
        .then((res) => {
          if (res?.data && res.data.length > 0) {
            const serverCompleted = new Set<string>();
            res.data.forEach((item: any) => {
              if (item.completed) serverCompleted.add(item.lessonId);
            });
            setCheckedLessons((prev) => {
              const merged = new Set([
                ...Array.from(prev),
                ...Array.from(serverCompleted),
              ]);
              localStorage.setItem(
                `course_${courseId}_completed_lessons`,
                JSON.stringify(Array.from(merged))
              );
              return merged;
            });
          }
        })
        .catch((err) => {
          console.error('Failed to load server lesson progress', err);
        });
    }
  }, [courseId]);

  useEffect(() => {
    if (currentCourse && currentCourse.modules) {
      const saved = localStorage.getItem(
        `course_${courseId}_completed_lessons`
      );
      let initialChecked = new Set<string>();

      if (saved) {
        initialChecked = new Set(JSON.parse(saved));
      } else {
        currentCourse.modules.forEach((mod: any) => {
          if (mod.progress?.progressPercentage > 0 && mod.lessons) {
            const numCompleted = Math.round(
              (mod.progress.progressPercentage / 100) * mod.lessons.length
            );
            for (let i = 0; i < numCompleted; i++) {
              initialChecked.add(mod.lessons[i].id);
            }
          }
        });
      }
      setCheckedLessons((prev) => {
        const merged = new Set([
          ...Array.from(prev),
          ...Array.from(initialChecked),
        ]);
        return merged;
      });

      let totalLessons = 0;
      let completedCount = 0;
      currentCourse.modules.forEach((mod: any) => {
        if (mod.lessons) {
          totalLessons += mod.lessons.length;
          completedCount += mod.lessons.filter((l: any) =>
            initialChecked.has(l.id)
          ).length;
        }
      });
      setOverallProgress(
        totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
      );
    }
  }, [currentCourse, courseId]);

  const handleCheckLesson = async (
    lessonId: string,
    moduleId: string,
    isChecked: boolean,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    if (!currentCourse || !currentCourse.modules) return;

    const newSet = new Set(checkedLessons);
    if (isChecked) newSet.add(lessonId);
    else newSet.delete(lessonId);

    setCheckedLessons(newSet);
    localStorage.setItem(
      `course_${courseId}_completed_lessons`,
      JSON.stringify(Array.from(newSet))
    );

    // Persist lesson progress to server
    try {
      await progressService.updateLessonProgress(lessonId, {
        completed: isChecked,
      });
    } catch (err) {
      console.error('Failed to persist lesson progress on server', err);
    }

    const mod = currentCourse.modules.find((m: any) => m.id === moduleId);
    if (mod && mod.lessons) {
      const total = mod.lessons.length;
      const checkedCount = mod.lessons.filter((l: any) =>
        newSet.has(l.id)
      ).length;
      const percentage = Math.round((checkedCount / total) * 100);
      const completed = percentage === 100;

      try {
        await progressService.updateProgress(
          courseId,
          moduleId,
          percentage,
          completed
        );
        if (completed) {
          toast.success('Module completed! Next module unlocked.');
          await loadCourseDetail(courseId);
        }
      } catch (error) {
        console.error('Failed to update progress', error);
      }
    }

    let totalLessons = 0;
    let completedCount = 0;
    currentCourse?.modules?.forEach((m: any) => {
      if (m.lessons) {
        totalLessons += m.lessons.length;
        completedCount += m.lessons.filter((l: any) => newSet.has(l.id)).length;
      }
    });
    setOverallProgress(
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    );
  };

  const handleNextLesson = () => {
    if (!activeModule || !currentCourse?.modules) return;

    if (activeLesson && !checkedLessons.has(activeLesson.id)) {
      if (!isTimeCompleted) {
        toast.warning(
          `Please complete the required lesson time (${formatTime(timeRemaining)} remaining) before proceeding.`
        );
      } else {
        toast.warning(
          'Please click "Mark as Complete" before proceeding to the next lesson.'
        );
      }
      return;
    }

    // Find index of current module
    const mIdx = currentCourse.modules.findIndex(
      (m: any) => m.id === activeModule.id
    );
    if (mIdx === -1) return;

    // Check if we are in a lesson
    if (activeLesson) {
      const lIdx = activeModule.lessons.findIndex(
        (l: any) => l.id === activeLesson.id
      );
      if (lIdx < activeModule.lessons.length - 1) {
        setActiveLesson(activeModule.lessons[lIdx + 1]);
        setActiveExam(null);
      } else if (activeModule.exams && activeModule.exams.length > 0) {
        // Go to first exam in module
        setActiveLesson(null);
        setActiveExam(activeModule.exams[0]);
      } else if (mIdx < currentCourse.modules.length - 1) {
        // Next module
        const nextMod = currentCourse.modules[mIdx + 1];
        if (
          !nextMod.isLocked &&
          nextMod.lessons &&
          nextMod.lessons.length > 0
        ) {
          setActiveModule(nextMod);
          setActiveLesson(nextMod.lessons[0]);
          setActiveExam(null);
        } else {
          toast.info('Next module is locked or empty.');
        }
      } else {
        toast.success('You have reached the end of the course!');
      }
    }
    // Check if we are in an exam
    else if (activeExam) {
      const eIdx = activeModule.exams.findIndex(
        (e: any) => e.id === activeExam.id
      );
      if (eIdx < activeModule.exams.length - 1) {
        setActiveExam(activeModule.exams[eIdx + 1]);
      } else if (mIdx < currentCourse.modules.length - 1) {
        const nextMod = currentCourse.modules[mIdx + 1];
        if (
          !nextMod.isLocked &&
          nextMod.lessons &&
          nextMod.lessons.length > 0
        ) {
          setActiveModule(nextMod);
          setActiveLesson(nextMod.lessons[0]);
          setActiveExam(null);
        } else {
          toast.info('Next module is locked or empty.');
        }
      } else {
        toast.success('You have reached the end of the course!');
      }
    }
  };

  if (loading || (!currentCourse && !error)) {
    return <LoadingSpinner size="lg" fullScreen />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-bg flex-col gap-4">
        <h2 className="text-xl font-bold text-error">Failed to load course</h2>
        <p className="text-on-surface-variant">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!currentCourse) return null;

  // Find module indexes for display
  let currentModuleIndex = 1;
  let currentLessonIndex = 1;
  let totalModuleLessons = 0;

  if (activeModule) {
    currentModuleIndex =
      (currentCourse.modules || []).findIndex(
        (m: any) => m.id === activeModule.id
      ) + 1;
    if (activeLesson) {
      currentLessonIndex =
        (activeModule.lessons || []).findIndex(
          (l: any) => l.id === activeLesson.id
        ) + 1;
    }
    totalModuleLessons = (activeModule.lessons || []).length;
  }

  const isLessonDripLocked = Boolean(
    (activeModule?.publishAt &&
      new Date(activeModule.publishAt) > new Date()) ||
    (activeLesson?.publishAt && new Date(activeLesson.publishAt) > new Date())
  );
  const dripUnlockDate = activeLesson?.publishAt
    ? new Date(activeLesson.publishAt)
    : activeModule?.publishAt
      ? new Date(activeModule.publishAt)
      : null;

  return (
    <div className="w-full bg-surface-bg font-body-md text-on-surface h-screen overflow-hidden flex flex-col">
      {/* Top Navigation Anchor */}
      <header className="flex-shrink-0 flex justify-between items-center px-margin-desktop w-full h-16 bg-surface border-b border-border-subtle z-50">
        <div className="flex items-center gap-8">
          <span className="text-headline-md font-headline-lg text-secondary font-bold tracking-tight">
            Lumina Learning
          </span>
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => router.push('/student/dashboard')}
              className="text-on-surface-variant font-medium font-label-md hover:text-secondary transition-colors"
            >
              Dashboard
            </button>
            <span className="text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md">
              My Learning
            </span>
            <button
              onClick={() => router.push('/student/courses')}
              className="text-on-surface-variant font-medium font-label-md hover:text-secondary transition-colors"
            >
              Course Catalog
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container px-3 py-1.5 rounded-full">
            <span
              className="material-symbols-outlined text-xp-gold text-[20px] mr-1"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
            <span className="font-code-sm text-on-surface font-bold">
              {gamification ? `${gamification.xp} XP` : '0 XP'}
            </span>
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left SideNavBar (Platform Nav) */}
        <aside className="w-72 bg-surface-container-low border-r border-border-subtle hidden xl:flex flex-col p-4 flex-shrink-0">
          <div className="mb-8 p-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <p className="font-label-md text-on-surface font-bold capitalize">
                  {user
                    ? `${user.firstName} ${user.lastName}`
                    : 'Lumina Student'}
                </p>
                <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  {user?.role === 'student'
                    ? 'Student Plan'
                    : 'Pro Plan Member'}
                </p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <button
              onClick={() => router.push('/student/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md"
            >
              <span className="material-symbols-outlined">dashboard</span>
              Home
            </button>
            <button
              onClick={() => router.push('/student/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-semibold border-l-4 border-secondary rounded-r-lg transition-transform scale-[0.98] font-label-md"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                menu_book
              </span>
              My Courses
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md">
              <span className="material-symbols-outlined">military_tech</span>
              Achievements
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-surface-bg p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto pb-20">
            {/* Breadcrumbs & Header */}
            <nav className="flex items-center gap-2 text-on-surface-variant font-label-md mb-4 flex-wrap">
              <span>Courses</span>
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
              <span>{currentCourse.title}</span>
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
              <span className="text-secondary font-semibold">
                {activeLesson?.title || activeExam?.title}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                  {activeLesson?.title ||
                    activeExam?.title ||
                    'Welcome to the course'}
                </h1>
                <p className="text-on-surface-variant font-body-md">
                  Module {currentModuleIndex} •{' '}
                  {activeExam
                    ? 'Exam'
                    : `Lesson ${currentLessonIndex} of ${totalModuleLessons}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push(`/student/courses/${courseId}`)}
                  className="flex items-center gap-2 px-4 py-2 text-on-surface-variant font-semibold border border-outline-variant rounded-lg hover:bg-surface-container transition-all font-label-md"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>{' '}
                  Exit
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={
                    activeLesson && !checkedLessons.has(activeLesson.id)
                  }
                  className={`flex items-center gap-2 px-5 py-2 font-bold rounded-lg transition-all transform active:scale-95 font-label-md ${
                    activeLesson && !checkedLessons.has(activeLesson.id)
                      ? 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed opacity-60'
                      : 'bg-secondary text-white hover:shadow-lg'
                  }`}
                  title={
                    activeLesson && !checkedLessons.has(activeLesson.id)
                      ? 'Complete the current lesson time and mark as complete before advancing'
                      : 'Next Lesson'
                  }
                >
                  Next Lesson{' '}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-md text-on-surface-variant font-bold">
                  COURSE PROGRESS
                </span>
                <span className="font-code-sm text-secondary font-bold">
                  {overallProgress}% COMPLETE
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Video/Content Player Section */}
            <div className="mb-8">
              {activeExam ? (
                <div className="w-full min-h-[60vh] bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-sm overflow-hidden p-4">
                  <StudentExamEngine
                    examId={activeExam.id}
                    onExamCompleted={() => {
                      toast.success('Exam completed!');
                      loadCourseDetail(courseId);
                    }}
                  />
                </div>
              ) : activeLesson ? (
                isLessonDripLocked ? (
                  <div className="w-full aspect-video flex flex-col items-center justify-center bg-surface-container-high rounded-[16px] border border-border-subtle p-8 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-4xl">
                        schedule
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-xl font-bold text-on-surface">
                        Scheduled Release
                      </h3>
                      <p className="text-on-surface-variant max-w-md mt-2 text-sm leading-relaxed">
                        This content is scheduled to unlock on{' '}
                        <span className="font-semibold text-secondary">
                          {dripUnlockDate
                            ? dripUnlockDate.toLocaleString()
                            : 'a future date'}
                        </span>
                        . Please check back then!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-video rounded-[16px] overflow-hidden bg-black shadow-xl group border border-outline-variant/20">
                    {activeLesson.type === 'video' &&
                    activeLesson.contentUrl ? (
                      (() => {
                        const ytId = getYoutubeVideoId(activeLesson.contentUrl);
                        const embedSrc = ytId
                          ? `https://www.youtube.com/embed/${ytId}`
                          : activeLesson.contentUrl;
                        return (
                          <iframe
                            src={embedSrc}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            title={activeLesson.title}
                          />
                        );
                      })()
                    ) : activeLesson.type === 'pdf' &&
                      activeLesson.contentUrl ? (
                      <iframe
                        src={activeLesson.contentUrl}
                        className="w-full h-full bg-white"
                        title={activeLesson.title}
                      />
                    ) : activeLesson.type === 'text' ? (
                      <div className="w-full h-full bg-white p-8 overflow-y-auto text-on-surface">
                        <div className="prose max-w-none">
                          {activeLesson.content || 'No text content provided.'}
                        </div>
                      </div>
                    ) : activeLesson.type === 'link' ? (
                      <div className="w-full h-full bg-surface-container flex flex-col items-center justify-center space-y-6">
                        <div className="p-4 bg-secondary/10 rounded-full">
                          <span className="material-symbols-outlined text-secondary text-5xl">
                            link
                          </span>
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-on-surface mb-2">
                            External Resource
                          </h3>
                          <p className="text-on-surface-variant max-w-md">
                            This lesson contains an external link. Click the
                            button below to open it securely in a new tab.
                          </p>
                        </div>
                        {activeLesson.contentUrl && (
                          <button
                            onClick={() =>
                              window.open(activeLesson.contentUrl, '_blank')
                            }
                            className="px-6 py-3 bg-secondary hover:bg-secondary-container text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
                          >
                            Open Link{' '}
                            <span className="material-symbols-outlined">
                              open_in_new
                            </span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-white/50 text-5xl mb-4">
                          movie
                        </span>
                        <p className="text-white/50 font-medium">
                          Content loading or unavailable.
                        </p>
                      </div>
                    )}

                    {/* Complete Button Overlay inside content if text/link type to mirror designs - but typically handled below */}
                  </div>
                )
              ) : (
                <div className="w-full aspect-video flex flex-col items-center justify-center bg-surface-container rounded-[16px] border border-border-subtle">
                  <p className="text-on-surface-variant font-body-lg">
                    Select a lesson from the curriculum to begin.
                  </p>
                </div>
              )}
            </div>

            {/* Completion Actions */}
            {activeLesson && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-border-subtle mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      checkedLessons.has(activeLesson.id)
                        ? 'bg-tertiary-fixed-dim/30 text-on-tertiary-fixed'
                        : isTimeCompleted
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {checkedLessons.has(activeLesson.id)
                        ? 'check_circle'
                        : isTimeCompleted
                          ? 'schedule'
                          : 'hourglass_top'}
                    </span>
                  </div>
                  <div>
                    <p className="font-label-md font-bold text-on-surface">
                      {isLessonDripLocked
                        ? 'Lesson Locked'
                        : checkedLessons.has(activeLesson.id)
                          ? 'Lesson Completed'
                          : isTimeCompleted
                            ? 'Time Requirement Fulfilled'
                            : 'Lesson in Progress'}
                    </p>
                    <p className="text-[12px] text-on-surface-variant">
                      {isLessonDripLocked
                        ? `This lesson will unlock on ${dripUnlockDate ? dripUnlockDate.toLocaleString() : 'scheduled date'}.`
                        : checkedLessons.has(activeLesson.id)
                          ? 'You have finished this lesson. Click continue to advance.'
                          : isTimeCompleted
                            ? 'You can now mark this lesson as complete.'
                            : `Please complete the required time (${formatTime(timeRemaining)} remaining) to unlock completion.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end shrink-0">
                  {checkedLessons.has(activeLesson.id) ? (
                    <button
                      onClick={handleNextLesson}
                      className="px-6 py-3 font-bold rounded-lg transition-all flex items-center gap-2 bg-secondary text-white hover:bg-secondary-container hover:shadow-md active:scale-95 font-label-md"
                    >
                      <span>Continue</span>
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </button>
                  ) : (
                    <button
                      disabled={!isTimeCompleted || isLessonDripLocked}
                      onClick={(e) =>
                        handleCheckLesson(
                          activeLesson.id,
                          activeModule.id,
                          true,
                          e
                        )
                      }
                      className={`px-6 py-3 font-bold rounded-lg transition-all flex items-center gap-2 ${
                        isTimeCompleted && !isLessonDripLocked
                          ? 'bg-secondary text-white hover:bg-secondary-container hover:shadow-md cursor-pointer active:scale-95'
                          : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed border border-border-subtle'
                      }`}
                    >
                      {isTimeCompleted ? (
                        <>
                          <span className="material-symbols-outlined text-[18px]">
                            check_circle
                          </span>
                          Mark as Complete
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">
                            progress_activity
                          </span>
                          Mark as Complete ({formatTime(timeRemaining)})
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tabs Section */}
            <div className="bg-surface-container-lowest rounded-[16px] border border-border-subtle p-1">
              <div className="flex border-b border-border-subtle mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-8 py-4 font-label-md whitespace-nowrap transition-all ${activeTab === 'overview' ? 'text-secondary border-b-2 border-secondary font-bold' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-8 py-4 font-label-md whitespace-nowrap transition-all ${activeTab === 'resources' ? 'text-secondary border-b-2 border-secondary font-bold' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                >
                  Resources
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-8 py-4 font-label-md whitespace-nowrap transition-all ${activeTab === 'notes' ? 'text-secondary border-b-2 border-secondary font-bold' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`px-8 py-4 font-label-md whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'discussions' ? 'text-secondary border-b-2 border-secondary font-bold' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    forum
                  </span>
                  Discussions & Q&A
                </button>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`px-8 py-4 font-label-md whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'assignments' ? 'text-secondary border-b-2 border-secondary font-bold' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    assignment
                  </span>
                  Assignments
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="p-6">
                  <h3 className="font-headline-md text-on-surface mb-4">
                    About this lesson
                  </h3>
                  <p className="text-on-surface-variant font-body-md leading-relaxed mb-6 whitespace-pre-wrap">
                    {activeLesson?.content ||
                      'No description provided for this lesson yet.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                      <span className="material-symbols-outlined text-secondary mb-2">
                        play_circle
                      </span>
                      <p className="font-label-md font-bold text-on-surface">
                        Format
                      </p>
                      <p className="text-[13px] text-on-surface-variant uppercase">
                        {activeLesson?.type || 'Standard'}
                      </p>
                    </div>
                    {activeLesson?.duration > 0 && (
                      <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                        <span className="material-symbols-outlined text-secondary mb-2">
                          timer
                        </span>
                        <p className="font-label-md font-bold text-on-surface">
                          Duration
                        </p>
                        <p className="text-[13px] text-on-surface-variant">
                          {activeLesson.duration} min
                        </p>
                      </div>
                    )}
                    <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                      <span className="material-symbols-outlined text-secondary mb-2">
                        folder
                      </span>
                      <p className="font-label-md font-bold text-on-surface">
                        Module
                      </p>
                      <p className="text-[13px] text-on-surface-variant truncate">
                        {activeModule?.title || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="p-6">
                  {activeLesson?.contentUrl && activeLesson.type !== 'text' ? (
                    <div className="space-y-3">
                      <p className="text-sm text-on-surface-variant mb-4">
                        Resources attached to this lesson:
                      </p>
                      <a
                        href={activeLesson.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-surface-container-low border border-border-subtle rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-secondary">
                            {activeLesson.type === 'video'
                              ? 'smart_display'
                              : activeLesson.type === 'pdf'
                                ? 'picture_as_pdf'
                                : 'link'}
                          </span>
                          <div>
                            <p className="font-label-md font-bold text-on-surface">
                              {activeLesson.title} — Source
                            </p>
                            <p className="text-[12px] text-on-surface-variant capitalize">
                              {activeLesson.type} resource
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant">
                          open_in_new
                        </span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-3 opacity-40">
                        folder_off
                      </span>
                      <p className="text-sm">
                        No additional resources for this lesson.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="p-6">
                  <div className="border border-border-subtle rounded-xl overflow-hidden">
                    <div className="bg-surface-container-low px-4 py-2 border-b border-border-subtle flex items-center justify-between">
                      <div className="flex gap-4">
                        <button className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-on-surface">
                          format_bold
                        </button>
                        <button className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-on-surface">
                          format_italic
                        </button>
                        <button className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-on-surface">
                          format_list_bulleted
                        </button>
                      </div>
                      {lessonNote && (
                        <span className="text-[11px] text-on-surface-variant italic">
                          Draft saved locally
                        </span>
                      )}
                    </div>
                    <textarea
                      className="w-full h-40 p-4 font-body-md focus:ring-secondary border-none resize-none placeholder:text-on-surface-variant/40 outline-none bg-transparent"
                      placeholder="Type your personal lesson notes here..."
                      value={lessonNote}
                      onChange={(e) => setLessonNote(e.target.value)}
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={async () => {
                        if (activeLesson && courseId) {
                          try {
                            await progressService.saveStudentNote(
                              courseId,
                              lessonNote,
                              activeLesson.id
                            );
                            const key = `note_${courseId}_${activeLesson.id}`;
                            localStorage.setItem(key, lessonNote);
                            toast.success('Note saved to your account!');
                          } catch (err) {
                            const key = `note_${courseId}_${activeLesson.id}`;
                            localStorage.setItem(key, lessonNote);
                            toast.warning('Note saved locally.');
                          }
                        }
                      }}
                      className="px-6 py-2 bg-secondary text-white font-bold rounded-lg font-label-md hover:bg-secondary-container transition-colors active:scale-95"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'discussions' && (
                <CourseDiscussionsTab
                  courseId={courseId}
                  currentLessonId={activeLesson?.id}
                  currentLessonTitle={activeLesson?.title}
                />
              )}

              {activeTab === 'assignments' && (
                <div className="p-6">
                  <ModuleAssignmentViewer
                    moduleId={activeLesson?.moduleId || activeModule?.id || ''}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right SideNavBar (Curriculum) */}
        <aside className="w-80 bg-surface-container-lowest border-l border-border-subtle hidden lg:flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-border-subtle bg-surface flex-shrink-0">
            <h2
              className="font-headline-md text-[18px] text-on-surface font-bold mb-1 truncate"
              title={currentCourse.title}
            >
              {currentCourse.title}
            </h2>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">
                history_edu
              </span>
              <p className="font-body-sm text-[12px]">
                {checkedLessons.size} lessons complete
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {currentCourse.modules?.map((mod: any, mIdx: number) => (
              <div key={mod.id} className="mb-8">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                  Module {mIdx + 1}: {mod.title}
                </p>
                <div className="space-y-2">
                  {mod.lessons?.map((lesson: any, lIdx: number) => {
                    const isChecked = checkedLessons.has(lesson.id);
                    const isActive = activeLesson?.id === lesson.id;
                    const isDripScheduled = Boolean(
                      (mod.publishAt && new Date(mod.publishAt) > new Date()) ||
                      (lesson.publishAt &&
                        new Date(lesson.publishAt) > new Date())
                    );
                    const isLessonLocked =
                      mod.isLocked === true ||
                      isDripScheduled ||
                      (lIdx > 0 &&
                        !checkedLessons.has(mod.lessons[lIdx - 1].id));

                    if (isLessonLocked) {
                      const dripDate = lesson.publishAt
                        ? new Date(lesson.publishAt)
                        : mod.publishAt
                          ? new Date(mod.publishAt)
                          : null;
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (isDripScheduled && dripDate) {
                              toast.info(
                                `Scheduled release on ${dripDate.toLocaleString()}`
                              );
                            } else if (mod.isLocked) {
                              toast.info(
                                'Complete previous modules to unlock this module.'
                              );
                            } else {
                              toast.info(
                                `Please complete "${mod.lessons[lIdx - 1]?.title}" first.`
                              );
                            }
                          }}
                          className="flex items-start gap-3 p-3 rounded-lg opacity-50 grayscale transition-all cursor-not-allowed hover:bg-surface-container-low"
                          title={
                            isDripScheduled && dripDate
                              ? `Scheduled: ${dripDate.toLocaleString()}`
                              : mod.isLocked
                                ? 'Module locked'
                                : `Complete "${mod.lessons[lIdx - 1]?.title}" to unlock`
                          }
                        >
                          <div className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">
                              {isDripScheduled ? 'schedule' : 'lock'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-[13px] font-medium text-on-surface-variant truncate"
                              title={lesson.title}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-[11px] text-on-surface-variant/60 capitalize">
                              {lesson.type} •{' '}
                              {isDripScheduled ? 'Scheduled' : 'Locked'}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    if (isActive) {
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-start gap-3 p-3 bg-surface-container-high rounded-lg translate-x-1 transition-transform border-l-4 border-secondary cursor-pointer"
                        >
                          <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center bg-white">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p
                              className="text-[13px] font-bold text-secondary truncate"
                              title={lesson.title}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-[11px] text-secondary/70 capitalize">
                              {lesson.type} • Now Playing
                            </p>
                          </div>
                        </div>
                      );
                    }

                    if (isChecked) {
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            setActiveLesson(lesson);
                            setActiveExam(null);
                            setActiveModule(mod);
                          }}
                          className="group flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container transition-all cursor-pointer"
                        >
                          <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-tertiary-fixed-dim flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px] text-on-tertiary-fixed font-bold">
                              check
                            </span>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p
                              className="text-[13px] font-medium text-on-surface-variant truncate"
                              title={lesson.title}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-[11px] text-on-surface-variant/60 capitalize">
                              {lesson.type}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    // Available but not completed, not active
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          setActiveLesson(lesson);
                          setActiveExam(null);
                          setActiveModule(mod);
                        }}
                        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-all cursor-pointer"
                      >
                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border border-outline-variant flex items-center justify-center"></div>
                        <div className="flex-1 overflow-hidden">
                          <p
                            className="text-[13px] font-medium text-on-surface truncate"
                            title={lesson.title}
                          >
                            {lesson.title}
                          </p>
                          <p className="text-[11px] text-on-surface-variant capitalize">
                            {lesson.type}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Exams */}
                  {mod.exams?.map((exam: any) => {
                    const isActive = activeExam?.id === exam.id;
                    const allLessonsDone =
                      !mod.lessons ||
                      mod.lessons.every((l: any) => checkedLessons.has(l.id));
                    const isExamLocked =
                      mod.isLocked === true || !allLessonsDone;

                    if (isExamLocked) {
                      return (
                        <div
                          key={exam.id}
                          onClick={() => {
                            if (mod.isLocked) {
                              toast.info(
                                'Complete previous modules to unlock this exam.'
                              );
                            } else {
                              toast.info(
                                'Complete all lessons in this module before taking the exam.'
                              );
                            }
                          }}
                          className="flex items-start gap-3 p-3 rounded-lg opacity-50 grayscale transition-all cursor-not-allowed hover:bg-surface-container-low"
                          title="Complete all module lessons to unlock"
                        >
                          <div className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">
                              lock
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-[13px] font-medium text-on-surface-variant truncate"
                              title={exam.title}
                            >
                              {exam.title}
                            </p>
                            <p className="text-[11px] text-on-surface-variant/60 font-bold">
                              EXAM • Locked
                            </p>
                          </div>
                        </div>
                      );
                    }

                    if (isActive) {
                      return (
                        <div
                          key={exam.id}
                          className="flex items-start gap-3 p-3 bg-secondary-fixed-dim/20 rounded-lg translate-x-1 transition-transform border-l-4 border-secondary cursor-pointer"
                        >
                          <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center bg-white">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p
                              className="text-[13px] font-bold text-secondary truncate"
                              title={exam.title}
                            >
                              {exam.title}
                            </p>
                            <p className="text-[11px] text-secondary/70 font-bold">
                              EXAM • Active
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={exam.id}
                        onClick={() => {
                          setActiveExam(exam);
                          setActiveLesson(null);
                          setActiveModule(mod);
                        }}
                        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-all cursor-pointer"
                      >
                        <div className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[16px]">
                            quiz
                          </span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p
                            className="text-[13px] font-medium text-on-surface truncate"
                            title={exam.title}
                          >
                            {exam.title}
                          </p>
                          <p className="text-[11px] text-secondary font-bold">
                            EXAM
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-surface flex-shrink-0 border-t border-border-subtle">
            {(() => {
              const nextLocked = currentCourse.modules?.find(
                (m: any) => m.isLocked === true
              );
              return (
                <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                  {nextLocked ? (
                    <>
                      <p className="font-label-md font-bold text-on-surface mb-2">
                        Next: {nextLocked.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[16px]">
                          lock
                        </span>
                        <p className="text-[11px] text-on-surface-variant">
                          Complete current module to unlock.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-label-md font-bold text-on-surface mb-2">
                        All Modules Unlocked
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-tertiary-container text-[16px]">
                          check_circle
                        </span>
                        <p className="text-[11px] text-on-surface-variant">
                          You have access to all course content!
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        </aside>
      </div>
    </div>
  );
}
