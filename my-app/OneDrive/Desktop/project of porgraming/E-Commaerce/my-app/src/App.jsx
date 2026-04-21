// import { useEffect, useState, useRef, use } from "react";
// import { BrowserRouter, Routes, Route } from "react-router";
// import Home from "./pages/Home";
// import NavBar from "./Component/NavBar";
// import About from "./pages/About";
// import Products from "./pages/Products";
// import Contact from "./pages/Contact";
// import Cart from "./pages/Cart";
// import axios from "axios";
// import Footer from "./Component/Footer";
// import SinglePages from "./pages/SinglePages";

// const App = () => {
//   const [Location, setLocation] = useState(null);

//   const [openDropDown, setOpenDropDown] = useState(false);

//   const called = useRef(false);

//   const getLocation = async () => {
//     if (Location) return;

//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       const { latitude, longitude } = pos.coords;

//       const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

//       try {
//         const res = await axios.get(url);

//         const exactLocation = res.data.address;

//         setLocation(exactLocation);
//         // console.log(exactLocation);

//         setOpenDropDown(false);
//       } catch (error) {
//         console.log(error);
//       }
//     });
//   };

//   useEffect(() => {
//     if (!called.current) {
//       getLocation();
//       called.current = true;
//     }
//   }, []);

//   return (
//     <BrowserRouter>
//       <NavBar
//         location={Location}
//         getLocation={getLocation}
//         openDropDown={openDropDown}
//         setOpenDropDown={setOpenDropDown}
//       />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:id" element={<SinglePages />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route
//           path="/cart"
//           element={<Cart location={Location} getLocation={getLocation} />}
//         />
//       </Routes>

//       <Footer />
//     </BrowserRouter>
//   );
// };

// export default App;

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./Component/NavBar";
import About from "./pages/About";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import axios from "axios";
import Footer from "./Component/Footer";
import SinglePages from "./pages/SinglePages";
import { useEffect, useState, useRef } from "react";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [Location, setLocation] = useState(null);
  const [openDropDown, setOpenDropDown] = useState(false);
  const called = useRef(false);

  const getLocation = async () => {
    if (Location) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

      try {
        const res = await axios.get(url);
        const exactLocation = res.data.address;
        setLocation(exactLocation);
        setOpenDropDown(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    if (!called.current) {
      getLocation();
      called.current = true;
    }
  }, []);

  return (
    <>
      <NavBar
        location={Location}
        getLocation={getLocation}
        openDropDown={openDropDown}
        setOpenDropDown={setOpenDropDown}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<SinglePages />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/cart"
          element={<Cart location={Location} getLocation={getLocation} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
