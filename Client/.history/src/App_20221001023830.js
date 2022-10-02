import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import "./App.css";
import MapBox from "./components/mapBox";
import logo from "./logo.png";

export default function App() {
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto  px-1 sm:px-3 lg:px-5">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-48 w-48" src={logo} alt="Your Company" />
                </div>
              </div>
            </div>
          </div>
        </Disclosure>
        <header className="bg-white shadow">
          <div className="mx-auto  py-6 px-4 sm:px-6 lg:px-8">
            <h1
              className="text-3xl font-bold tracking-tight "
              style={{ color: "#6366F1" }}
            >
              Geo Locating
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto  py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 divide-x px-4 py-6 sm:px-0 space-x-6">
              <div className="h-500">
                <MapBox />
              </div>
              <div className="h-500">
                <MapBox />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
