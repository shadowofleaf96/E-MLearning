import prisma from './prisma';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Starting fresh database seed...');

  try {
    const defaultPassword = await bcrypt.hash('password123', 10);

    // 1. Stanford University
    const stanford = await prisma.tenant.upsert({
      where: { slug: 'stanford' },
      update: {},
      create: {
        name: 'Stanford University',
        slug: 'stanford',
        domain: 'stanford.lms.com',
        isInstitution: true,
        subscriptionPlan: 'enterprise',
      },
    });

    // Super Admin
    const superAdminEmail = 'superadmin@system.local';
    let superAdmin = await prisma.user.findFirst({ where: { email: superAdminEmail } });
    if (superAdmin) {
      superAdmin = await prisma.user.update({
        where: { id: superAdmin.id },
        data: { password: defaultPassword },
      });
    } else {
      superAdmin = await prisma.user.create({
        data: {
          firstName: 'System',
          lastName: 'SuperAdmin',
          email: superAdminEmail,
          password: defaultPassword,
          role: 'super_admin',
          isVerified: true,
          tenantId: null, // Detached from tenants
        },
      });
    }

    // Tenant Admin
    await prisma.user.upsert({
      where: {
        email_tenantId: { email: 'admin@stanford.edu', tenantId: stanford.id },
      },
      update: { password: defaultPassword },
      create: {
        firstName: 'Stanford',
        lastName: 'Admin',
        email: 'admin@stanford.edu',
        password: defaultPassword,
        role: 'admin',
        isVerified: true,
        tenantId: stanford.id,
      },
    });

    // Instructor
    const instructor = await prisma.user.upsert({
      where: {
        email_tenantId: {
          email: 'instructor@stanford.edu',
          tenantId: stanford.id,
        },
      },
      update: { password: defaultPassword },
      create: {
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 'instructor@stanford.edu',
        password: defaultPassword,
        role: 'instructor',
        isVerified: true,
        tenantId: stanford.id,
      },
    });

    // Student
    const student = await prisma.user.upsert({
      where: {
        email_tenantId: {
          email: 'student@stanford.edu',
          tenantId: stanford.id,
        },
      },
      update: { password: defaultPassword },
      create: {
        firstName: 'Alex',
        lastName: 'Rivera',
        email: 'student@stanford.edu',
        password: defaultPassword,
        role: 'student',
        isVerified: true,
        tenantId: stanford.id,
      },
    });

    // 2. MIT Institute of Technology
    const mit = await prisma.tenant.upsert({
      where: { slug: 'mit' },
      update: {},
      create: {
        name: 'MIT Institute of Technology',
        slug: 'mit',
        domain: 'mit.lms.com',
        isInstitution: true,
        subscriptionPlan: 'enterprise',
      },
    });

    await prisma.user.upsert({
      where: { email_tenantId: { email: 'admin@mit.edu', tenantId: mit.id } },
      update: { password: defaultPassword },
      create: {
        firstName: 'MIT',
        lastName: 'Administrator',
        email: 'admin@mit.edu',
        password: defaultPassword,
        role: 'admin',
        isVerified: true,
        tenantId: mit.id,
      },
    });

    const mitInstructor = await prisma.user.upsert({
      where: {
        email_tenantId: { email: 'profdavid@mit.edu', tenantId: mit.id },
      },
      update: { password: defaultPassword },
      create: {
        firstName: 'David',
        lastName: 'Kaufman',
        email: 'profdavid@mit.edu',
        password: defaultPassword,
        role: 'instructor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        tenantId: mit.id,
      },
    });

    // 3. Oxford Academy
    const oxford = await prisma.tenant.upsert({
      where: { slug: 'oxford' },
      update: {},
      create: {
        name: 'Oxford Academy',
        slug: 'oxford',
        domain: 'oxford.lms.com',
        isInstitution: true,
        subscriptionPlan: 'enterprise',
      },
    });

    await prisma.user.upsert({
      where: {
        email_tenantId: { email: 'admin@oxford.edu', tenantId: oxford.id },
      },
      update: { password: defaultPassword },
      create: {
        firstName: 'Oxford',
        lastName: 'Dean',
        email: 'admin@oxford.edu',
        password: defaultPassword,
        role: 'admin',
        isVerified: true,
        tenantId: oxford.id,
      },
    });

    const oxfordInstructor = await prisma.user.upsert({
      where: {
        email_tenantId: { email: 'elena@oxford.edu', tenantId: oxford.id },
      },
      update: { password: defaultPassword },
      create: {
        firstName: 'Elena',
        lastName: 'Vostrikova',
        email: 'elena@oxford.edu',
        password: defaultPassword,
        role: 'instructor',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        tenantId: oxford.id,
      },
    });

    // Update Stanford instructor avatar
    await prisma.user.update({
      where: { id: instructor.id },
      data: {
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
    });

    // Seed Standard Categories
    const categoriesData = [
      { name: 'Web Development', slug: 'web-development', icon: 'Code', description: 'Fullstack engineering, frontend frameworks, backend APIs, and modern web applications' },
      { name: 'Data Science & AI', slug: 'data-science-ai', icon: 'Brain', description: 'Deep learning, neural networks, machine learning, and data analytics' },
      { name: 'Design', slug: 'design', icon: 'Palette', description: 'UI/UX design, design systems, Figma, typography, and visual product architecture' },
      { name: 'Cloud & DevOps', slug: 'cloud-devops', icon: 'Cloud', description: 'Kubernetes, Docker, AWS, cloud architecture, and automated CI/CD pipelines' },
      { name: 'Cybersecurity', slug: 'cybersecurity', icon: 'Shield', description: 'Penetration testing, network security, ethical hacking, and defense systems' },
      { name: 'Business & Finance', slug: 'business-finance', icon: 'TrendingUp', description: 'Financial modeling, quantitative trading, business strategy, and economics' },
      { name: 'Mobile Development', slug: 'mobile-development', icon: 'Smartphone', description: 'Cross-platform and native iOS and Android application engineering' },
      { name: 'Computer Science', slug: 'computer-science', icon: 'Cpu', description: 'Algorithms, data structures, system design, and software fundamentals' },
    ];

    const categoryMap = new Map<string, string>();
    for (const cat of categoriesData) {
      let existingCat = await (prisma as any).category.findFirst({
        where: { slug: cat.slug, tenantId: null },
      });
      if (!existingCat) {
        existingCat = await (prisma as any).category.create({
          data: {
            ...cat,
            tenantId: null,
          },
        });
      } else {
        existingCat = await (prisma as any).category.update({
          where: { id: existingCat.id },
          data: cat,
        });
      }
      categoryMap.set(cat.slug, existingCat.id);
    }

    const coursesData = [
      {
        title: 'Fullstack Next.js 15 & Node.js Mastery',
        categoryId: categoryMap.get('web-development'),
        description: 'Comprehensive course covering modern fullstack web development, TypeScript, Prisma ORM, Server Actions, and Next.js App Router for enterprise applications. Beginner to Intermediate friendly.',
        price: 99.99,
        isPublished: true,
        tenantId: stanford.id,
        instructorId: instructor.id,
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        modules: [
          {
            title: 'Modern React & TypeScript Foundations',
            orderIndex: 1,
            lessons: [
              { title: 'TypeScript Deep Dive for React', duration: 25, type: 'video', orderIndex: 1 },
              { title: 'Server Components vs Client Components', duration: 30, type: 'video', orderIndex: 2 },
            ],
          },
          {
            title: 'Next.js App Router & Server Actions',
            orderIndex: 2,
            lessons: [
              { title: 'Dynamic Routing and Layouts', duration: 35, type: 'video', orderIndex: 1 },
              { title: 'Prisma ORM & PostgreSQL Database Integration', duration: 40, type: 'video', orderIndex: 2 },
            ],
          },
        ],
      },
      {
        title: 'Deep Learning & Transformer Architectures',
        categoryId: categoryMap.get('data-science-ai'),
        description: 'Master the complexity of modern neural networks, self-attention mechanics, LLMs, and distributed PyTorch training pipelines. Advanced level course.',
        price: 149.99,
        isPublished: true,
        tenantId: mit.id,
        instructorId: mitInstructor.id,
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
        modules: [
          {
            title: 'Attention Mechanisms & Matrix Operations',
            orderIndex: 1,
            lessons: [
              { title: 'From RNNs to Multi-Head Attention', duration: 45, type: 'video', orderIndex: 1 },
              { title: 'Position Encodings and Scaling Factors', duration: 30, type: 'video', orderIndex: 2 },
            ],
          },
          {
            title: 'Training Large Language Models',
            orderIndex: 2,
            lessons: [
              { title: 'Quantization & LoRA Fine-Tuning', duration: 50, type: 'video', orderIndex: 1 },
              { title: 'Distributed Inference with vLLM', duration: 40, type: 'video', orderIndex: 2 },
            ],
          },
        ],
      },
      {
        title: 'Modern UI/UX Design Systems & Figma',
        categoryId: categoryMap.get('design'),
        description: 'Learn how to build scalable design tokens, accessible color palettes, high-fidelity prototypes, and design systems from scratch. Beginner friendly, zero code required.',
        price: 0.00,
        isPublished: true,
        tenantId: oxford.id,
        instructorId: oxfordInstructor.id,
        thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
        modules: [
          {
            title: 'Color Theory & Typography Tokens',
            orderIndex: 1,
            lessons: [
              { title: 'Building Contrast-Safe Accessible Palettes', duration: 20, type: 'video', orderIndex: 1 },
              { title: 'Typography Hierarchies for Desktop & Mobile', duration: 25, type: 'video', orderIndex: 2 },
            ],
          },
        ],
      },
      {
        title: 'Cloud Architecture & Kubernetes at Scale',
        categoryId: categoryMap.get('cloud-devops'),
        description: 'Architecting resilient multi-region cloud infrastructures using Docker, Kubernetes, Helm, Terraform, and AWS. Advanced level for senior engineers and architects.',
        price: 129.99,
        isPublished: true,
        tenantId: stanford.id,
        instructorId: instructor.id,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        modules: [
          {
            title: 'Container Orchestration Fundamentals',
            orderIndex: 1,
            lessons: [
              { title: 'Kubernetes Pods, Deployments & Ingress', duration: 35, type: 'video', orderIndex: 1 },
              { title: 'CI/CD Pipelines with GitHub Actions', duration: 30, type: 'video', orderIndex: 2 },
            ],
          },
        ],
      },
      {
        title: 'Python for Financial Analysis & Algorithmic Trading',
        categoryId: categoryMap.get('business-finance'),
        description: 'Apply data science, pandas, statistical modeling, and backtesting techniques to analyze market data, portfolios, and quantitative strategies. Intermediate level.',
        price: 89.99,
        isPublished: true,
        tenantId: oxford.id,
        instructorId: oxfordInstructor.id,
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
        modules: [
          {
            title: 'Quantitative Finance Essentials',
            orderIndex: 1,
            lessons: [
              { title: 'Time Series Analysis with Pandas', duration: 30, type: 'video', orderIndex: 1 },
              { title: 'Monte Carlo Simulations in Python', duration: 40, type: 'video', orderIndex: 2 },
            ],
          },
        ],
      },
      {
        title: 'Cybersecurity Defense & Ethical Hacking',
        categoryId: categoryMap.get('cybersecurity'),
        description: 'Understand vulnerability assessments, penetration testing, network packet analysis, OWASP Top 10 vulnerabilities, and blue-team defense practices. Intermediate level.',
        price: 119.99,
        isPublished: true,
        tenantId: mit.id,
        instructorId: mitInstructor.id,
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
        modules: [
          {
            title: 'Web Application Security',
            orderIndex: 1,
            lessons: [
              { title: 'SQL Injection & XSS Attack Vectors', duration: 35, type: 'video', orderIndex: 1 },
              { title: 'Hardening Authentication & Session Cookies', duration: 25, type: 'video', orderIndex: 2 },
            ],
          },
        ],
      },
      {
        title: 'Mobile App Development with React Native & Expo',
        categoryId: categoryMap.get('mobile-development'),
        description: 'Build native iOS and Android apps with React Native, Tailwind CSS (NativeWind), push notifications, and offline data synchronization. Free beginner friendly course.',
        price: 0.00,
        isPublished: true,
        tenantId: stanford.id,
        instructorId: instructor.id,
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
        modules: [
          {
            title: 'React Native Basics',
            orderIndex: 1,
            lessons: [
              { title: 'Expo Router & Screen Navigation', duration: 25, type: 'video', orderIndex: 1 },
              { title: 'Gestures and Smooth Layout Animations', duration: 30, type: 'video', orderIndex: 2 },
            ],
          },
        ],
      },
      {
        title: 'Data Structures, Algorithms & System Design',
        categoryId: categoryMap.get('computer-science'),
        description: 'Master core algorithmic problem solving, graph theory, dynamic programming, and scalable system design for tech interviews. Beginner to Advanced.',
        price: 49.99,
        isPublished: true,
        tenantId: mit.id,
        instructorId: mitInstructor.id,
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
        modules: [
          {
            title: 'Trees & Graphs in Practice',
            orderIndex: 1,
            lessons: [
              { title: 'Breadth-First and Depth-First Search', duration: 30, type: 'video', orderIndex: 1 },
              { title: 'Shortest Path with Dijkstra & A*', duration: 35, type: 'video', orderIndex: 2 },
            ],
          },
        ],
      },
    ];

    for (const cData of coursesData) {
      const { modules, ...courseFields } = cData;
      let existingCourse = await prisma.course.findFirst({
        where: {
          title: courseFields.title,
          tenantId: courseFields.tenantId,
        },
      });

      if (!existingCourse) {
        existingCourse = await prisma.course.create({
          data: courseFields,
        });
      } else {
        existingCourse = await prisma.course.update({
          where: { id: existingCourse.id },
          data: courseFields,
        });
      }

      // Seed modules & lessons
      if (modules && modules.length > 0) {
        for (const m of modules) {
          const { lessons, ...moduleFields } = m;
          let existingModule = await prisma.module.findFirst({
            where: {
              courseId: existingCourse.id,
              title: moduleFields.title,
            },
          });

          if (!existingModule) {
            existingModule = await prisma.module.create({
              data: {
                ...moduleFields,
                courseId: existingCourse.id,
                tenantId: existingCourse.tenantId,
              },
            });
          }

          if (lessons && lessons.length > 0) {
            for (const l of lessons) {
              const existingLesson = await prisma.lesson.findFirst({
                where: {
                  moduleId: existingModule.id,
                  title: l.title,
                },
              });

              if (!existingLesson) {
                await prisma.lesson.create({
                  data: {
                    title: l.title,
                    type: l.type as any,
                    duration: l.duration,
                    orderIndex: l.orderIndex,
                    moduleId: existingModule.id,
                    tenantId: existingCourse.tenantId,
                  },
                });
              }
            }
          }
        }
      }

      // Ensure student is enrolled in first 2 courses
      if (cData.price === 99.99 || cData.price === 0.00) {
        const existingEnroll = await prisma.enrollment.findFirst({
          where: { studentId: student.id, courseId: existingCourse.id },
        });
        if (!existingEnroll) {
          await prisma.enrollment.create({
            data: {
              student: { connect: { id: student.id } },
              course: { connect: { id: existingCourse.id } },
              tenant: { connect: { id: existingCourse.tenantId } },
            },
          });
        }
      }
    }

    console.log(`✅ Seed completed cleanly with ${coursesData.length} courses across 3 institutional tenants!`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

