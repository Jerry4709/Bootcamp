import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const Sidebar = () => (
  <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-colors duration-300">
    <nav className="flex-1 p-4 space-y-2">
      <NavLink
        to={ROUTES.STUDENT_DASHBOARD}
        className={({ isActive }) =>
          `block py-2 px-3 rounded hover:bg-[#D1C4E9] dark:hover:bg-[#4527A0] transition-colors ${
            isActive ? 'bg-[#B39DDB] text-white' : 'text-gray-700 dark:text-gray-300'
          }`
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to={ROUTES.STUDENT_ACTIVITIES}
        className={({ isActive }) =>
          `block py-2 px-3 rounded hover:bg-[#D1C4E9] dark:hover:bg-[#4527A0] transition-colors ${
            isActive ? 'bg-[#B39DDB] text-white' : 'text-gray-700 dark:text-gray-300'
          }`
        }
      >
        Activities
      </NavLink>
      
    </nav>
  </aside>
)

export default Sidebar
