import { useState } from "react";
import Papa from "papaparse";

import HereMapComponent from "./hereMapComponent";

export const MapContainer: React.FC = () => {
  const [waypoints, setWaypoints] = useState<
    { location: string; country: string }[]
  >([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      Papa.parse(files[0], {
        header: true,
        complete: (result: any) => {
          const waypoints = result.data
            .map((row: any) => ({
              location: row.SiteLocationName,
              country: row.Country,
            }))
            .filter(
              (waypoint: { location?: string; country?: string }) =>
                waypoint.location && waypoint.country,
            );
          setWaypoints(waypoints);
        },
      });
    }
  };

  return (
    <div className="size-full overflow-hidden rounded bg-[#222] p-8 drop-shadow-lg">
      <div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Tesla Supercharger Map Plotter
        </h2>
        <p className="mt-4">
          Using the Tesla App -&gt; Menu -&gt; Charging -&gt; History -&gt;
          Export -&gt; CSV
        </p>
      </div>
      <div className="col-span-full">
        <div className="mt-2 flex items-center gap-x-3">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />

          <label
            htmlFor="file-upload"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="inline-block h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
              />
            </svg>
            Upload CSV
          </label>

          <a
            href="Tesla_Charging_History.csv"
            download="Tesla_Charging_History.csv"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="inline-block h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            Download Sample
          </a>
        </div>
      </div>
      <div className="mt-8">
        {waypoints.length > 0 && <HereMapComponent waypoints={waypoints} />}
      </div>
    </div>
  );
};
