"use client";
import MoistureMap from "@/components/MoistureMap";
import Rad from "@/components/Rad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import axios from "axios";

// Define type for the sensor API response
interface SensorData {
  air_humidity?: number | string;
  air_temperature?: number | string;
  soil_temperature?: number | string;
  sunlight_visible?: number | string;
  sunlight_ir?: number | string;
  m0?: number | string;
  m1?: number | string;
  m2?: number | string;
  m3?: number | string;
}

// Mock data for development and testing
const mockSensorData: SensorData = {
  air_humidity: 65,
  air_temperature: 24.5,
  soil_temperature: 22.1,
  sunlight_visible: 650,
  sunlight_ir: 850,
  m0: 540,
  m1: 580,
  m2: 520,
  m3: 560
};

export default function Home() {
  const [selectedState, setSelectedState] = useState("Off");
  const [serialData, setSerialData] = useState<SensorData>(mockSensorData);

  const updatePumpState = async (state: string) => {
    // Mock implementation
    console.log(`Pump state would be set to: ${state}`);
    
    // Commented out actual API implementation
    /*
    try {
      interface PumpResponse {
        message: string;
      }

      const response = await axios.post("/api/pump", { "mode": state });
      const data = response.data as PumpResponse;
      console.log(data.message);
    } catch (error) {
      console.error("Failed to update pump state:", error);
    }
    */
  };

  useEffect(() => {
    // Using mock data directly instead of API fetch
    const mockDataFetch = () => {
      // Optionally add some randomization to simulate changing values
      setSerialData({
        ...mockSensorData,
        air_temperature: Number((22 + Math.random() * 5).toFixed(1)),
        air_humidity: Number((60 + Math.random() * 15).toFixed(0)),
        soil_temperature: Number((20 + Math.random() * 4).toFixed(1)),
        sunlight_visible: Number((600 + Math.random() * 200).toFixed(0)),
        m0: Number((520 + Math.random() * 60).toFixed(0)),
        m1: Number((540 + Math.random() * 60).toFixed(0)),
        m2: Number((530 + Math.random() * 60).toFixed(0)),
        m3: Number((550 + Math.random() * 60).toFixed(0)),
      });
    };
    
    mockDataFetch();
    const interval = setInterval(mockDataFetch, 5000);
    return () => clearInterval(interval);
    
    // Commented out actual API implementation
    /*
    const fetchSerial = async () => {
      try {
        const res = await axios.get("/api/serial");
        setSerialData(res.data);
      } catch (e) {
        console.error("Failed to fetch serial data:", e);
      }
    };
    fetchSerial();
    const interval = setInterval(fetchSerial, 5000);
    return () => clearInterval(interval);
    */
  }, []);

  // Helper to process numerical values from API
  const getNumericValue = (value: string | number | undefined): number => {
    if (value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (value.toString().startsWith('Error')) return 0;
    return parseFloat(value.toString()) || 0;
  };

  // Calculate average moisture level (0-100%)
  const averageMoisture = (): number => {
    const values = [serialData.m0, serialData.m1, serialData.m2, serialData.m3]
      .map(val => getNumericValue(val))
      .filter(val => val > 0);
    
    if (values.length === 0) return 0;
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.round(moistureToPercentage(avg));
  };

  // Convert individual moisture sensor reading to percentage
  const moistureToPercentage = (value: number): number => {
    // Cap the value between 500 (wettest) and 650 (driest)
    const cappedValue = Math.min(Math.max(value, 500), 650);
    
    // Map range 650 (dry) - 500 (wet) to 0% - 100%
    return ((650 - cappedValue) / (650 - 500)) * 100;
  };

  // Check if light sensor is detecting light
  const isLightDetected = (): boolean => {
    const visible = getNumericValue(serialData.sunlight_visible);
    return visible > 100; // Threshold for light detection
  };

  // Helper function to round values for display
  const roundForDisplay = (value: number): number => {
    return Math.round(value);
  };

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
      <div className="flex mt-10 gap-4 flex-wrap justify-center">
        <Rad 
          title={"Hydration"} 
          description={"Current Hydration Status"} 
          metric={"%"} 
          bound={100} 
          percentage={averageMoisture()} 
        />
        <Rad 
          title={"Air Temp"} 
          description={"Air Temperature"} 
          metric={"°C"} 
          bound={40} 
          percentage={roundForDisplay(getNumericValue(serialData.air_temperature))} 
        />
        <Rad 
          title={"Soil Temp"} 
          description={"Temperature of Soil"} 
          metric={"°C"} 
          bound={40} 
          percentage={roundForDisplay(getNumericValue(serialData.soil_temperature))} 
        />
        <div className="flex flex-col gap-4">
          <Rad 
            title={"Light"} 
            description={"Sunlight"} 
            metric={" Lux"} 
            bound={1000} 
            percentage={roundForDisplay(getNumericValue(serialData.sunlight_visible))} 
          />
          <Card>
            <CardHeader>
              <CardTitle>Light Sensor Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                The light sensor is currently <span className="font-bold">{isLightDetected() ? "detecting light" : "not detecting light"}</span>.
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
              value: roundForDisplay(moistureToPercentage(getNumericValue(serialData.m0))),
              metric: "Quadrant I",
            },
            {
              value: roundForDisplay(moistureToPercentage(getNumericValue(serialData.m1))),
              metric: "Quadrant II",
            },
            {
              value: roundForDisplay(moistureToPercentage(getNumericValue(serialData.m2))),
              metric: "Quadrant III",
            },
            {
              value: roundForDisplay(moistureToPercentage(getNumericValue(serialData.m3))),
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
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Sensor Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <p><span className="font-bold">Air Humidity:</span> {serialData.air_humidity !== undefined ? `${serialData.air_humidity}%` : 'N/A'}</p>
                <p><span className="font-bold">Air Temperature:</span> {serialData.air_temperature !== undefined ? `${serialData.air_temperature}°C` : 'N/A'}</p>
                <p><span className="font-bold">Soil Temperature:</span> {serialData.soil_temperature !== undefined ? `${serialData.soil_temperature}°C` : 'N/A'}</p>
                <p><span className="font-bold">Light Level:</span> {serialData.sunlight_visible !== undefined ? `${serialData.sunlight_visible} lux` : 'N/A'}</p>
              </div>
              <div className="mt-3">
                <p className="font-semibold">Raw Moisture Values:</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p>Sensor 1: {serialData.m0 || 'N/A'}</p>
                  <p>Sensor 2: {serialData.m1 || 'N/A'}</p>
                  <p>Sensor 3: {serialData.m2 || 'N/A'}</p>
                  <p>Sensor 4: {serialData.m3 || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
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
