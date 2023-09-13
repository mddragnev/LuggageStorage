import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { ReactSession } from "react-client-session";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";
import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";
import Login from "./components/Login/Login";
import Map from "./components/Map/Map";
import MapView from "./components/Map/MapView";
import PartnerRegister from "./components/PartnerRegister/PartnerRegister";
import Payment from "./components/Payment/Payment";
import PaymentForm from "./components/Payment/Payment";
import PersistLogin from "./components/PersistLogin/PersistLogin";
import PlaceDetailsView from "./components/PlaceDetails/PlaceDetailsView";
import Register from "./components/Register/Register";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Reservation from "./components/Reservation/Reservation";
import ReservationInfoClient from "./components/Reservation/ReservationInfoClient";
import ReservationsInfoPartner from "./components/Reservation/ReservationsInfoPartner";
import Users from "./components/Users/Users";

function App() {
  type Libraries = (
    | "drawing"
    | "geometry"
    | "localContext"
    | "places"
    | "visualization"
  )[];
  const libs: Libraries = ["places"];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    libraries: libs,
  });
  ReactSession.setStoreType("localStorage");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/partner" element={<PartnerRegister />} />
              <Route path="/unauthorized" element={<ErrorHandler />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/location" element={<PlaceDetailsView />} />

              {/* protected */}
              <Route
                element={
                  <RequireAuth allowedRole={["user", "partner", "admin"]} />
                }
              >
                <Route path="/reservation" element={<Reservation />} />
              </Route>
              <Route
                element={
                  <RequireAuth allowedRole={["user", "partner", "admin"]} />
                }
              >
                <Route path="/payment" element={<Payment />} />
              </Route>
              <Route
                element={
                  <RequireAuth allowedRole={["user", "partner", "admin"]} />
                }
              >
                <Route
                  path="/client/reservations"
                  element={<ReservationInfoClient />}
                />
              </Route>
              <Route element={<RequireAuth allowedRole={["partner"]} />}>
                <Route
                  path="/partner/reservations"
                  element={<ReservationsInfoPartner />}
                />
              </Route>
              <Route element={<RequireAuth allowedRole={["admin"]} />}>
                <Route path="/admin" element={<Users />} />
              </Route>

              {/* wildcard */}
              <Route path="*" element={<ErrorHandler />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
