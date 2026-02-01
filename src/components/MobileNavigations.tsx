import { NavLink } from "react-router-dom"
import { mobileNavigation } from "../constants/navigation"

const MobileNavigations = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="mx-4 mb-4 bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {mobileNavigation.map((nav) => (
            <NavLink
              key={nav.href}
              to={nav.href}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-neutral-500 hover:text-neutral-300"
                }`
              }
            >
              <div className="text-xl mb-0.5">{nav.icon}</div>
              <span className="text-[10px] font-medium">{nav.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default MobileNavigations