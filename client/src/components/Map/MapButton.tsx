import { useGoogleMap, useLoadScript } from "@react-google-maps/api";
import { useEffect, useRef } from "react";

interface MapControlProps {
  position: keyof typeof google.maps.ControlPosition;
}

const MapButton = (props: React.PropsWithChildren<MapControlProps>) => {
  const map = useGoogleMap();
  const ref = useRef(null);
  useEffect(() => {
    if (map && ref) {
      map.controls[window.google.maps.ControlPosition[props.position]].push(
        ref && ref.current ? ref.current : new HTMLElement()
      );
    }
  }, [map, ref]);
  return <div ref={ref}>{props.children}</div>;
};

export default MapButton;
