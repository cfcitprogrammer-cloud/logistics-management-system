import { MapPin } from "lucide-react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

export const mapMarker = (color: string = "blue") =>
  L.divIcon({
    className: "", // no default styles
    html: ReactDOMServer.renderToString(
      <div className="flex justify-center items-center">
        <MapPin color={color} size={24} />
      </div>
    ),
    iconSize: [24, 24],
    iconAnchor: [12, 24], // bottom-center
  });
