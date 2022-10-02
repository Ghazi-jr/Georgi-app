import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import MapBox from "./components/mapBox";
import logo from "./logo.png";
const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
            <div className="px-4 py-6 sm:px-0">
              <div className="flex h-500 rounded-lg border-4 border-gray-200">
                <div className="flex-initial w-64"></div>
                <MapBox />
                <MapBox />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
