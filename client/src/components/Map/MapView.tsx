import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../services/axios";
import ShopView from "../Shops/ShopView";
import Map from "./Map";
import classes from "./MapView.module.scss";

const MapView = () => {
  const { state }: { state: { lat: number; lng: number; locality: {} } } =
    useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [defaultOptions, setDefaultOptions] = useState({
    lat: state ? state.lat : 42.6977,
    lng: state ? state.lng : 23.3219,
    locality: state
      ? state.locality
      : {
          northEast: {
            lat: 42.7877752,
            lng: 23.4569049
          },
          southWest: {
            lat: 42.6030891,
            lng: 23.1909885
          },
        },
  });
  const { data = [], isLoading } = useQuery(
    ["places", defaultOptions.locality],
    async () => {
      try {
        const result = await axiosPrivate.get("/places", {
          params: { locality: defaultOptions.locality },
        });
        if (result.status !== 200) {
          return [];
        }
        return result.data;
      } catch (err) {
        console.log(err);
      }
    }
  );

  const handleSearch = async (address: any) => {
    setDefaultOptions((prev) => ({
      ...prev,
      lat: address.lat,
      lng: address.lng,
      locality: address.city,
    }));
  };

  const handleNavigationToDetails = (
    address: any,
    workingHours: any,
    opened: boolean
  ) => {
    navigate("/location", {
      state: {
        address,
        workingHours,
        opened,
      },
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.shops}>
        <ShopView
          shops={data}
          handleNavigationToDetails={handleNavigationToDetails}
        ></ShopView>
      </div>
      <div className={classes.map}>
        <Map
          lat={defaultOptions.lat}
          lng={defaultOptions.lng}
          city={defaultOptions.locality}
          places={data}
          handleSearch={handleSearch}
          handleNavigationToDetails={handleNavigationToDetails}
        ></Map>
      </div>
    </div>
  );
};

export default MapView;
