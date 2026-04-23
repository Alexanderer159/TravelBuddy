import { useNavigate } from "react-router-dom";
import { useState } from "react";


const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { path: "/converter", label: "Currency"},
    { path: "/places", label: "Places"},
    { path: "/pics", label: "Memories"},
  ];

  return (
    <>
 <div className="w-full bg-white sticky top-0 shadow-lg">
      <div className="w-full mx-auto py-5 flex items-center justify-around">

        <p onClick={() => navigate("")} className="font-serif text-xl hover:text-2xl transition-all duration-500 cursor-pointer">TravelBuddy!</p>

{/* Linkss */}
        <div className="hidden sm:flex gap-5">
          {links.map(({ path, label, icon }) => (
            <button key={label} onClick={() => navigate(path)}
              className="flex items-center rounded-full text-base hover:text-lg transition-all duration-500 cursor-pointer">
              {label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden flex flex-col gap-1.5" onClick={() => setMenuOpen((prev) => !prev)}>
          <span className={`block h-0.5 w-5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-5 bg-gray-700 transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden overflow-hidden transition-all duration-200 ${menuOpen ? "max-h-48 border-t border-gray-100" : "max-h-0"}`}>
        <div className="mx-auto p-4 flex flex-col justify-center items-center gap-1">
          {links.map(({ path, label, icon }) => (
            <button key={label} onClick={() => { navigate(path); setMenuOpen(false); }}
              className="flex items-center justify-center gap-3 p-3 font-semibold w-full">
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar