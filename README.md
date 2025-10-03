# StudyFlow - Student Management System

A comprehensive academic management platform built with React and Vite that helps students organize their courses, track assignments, manage grades, and monitor their academic progress throughout the semester.

## Features

- **Dashboard**: Overview with GPA tracking, upcoming assignments, and course summary
- **Course Management**: Create, edit, and delete courses with custom color coding
- **Assignment Tracking**: Manage assignments with priority levels, due dates, and status tracking
- **Calendar View**: Visualize assignments on an interactive monthly calendar
- **Grade Tracking**: Monitor grades by course with category-based weighted calculations
- **Real-time GPA Calculation**: Automatic GPA computation based on course grades and credits
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- date-fns
- React Toastify
- Lucide React Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex feature components
│   ├── pages/          # Page components
│   ├── ui/             # State components (Loading, Error, Empty)
│   └── ApperIcon.jsx   # Icon component
├── services/
│   ├── api/            # Service layer
│   └── mockData/       # JSON data files
├── utils/              # Utility functions
├── App.jsx
├── main.jsx
└── index.css
```

## Key Features

### Dashboard
- Quick overview of academic status
- GPA tracking with visual progress ring
- Upcoming assignments list
- Course grid with current grades

### Course Management
- Add, edit, and delete courses
- Custom color coding for visual organization
- Track instructor, schedule, and credits
- View course-specific grades

### Assignment Tracking
- Create and manage assignments
- Priority levels (low, medium, high)
- Status tracking (pending, in-progress, completed)
- Due date grouping (overdue, today, this week, later)
- Filter by course, status, and priority

### Calendar View
- Monthly calendar display
- Visual assignment markers
- Date-based assignment viewing
- Color-coded by course

### Grade Management
- Add grades by course and category
- Weighted grade calculations
- Category-based grade grouping
- Visual progress indicators
- Letter grade display

## Design Philosophy

StudyFlow prioritizes clarity and organization to help students stay focused on their academic goals. The design uses a calm color palette with blue primary tones, generous whitespace, and clear information hierarchy to reduce stress and improve productivity.

## License

MIT