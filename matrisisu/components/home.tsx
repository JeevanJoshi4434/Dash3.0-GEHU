import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { FaUserDoctor, FaPersonPregnant } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";

const HomePage = () => {
  const { user } = useUser();
  return (
    <main className="flex flex-col items-center justify-center ">
      <div className="md:p-16 w-full flex flex-col items-center justify-center relative">
        <div className="border mb-6 border-gray-400 p-2 rounded-full flex items-center justify-center">
          <Search size={20} className="text-gray-400 mx-2" />
          <input
            type="text"
            placeholder="Search nearby hospitals, doctors and medicines"
            className=" outline-none w-96"
          />{" "}
          <button className="rounded-full bg-green-700 px-3 py-2 text-white">
            Search
          </button>
        </div>
        <div className="flex items-center mb-4 justify-center">
          <FaUserDoctor size={50} />
          <span className="w-[1px] h-20 flex bg-black mx-2"></span>
          <div className="text-green-700">
            <h1 className=" font-semibold text-2xl">Upcoming Weakly Session</h1>
            <p className="text-sm font-semibold text-black mb-4">
              The sunday session with Doctor Lorem Epsum
            </p>
          </div>
        </div>
        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/0 to-white/50 z-10 rounded-md pointer-events-none"></div> */}
        <Carousel>
          <CarouselContent className="flex items-center">
            <CarouselItem className="min-w-full lg:px-42 flex items-center justify-center">
              <Image
                src="/assets/images/e2.jpg"
                alt="Nanhi-Sanjivani"
                width={1000}
                height={300}
                className=" object-cover aspect-[12/5] h-[350px] rounded-md"
              />
            </CarouselItem>
            <CarouselItem className="min-w-full lg:px-42 flex items-center justify-center">
              <Image
                src="/assets/images/event.jpg"
                alt="Nanhi-Sanjivani"
                width={1000}
                height={300}
                className=" object-cover aspect-[12/5] h-[350px] rounded-md"
              />
            </CarouselItem>
            <CarouselItem className="min-w-full lg:px-42 flex items-center justify-center">
              <Image
                src="/assets/images/e3.jpg"
                alt="Nanhi-Sanjivani"
                width={1000}
                height={300}
                className=" object-cover aspect-[12/5] h-[350px] rounded-md"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div>
          <div
            className="flex items-center justify-center gap-18
           my-10 "
          >
            <Link
              className="flex flex-col items-center justify-center"
              href="/community"
            >
              <Image
                src="/assets/icons/com.jpg"
                className="w-24 rounded-full object-cover border shadow-lg h-24"
                alt=""
                width={200}
                height={200}
              />
              <p className="text-sm hover:font-bold">Community</p>
            </Link>
            <Link
              className="flex flex-col items-center justify-center"
              href="/diet"
            >
              <Image
                src="/assets/icons/diet.jpg"
                className="w-24 rounded-full object-cover border shadow-lg h-24"
                alt=""
                width={200}
                height={200}
              />
              <p className="text-sm hover:font-bold">Diet Planner</p>
            </Link>
            <Link
              className="flex flex-col items-center justify-center"
              href="/#eduMat"
            >
              <Image
                src="/assets/icons/edu.jpg"
                className="w-24 rounded-full object-cover border shadow-lg h-24"
                alt=""
                width={200}
                height={200}
              />
              <p className="text-sm hover:font-bold">Edu-Maternal</p>
            </Link>
            <Link
              className="flex flex-col items-center justify-center"
              href="/hospitals"
            >
              <Image
                src="/assets/icons/hos.jpg"
                className="w-24 rounded-full object-cover border shadow-lg h-24"
                alt=""
                width={200}
                height={200}
              />
              <p className="text-sm hover:font-bold">Hospitals/Med</p>
            </Link>
            <Link
              className="flex flex-col items-center justify-center"
              href="/paper"
            >
              <Image
                src="/assets/icons/pap.jpg"
                className="w-24 rounded-full object-cover border shadow-lg h-24"
                alt=""
                width={200}
                height={200}
              />
              <p className="text-sm hover:font-bold">E-presc</p>
            </Link>
            <Link
              className="flex flex-col items-center justify-center"
              href="/doctor"
            >
              <Image
                src="/assets/icons/tele.jpg"
                className="w-24 rounded-full object-cover border shadow-lg h-24"
                alt=""
                width={200}
                height={200}
              />
              <p className="text-sm hover:font-bold">e-Consult</p>
            </Link>
            <Link
              className="flex flex-col items-center justify-center"
              href="/asha"
            >
              <Image
                src="/assets/icons/volun.jpg"
                className="w-24 rounded-full object-cover border shadow-lg h-24"
                alt=""
                width={200}
                height={200}
              />
              <p className="text-sm hover:font-bold">ASHA/Volunteer</p>
            </Link>
          </div>
          <div id="eduMat" >
            <div className="flex items-center mb-4 justify-center">
              <FaPersonPregnant size={50} />
              <span className="w-[1px] h-20 flex bg-black mx-2"></span>
              <div className="text-green-700">
                <h1 className=" font-semibold text-2xl">Edu-Maternal</h1>
                <p className="text-sm font-semibold text-black mb-4">
                  Healthy Mamma, Healthy Baby
                </p>
              </div>
            </div>
            <Carousel
              opts={{
                align: "start",
              }}
              className=""
            >
              <CarouselContent>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <iframe
                    width="360"
                    height="200"
                    src="https://www.youtube.com/embed/BtPJMlZ3w_U?si=D4lXpvuyFaCjztyP"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </CarouselItem>

                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <iframe
                    width="360"
                    height="200"
                    src="https://www.youtube.com/embed/XKZPUN6P9lg?si=kjVMStBDvV5a1jlq"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <iframe
                    width="360"
                    height="200"
                    src="https://www.youtube.com/embed/vOZMYnjyX2I?si=9oIRaGblc7J6AkoM"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                  <iframe
                    width="360"
                    height="200"
                    src="https://www.youtube.com/embed/dec5WEj6gb4?si=h_dGlu2v8_UjXQsi"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="flex mt-24 items-center mb-4 justify-center text-center">
            <div className="flex items-center mb-4 justify-center">
              <div className="text-green-700  flex flex-col items-center justify-center">
                <Image src="/assets/images/logo.jpg" width={20} height={20} className="w-16 shadow-md h-16 mb-4 rounded-full" />
                <h1 className=" font-semibold text-2xl">नन्ही संजीवनी</h1>
                <p className="text-sm font-semibold text-black mb-4">
                Dedicated Care for Mothers and Babies, Anytime, Anywhere.<br/>
                  <p>
                  revolutionize maternal and child healthcare by leveraging AI-driven telemedicine, predictive analytics, and community engagement. It aims to provide accessible, personalized, and preventive healthcare through multilingual chatbots, smart nutrition planning, real-time health tracking, and ASHA worker empowerment, ensuring last-mile connectivity even in underserved regions.
                </p>
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-40 w-full"></div>
    </main>
  );
};

export default HomePage;
