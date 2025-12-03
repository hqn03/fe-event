import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";

function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function HeroSection({ data }) {
  const chunks = chunk(data, 2);

  return (
    <div className="my-8">
      <Carousel>
        <CarouselContent>
          {chunks.map((pair, idx) => (
            <CarouselItem key={idx} className={"flex gap-4"}>
              {pair.map((event) => (
                <div
                  key={event.ma_su_kien}
                  className="flex-1 items-center justify-center relative"
                >
                  <img
                    src={event.hinh_anh}
                    className="w-full h-80 rounded-lg"
                  />
                  <Button className={"absolute bottom-4 left-4"}>
                    Xem chi chi tiết
                  </Button>
                </div>
              ))}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default HeroSection;
