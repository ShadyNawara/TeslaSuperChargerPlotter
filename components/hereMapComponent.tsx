import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    H: any;
  }
}

interface Waypoint {
  location: string;
  country: string;
}

const HereMapComponent: React.FC<{ waypoints: Waypoint[] }> = ({
  waypoints,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = "ro4l1MQytaafn7PlXWHFu7uz97noxvIwZhti6qlt-_s";

  useEffect(() => {
    const loadCSS = (href: string) => {
      return new Promise<void>((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        link.onload = () => resolve();
        link.onerror = (err) => reject(err);
        document.head.appendChild(link);
      });
    };

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = src;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    };

    const loadHereMapsScripts = async () => {
      try {
        await loadScript(`https://js.api.here.com/v3/3.1/mapsjs-core.js`);
        await loadScript(`https://js.api.here.com/v3/3.1/mapsjs-service.js`);
        await loadScript(`https://js.api.here.com/v3/3.1/mapsjs-mapevents.js`);
        await loadScript(`https://js.api.here.com/v3/3.1/mapsjs-ui.js`);
        await loadCSS(`https://js.api.here.com/v3/3.1/mapsjs-ui.css`);
      } catch (error) {
        console.error("Failed to load HERE Maps scripts", error);
      }
    };

    const initializeMap = () => {
      const platform = new window.H.service.Platform({
        apikey: apiKey,
      });
      const defaultLayers = platform.createDefaultLayers();
      const hMap = new window.H.Map(
        mapRef.current!,
        defaultLayers.vector.normal.map,
        {
          zoom: 4,
          center: { lat: 39.5, lng: -98.35 },
        },
      );

      window.addEventListener("resize", () => hMap.getViewPort().resize());

      const behavior = new window.H.mapevents.Behavior(
        new window.H.mapevents.MapEvents(hMap),
      );

      const ui = window.H.ui.UI.createDefault(hMap, defaultLayers);

      const drawLine = (points: any) => {
        const lineString = new window.H.geo.LineString();
        points.forEach((point: any) => {
          lineString.pushPoint(point);
        });
        const polyline = new window.H.map.Polyline(lineString, {
          style: { lineWidth: 4 },
        });
        hMap.addObject(polyline);
        hMap
          .getViewModel()
          .setLookAtData({ bounds: polyline.getBoundingBox() });
      };

      const searchAndPlotWaypoints = async () => {
        const points = [];
        for (const waypoint of waypoints) {
          const response = await fetch(
            `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent("Tesla Supercharger" + waypoint.location + ", " + waypoint.country)}&apiKey=${apiKey}`,
          );
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const location = data.items[0].position;
            points.push({ lat: location.lat, lng: location.lng });
          }
        }

        if (points.length > 0) {
          let minLat = points[0].lat,
            maxLat = points[0].lat,
            minLng = points[0].lng,
            maxLng = points[0].lng;

          points.forEach((point) => {
            minLat = Math.min(minLat, point.lat);
            maxLat = Math.max(maxLat, point.lat);
            minLng = Math.min(minLng, point.lng);
            maxLng = Math.max(maxLng, point.lng);
          });

          const boundingRect = new window.H.geo.Rect(
            minLat - 1,
            minLng - 1,
            maxLat + 1,
            maxLng + 1,
          );
          hMap.getViewModel().setLookAtData({ bounds: boundingRect });
        }

        points.forEach((point) => {
          const marker = new window.H.map.Marker(point);
          hMap.addObject(marker);
        });

        if (points.length > 1) {
          drawLine(points);
        }
      };

      if (waypoints.length) {
        searchAndPlotWaypoints();
      }
    };

    if (!window.H) {
      loadHereMapsScripts().then(initializeMap);
    } else {
      initializeMap();
    }
  }, [waypoints]);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
};

export default HereMapComponent;
