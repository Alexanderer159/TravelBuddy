import { useNavigate } from "react-router-dom";
import { Globe2 } from "lucide-react";


const Home = () => {
  const navigate = useNavigate()

  const features = [
            {
              path:"/converter",
              title: "Plan trips",
              desc: "Check on live rates between any two currencies. Know what you're spending before you commit.",
            },
            {
              path:"/places",
              title: "Explore places",
              desc: "Discover must-see landmarks and hidden gems for any destination around the world.",
            },
            {
              path:"/pics",
              title: "Share memories",
              desc: "Share and revisit photos from everyones trip. Your own collective travel archive.",
            },
          ]

  const work = [
            { num: "01", title: "Pick your destination", desc: "Tell TravelBuddy where you're headed and let it set the context." },
            { num: "02", title: "Convert & explore", desc: "Check rates in the converter tab and browse top spots in the places tab." },
            { num: "03", title: "Capture memories", desc: "Upload photos during or after the trip and keep them organised by journey." },
          ]

  return (
<>
  <div className="mx-8 overflow-hidden">
{/* Hero */}
<Globe2 className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 -z-10 pointer-events-none text-neutral-400" size={650}/>
      <div className="py-14 text-center">
        <span className="inline-block text-sm tracking-widest uppercase border border-gray-400 rounded-full px-4 py-1 mb-6">Your travel companion</span>
        <h1 className="font-serif text-5xl md:text-6xl font-normal leading-tight mb-4">TravelBuddy!</h1>
        <p className="mx-auto mb-8 leading-relaxed ">"The swiss army knife of all travellers"</p>
        <div className="flex justify-center">

          <p className="bg-gray-900 text-white rounded-full px-7 py-2.5 text-sm font-medium ">
            Get started now!
          </p>

        </div>
      </div>

      <hr className="border-gray-100" />

{/* Features */}
      <div className="py-10">
        <div className="flex md:flex-row flex-wrap flex-col justify-center gap-5">

          {features.map(({ path, title, desc }) => (
            <div key={title} onClick={() => navigate(path)}
            className="group bg-white p-6 flex flex-col gap-3 rounded-xl shrink-0 md:w-100 hover:scale-105 transition-all duration-500 hover:rotate-5 hover:shadow-xl cursor-pointer">
              <p className="text-3xl font-medium font-serif text-center transition-all duration-500 group-hover:-rotate-5">{title}</p>
              <p className="text-lg  leading-relaxed font-light text-center transition-all duration-500 group-hover:-rotate-5">{desc}</p>
            </div>
          ))}
          
        </div>
      </div>

      <hr className="border-gray-100" />
    </div>
</>
  );
}

export default Home
 