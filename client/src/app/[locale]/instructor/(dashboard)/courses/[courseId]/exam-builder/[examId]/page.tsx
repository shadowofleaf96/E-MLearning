'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  BarChart,
  Video,
  Banknote,
  Settings,
  Plus,
  Search,
  Bell,
  HelpCircle,
  ChevronRight,
  Eye,
  GripVertical,
  Trash2,
  PlusCircle,
  Bold,
  Italic,
  Code,
  List,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
// Import services if we have them for exams, for now we will mock the save
// import { examsService } from '@/modules/courses/services/exams.service';

export default function ExamBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  // const examId = params.examId as string;

  // Mock State
  const [questions] = useState([
    {
      id: 'q1',
      type: 'mcq',
      points: 10,
      text: 'What is the primary purpose of useEffect in React?',
      options: [
        { text: 'To manage local component state.', isCorrect: false },
        {
          text: 'To perform side effects in functional components.',
          isCorrect: true,
        },
        { text: 'To access the DOM elements directly.', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
    {
      id: 'q2',
      type: 'code',
      points: 15,
      text: 'Implement a custom useDebounce hook.',
      options: [],
    },
    {
      id: 'q3',
      type: 'mcq',
      points: 5,
      text: 'Which hook is best for accessing DOM nodes directly?',
      options: [],
    },
  ]);

  const [activeQuestionId, setActiveQuestionId] = useState('q1');
  const [isSaving, setIsSaving] = useState(false);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);

  const handleSave = async () => {
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      toast.success('Exam saved successfully!');
      setIsSaving(false);
    }, 800);
  };

  const handleUpdateExam = () => {
    toast.success('Exam published and updated!');
    router.push(`/instructor/courses/${courseId}`);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-surface-bg text-on-surface font-body-md selection:bg-secondary/20">
      {/* SideNavBar */}
      <aside className="w-70 bg-surface-container-low border-r border-border-subtle flex flex-col py-4 z-20 shrink-0 hidden md:flex">
        <div className="px-6 mb-8 mt-2 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
              EduStudio
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mt-0.5">
              Instructor Portal
            </p>
          </div>
        </div>

        <div className="px-4 mb-6">
          <button
            onClick={() => router.push('/instructor/courses')}
            className="w-full bg-secondary hover:bg-secondary-container text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Create New Course
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          <button
            onClick={() => router.push('/instructor/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200"
          >
            <LayoutDashboard size={20} />
            <span className="font-body-sm text-body-sm">Dashboard</span>
          </button>
          <button
            onClick={() => router.push('/instructor/courses')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-secondary font-bold border-l-4 border-secondary bg-surface-container-high transition-colors duration-200"
          >
            <BookOpen
              size={20}
              fill="currentColor"
              className="opacity-20 absolute"
            />
            <BookOpen size={20} />
            <span className="font-body-sm text-body-sm ml-1">
              Course Builder
            </span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200">
            <BarChart size={20} />
            <span className="font-body-sm text-body-sm">Student Analytics</span>
          </button>
          <button
            onClick={() => router.push('/instructor/live')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200"
          >
            <Video size={20} />
            <span className="font-body-sm text-body-sm">Live Sessions</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200">
            <Banknote size={20} />
            <span className="font-body-sm text-body-sm">Earnings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 mt-auto">
            <Settings size={20} />
            <span className="font-body-sm text-body-sm">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface-bg relative">
        {/* TopNavBar */}
        <header className="hidden md:flex bg-surface-card border-b border-border-subtle h-16 items-center justify-between px-10 shrink-0 z-10 w-full">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-64 transition-all text-on-surface placeholder:text-outline-variant"
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-on-surface-variant hover:text-secondary transition-colors">
              <Bell size={20} />
            </button>
            <button className="text-on-surface-variant hover:text-secondary transition-colors">
              <HelpCircle size={20} />
            </button>
            <button className="border border-secondary text-secondary hover:bg-surface-container px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
              Go Live
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-border-subtle overflow-hidden relative">
              <NextImage
                alt="Instructor"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                src="https://placehold.co/100x100/10b981/ffffff?text=IN"
                unoptimized
              />
            </div>
          </div>
        </header>

        {/* Workspace Header */}
        <div className="px-10 py-6 border-b border-border-subtle bg-surface-card flex flex-col gap-4 shrink-0">
          <div className="flex items-center text-sm text-on-surface-variant gap-2 font-semibold">
            <button
              onClick={() => router.push('/instructor/courses')}
              className="hover:text-secondary transition-colors"
            >
              My Courses
            </button>
            <ChevronRight size={16} />
            <button
              onClick={() => router.push(`/instructor/courses/${courseId}`)}
              className="hover:text-secondary transition-colors"
            >
              Course Configuration
            </button>
            <ChevronRight size={16} />
            <span className="text-primary">Exam Builder</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold font-headline-lg text-primary tracking-tight">
              Final Assessment: React Fundamentals
            </h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-colors font-semibold text-sm bg-surface-card shadow-sm">
                <Eye size={18} />
                Preview Exam
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-subtle text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-colors font-semibold text-sm bg-surface-card shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={handleUpdateExam}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-secondary text-white hover:bg-secondary-container transition-colors font-bold text-sm shadow-sm"
              >
                Update Exam
              </button>
            </div>
          </div>
        </div>

        {/* Builder Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Questions List */}
          <div className="w-[360px] border-r border-border-subtle bg-surface-card flex flex-col shrink-0 z-0">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-container-low">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Exam Questions ({questions.length})
              </span>
              <span className="text-xs font-bold bg-surface-variant text-on-secondary-fixed px-2 py-0.5 rounded">
                Total: {totalPoints} pts
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`group relative rounded-lg p-3 cursor-pointer transition-all ${
                    activeQuestionId === q.id
                      ? 'bg-surface-container-lowest border border-secondary shadow-sm'
                      : 'bg-surface-container-lowest border border-border-subtle hover:border-outline-variant'
                  }`}
                >
                  {activeQuestionId === q.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-lg"></div>
                  )}
                  <div className="flex items-start gap-3 pl-2">
                    <GripVertical
                      size={18}
                      className={`text-outline cursor-grab mt-0.5 ${
                        activeQuestionId === q.id
                          ? 'opacity-100'
                          : 'opacity-50 group-hover:opacity-100'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            q.type === 'mcq'
                              ? 'bg-surface-container-high text-secondary'
                              : 'bg-surface-container text-on-secondary-fixed'
                          }`}
                        >
                          {q.type}
                        </span>
                        <span className="text-xs text-on-surface-variant font-medium">
                          {q.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-on-surface truncate">
                        {q.text || `Question ${idx + 1}`}
                      </p>
                    </div>
                    <button className="text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border-subtle bg-surface-card">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-outline text-on-surface-variant rounded-lg hover:border-secondary hover:text-secondary hover:bg-surface-container transition-all font-semibold text-sm">
                <PlusCircle size={18} />
                Add New Question
              </button>
            </div>
          </div>

          {/* Right Column: Editor Area */}
          <div className="flex-1 overflow-y-auto p-10 relative">
            <div className="max-w-3xl mx-auto space-y-6 pb-24">
              {activeQuestion ? (
                <>
                  {/* Editor Header */}
                  <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <h3 className="text-2xl font-bold font-headline-md text-primary">
                      Edit Question{' '}
                      {questions.findIndex((q) => q.id === activeQuestion.id) +
                        1}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-on-surface-variant">
                          Points
                        </label>
                        <input
                          className="w-20 px-3 py-1.5 border border-border-subtle rounded-lg text-sm focus:ring-1 focus:ring-secondary focus:border-secondary transition-all text-center bg-surface-card text-on-surface"
                          type="number"
                          value={activeQuestion.points}
                          readOnly
                        />
                      </div>
                      <div className="h-6 w-px bg-border-subtle"></div>
                      <select
                        className="px-3 py-1.5 border border-border-subtle rounded-lg text-sm text-on-surface focus:ring-1 focus:ring-secondary focus:border-secondary transition-all bg-surface-card font-medium"
                        value={activeQuestion.type}
                        disabled
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="code">Coding Challenge</option>
                        <option value="text">Free Text</option>
                      </select>
                    </div>
                  </div>

                  {/* Question Input */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant">
                        Question Text
                      </label>
                      <div className="border border-border-subtle rounded-lg bg-surface-card overflow-hidden focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary transition-all shadow-sm">
                        <div className="flex items-center gap-1 border-b border-border-subtle p-2 bg-surface-container-low">
                          <button className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant">
                            <Bold size={16} />
                          </button>
                          <button className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant">
                            <Italic size={16} />
                          </button>
                          <button className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant">
                            <Code size={16} />
                          </button>
                          <div className="w-px h-4 bg-border-subtle mx-1"></div>
                          <button className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant">
                            <List size={16} />
                          </button>
                          <button className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant">
                            <ImageIcon size={16} />
                          </button>
                        </div>
                        <textarea
                          className="w-full min-h-[120px] p-4 text-base bg-surface-card text-on-surface border-none focus:ring-0 resize-y placeholder:text-outline-variant outline-none"
                          placeholder="Enter your question here..."
                          defaultValue={activeQuestion.text}
                        />
                      </div>
                    </div>

                    {/* Options List (If MCQ) */}
                    {activeQuestion.type === 'mcq' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-on-surface-variant">
                            Answer Options
                          </label>
                          <span className="text-xs text-on-surface-variant">
                            Select the correct answer
                          </span>
                        </div>
                        <div className="space-y-3">
                          {activeQuestion.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-3 p-3 rounded-lg group transition-colors shadow-sm ${
                                opt.isCorrect
                                  ? 'border border-secondary bg-surface-container-low'
                                  : 'border border-border-subtle bg-surface-card hover:border-outline-variant'
                              }`}
                            >
                              <input
                                className="w-5 h-5 text-secondary border-outline focus:ring-secondary focus:ring-offset-0 bg-surface-card"
                                name="correct_answer"
                                type="radio"
                                defaultChecked={opt.isCorrect}
                              />
                              <div className="flex-1">
                                <input
                                  className={`w-full bg-transparent border-none focus:ring-0 p-0 outline-none text-base ${
                                    opt.isCorrect
                                      ? 'text-primary font-medium'
                                      : 'text-on-surface'
                                  }`}
                                  type="text"
                                  placeholder="Enter option text..."
                                  defaultValue={opt.text}
                                />
                              </div>
                              <button className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button className="mt-2 flex items-center gap-2 text-secondary hover:text-secondary-container font-semibold text-sm transition-colors p-2">
                          <Plus size={18} />
                          Add Option
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                  <BookOpen size={48} className="opacity-20 mb-4" />
                  <p className="font-semibold">Select a question to edit</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
