"use client";
import MoistureMap from "@/components/MoistureMap";
import Rad from "@/components/Rad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [selectedState, setSelectedState] = useState("Off");
  const [serialData, setSerialData] = useState<string>("");

  const updatePumpState = async (state: string) => {
    try {
      interface PumpResponse {
        message: string;
      }

      const response = await axios.post("/api/pump", { state });
      const data = response.data as PumpResponse;
      console.log(data.message);
    } catch (error) {
      console.error("Failed to update pump state:", error);
    }
  };

  useEffect(() => {
    const fetchSerial = async () => {
      try {
        const res = await axios.get("/api/serial");
        setSerialData(res.data.last_serial_reading);
      } catch (e) {
        console.error("Failed to fetch serial data:", e);
      }
    };
    fetchSerial();
    const interval = setInterval(fetchSerial, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-16 py-10">
      <div className="px-32 flex flex-row my-10 mb-24">
        <h1 className="text-4xl font-bold">
          Welcome to the Smart Garden Management System
        </h1>
        <div className="flex flex-1 justify-end">
          <button className="px-4 py-2 shadow-md outline rounded-md hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer">
            Download Data
          </button>
        </div>
      </div>
      <div className="flex  mt-10 gap-4 flex-wrap justify-center">
        <Rad title={"Hydration"} description={"Current Hydration Status"} metric={"%"} bound={100} percentage={75} />
        <Rad title={"Air Temp"} description={"Temperature of Soil"} metric={"°C"} bound={20} percentage={12} />
        <Rad title={"Soil Temp"} description={"Temperature of Soil"} metric={"°C"} bound={20} percentage={12} />
        <div className="flex flex-col gap-4">
          <Rad title={"Light"} description={"Sunlight"} metric={" Lux"} bound={20} percentage={12} />
          <Card>
            <CardHeader>
              <CardTitle>Light Sensor Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                The light sensor is currently <span className="font-bold">not blocked</span>.
              </p>
            </CardContent>
          </Card>
          </div>
      </div>
      <div className="flex mt-10 gap-4 flex-wrap justify-center">
        <MoistureMap
          title={"Moisture"}
          description={"Moisture Values"}
          sensorData={[
            {
              value: 45,
              metric: "Quadrant I",
            },
            {
              value: 30,
              metric: "Quadrant II",
            },
            {
              value: 60,
              metric: "Quadrant III",
            },
            {
              value: 80,
              metric: "Quadrant IV",
            },
          ]}
        />
        <div className="flex flex-col w-[500px] min-w-max">
          <Card>
            <CardHeader>
              <CardTitle>Pump Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg mb-4">Set the pump state:</p>
                <div className="flex ">
                  {[
                    { label: "Off", value: "Off" },
                    { label: "Auto", value: "Auto" },
                    { label: "On (1s/1min)", value: "On" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`px-4 py-2 border border-gray-300 transition duration-300 ease-in-out ${
                        selectedState === option.value
                          ? "bg-gray-300 "
                          : "hover:bg-gray-200"
                      } ${
                        option.value === "Off"
                          ? "rounded-l-md"
                          : option.value === "On"
                          ? "rounded-r-md"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedState(option.value);
                        updatePumpState(option.value);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="mt-10 w-[75%] mx-auto">
        <CardHeader>
          <CardTitle>Sensor A0 Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{serialData}</p>
        </CardContent>
      </Card>
      <Card className="mt-10 w-[75%] mx-auto">
        <CardHeader>
          <CardTitle>Live Camera Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video">
            <iframe
              src="https://your-camera-feed-url.com"
              title="Live Camera Feed"
              className="w-full h-full rounded-md"
              allowFullScreen
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
