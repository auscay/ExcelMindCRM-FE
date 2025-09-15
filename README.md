# ExcelMind CRM - Academic Management Platform

A comprehensive University CRM system with role-based access control, course management, and AI integrations built with Next.js and TypeScript.

## 🚀 Features

- **Role-Based Authentication**: Secure JWT authentication for students, lecturers, and administrators
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Form Validation**: Comprehensive form validation with Zod and React Hook Form
- **Type Safety**: Full TypeScript support throughout the application
- **Protected Routes**: Automatic redirection based on authentication status
- **Role-Specific Dashboards**: Tailored interfaces for each user role

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context API

## 📁 Project Structure

```
excel-mind-crm-fe/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Role-specific dashboard
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   └── page.tsx           # Landing page
│   ├── contexts/              # React Context providers
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/                   # Utility libraries
│   │   ├── api.ts            # Axios API client
│   │   └── auth.ts           # Authentication service
│   └── types/                 # TypeScript type definitions
│       ├── auth.ts           # Authentication types
│       └── course.ts         # Course-related types
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd excel-mind-crm-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the API URL in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

For testing purposes, you can use these demo credentials:

### Admin Account
- **Email**: admin@excelmind.edu
- **Password**: admin123
- **Access**: Full system management, user oversight, course approvals

### Lecturer Account  
- **Email**: lecturer@excelmind.edu
- **Password**: lecturer123
- **Access**: Course creation, student management, grading, syllabus generation

### Student Account
- **Email**: student@excelmind.edu
- **Password**: student123
- **Access**: Course browsing, enrollment, assignment submission, grade viewing

## 🎯 User Roles & Features

### 👨‍🎓 Student Features
- Browse and enroll in available courses
- Submit assignments with file uploads
- View grades and feedback
- Track academic progress
- Receive course recommendations

### 👨‍🏫 Lecturer Features
- Create and manage courses
- Upload course syllabi (PDF, DOCX)
- Grade student assignments (0-100 scale)
- Manage student enrollments
- Generate AI-powered syllabi
- View student progress analytics

### 👨‍💼 Admin Features
- Approve/reject course enrollments
- Assign lecturers to courses
- Manage all users (students, lecturers)
- System-wide analytics and reporting
- User role management
- Course oversight and approval

## 🔧 API Integration

The frontend communicates with the backend through a centralized API client (`src/lib/api.ts`) that includes:

- Automatic JWT token attachment to requests
- Request/response interceptors for error handling
- Automatic logout on 401 responses
- Configurable base URL through environment variables

### Key API Endpoints Used

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile
- `POST /auth/logout` - User logout

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Styling**: Clean, professional design with Tailwind CSS
- **Loading States**: Smooth loading indicators and transitions
- **Form Validation**: Real-time validation with helpful error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Dark Mode Ready**: Prepared for future dark mode implementation

## 🔒 Security Features

- **JWT Token Management**: Secure token storage in HTTP-only cookies
- **Automatic Token Refresh**: Seamless session management
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Role-Based Access**: Different interfaces based on user permissions
- **Form Security**: CSRF protection and input sanitization

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔄 Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Testing**: Test all user flows and edge cases
3. **Code Review**: Ensure code quality and consistency
4. **Deployment**: Merge to `main` for automatic deployment

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

- [ ] Course management interface
- [ ] Assignment submission system
- [ ] AI-powered features integration
- [ ] Real-time notifications
- [ ] Document generation
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

---

Built with ❤️ for modern education management.