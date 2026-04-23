import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./Pages/Home";
import Navbar from './Components/Navbar.jsx'
import Footer from './Components/Footer.jsx'
import Converter from "./Pages/Converter";
import Pics from "./Pages/Pics";
import Places from "./Pages/Places";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="min-h-screen pt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/pics" element={<Pics />} />
            <Route path="/places" element={<Places />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>


    </>
  );
}

export default App
