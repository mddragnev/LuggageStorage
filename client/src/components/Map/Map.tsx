import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { Button } from "@mui/material";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ReactDOMServer from "react-dom/server";
import classes from "./Map.module.scss";
import MapButton from "./MapButton";
import { DefaultStyles } from "./MapStyles";
import MarkerInfo from "./MarkerInfo/MarkerInfo";

const Map = ({
  lat,
  lng,
  places,
  handleSearch,
  handleNavigationToDetails,
  city,
}: {
  lat: number;
  lng: number;
  places: [];
  handleSearch: any;
  handleNavigationToDetails: any;
  city: any;
}) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map>();
  const [availableMarkers, setAvailableMarkers] = useState<
    google.maps.Marker[]
  >([]);
  const [availableMarkerCluster, setAvailableMarkerCluster] =
    useState<MarkerClusterer>();
  const onLoad = useCallback((map: any) => {
    removeMarkers();
    addMarkers(map);
    setMapInstance(map);
  }, []);

  useEffect(() => {
    addMarkers(mapInstance);

    return () => {};
  }, [places]);

  const removeMarkers = () => {
    availableMarkerCluster?.setMap(null);
  };

  const addMarkers = (map: any) => {
    const infoWindow = new google.maps.InfoWindow();
    const markers = places.map(({ _id, address, workingHours }: any) => {
      const marker = new google.maps.Marker({
        position: { lat: address.lat, lng: address.lng },
        label: {
          text: "\uf235",
          fontFamily: "Material Icons",
          color: "#ffffff",
          fontSize: "18px",
        },
      });
      marker.addListener("click", () => {
        infoWindow.setPosition({ lat: address.lat, lng: address.lng });
        const div = document.createElement("div");
        const divRoot = ReactDOM.createRoot(div);
        // ReactDOM
        divRoot.render(
          <MarkerInfo
            address={{ ...address, id: _id }}
            workingHours={workingHours}
            handleNavigationToDetails={handleNavigationToDetails}
          />
        );
        infoWindow.setContent(div);
        infoWindow.open({ map });
      });
      return marker;
    });
    setAvailableMarkers((old) => [...markers]);
    const markerCluster = new MarkerClusterer({
      markers: markers,
      map: map,
      algorithm: new SuperClusterAlgorithm({ radius: 100 }),
    });
    setAvailableMarkerCluster(markerCluster);
  };

  const handleSearchCity = async () => {
    const geocoder = new google.maps.Geocoder();
    const latlng = {
      lat: mapInstance!.getCenter()?.lat() || 0,
      lng: mapInstance!.getCenter()?.lng() || 0,
    };

    const results = await geocoder.geocode({
      location: latlng,
    });

    const result = results.results.find(x => x.types.includes("locality"))
    const northEastBound = result?.geometry.bounds?.getNorthEast();
    const southWestBound = result?.geometry.bounds?.getSouthWest();

    const newCity = {
      northEast: {lat: northEastBound?.lat(), lng: northEastBound?.lng()},
      southWest: {lat: southWestBound?.lat(), lng: southWestBound?.lng()}
    }

    if (
      city.northEast.lat === newCity.northEast.lat &&
      city.northEast.lng === newCity.northEast.lng &&
      city.southWest.lat === newCity.southWest.lat &&
      city.southWest.lng === newCity.southWest.lng
    ) {
      return;
    }
    removeMarkers();

    await handleSearch({ city: newCity, ...latlng });
  };

  return (
    <GoogleMap
      zoom={13}
      center={{ lat: lat, lng: lng }}
      mapContainerClassName={classes.map__container}
      options={{
        styles: DefaultStyles,
        disableDefaultUI: true,
        gestureHandling: "greedy",
      }}
      onLoad={onLoad}
    >
      <MapButton position="TOP_CENTER">
        <Button
          onClick={handleSearchCity}
          style={{ margin: "2rem" }}
          variant="outlined"
          sx={{
            color: "black",
            borderColor: "black",
            background: "white",
          }}
        >
          Потърси в тази област
        </Button>
      </MapButton>
    </GoogleMap>
  );
};

export default Map;
