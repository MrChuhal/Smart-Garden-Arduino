
import Image from "next/image";
import Rad from "@/components/Rad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function Home() {
  return (
    <div className="px-16 py-10">
      <div className="px-32">
        <h1 className="text-4xl font-bold mt-10">
          Welcome to the Smart Garden Management System
        </h1>
      </div>
      <div className="flex  mt-10 gap-4 flex-wrap justify-center">
        <Rad title={"Hydration"} description={"Current Hydration Status"} metric={"%"} bound={100} percentage={75} />
        <Rad title={"Air Temp"} description={"Temperature of Soil"} metric={"°C"} bound={20} percentage={12} />
        <Rad title={"Soil Temp"} description={"Temperature of Soil"} metric={"°C"} bound={20} percentage={12} />
        <Rad title={"Light"} description={"Sunlight"} metric={" Lux"} bound={20} percentage={12} />
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
