import React from "react";

const Features = ({ darkMode }) => {
  return (
    <div
      className={`py-24 sm:py-32 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <p
          className={`mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance ${
            darkMode ? "text-gray-100" : "text-gray-950"
          } sm:text-5xl`}>
          Everything you need to grow your business
        </p>

        {/* Grid Layout for Features */}
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Feature 1: Mobile Friendly */}
          <div className="relative lg:row-span-2">
            <div
              className={`absolute inset-px rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } lg:rounded-l-[2rem]`}></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p
                  className={`mt-2 text-lg font-medium tracking-tight ${
                    darkMode ? "text-gray-100" : "text-gray-950"
                  } max-lg:text-center`}>
                  Mobile Friendly
                </p>
                <p
                  className={`mt-2 max-w-lg text-sm/6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } max-lg:text-center`}>
                  Our designs are fully responsive, ensuring your website looks
                  great on all devices.
                </p>
              </div>
              <div className="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div
                  className={`absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] ${
                    darkMode ? "border-gray-600" : "border-gray-700"
                  } bg-gray-900 shadow-2xl`}>
                  <img
                    className="size-full object-cover object-top"
                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                    alt="Mobile-friendly design"
                  />
                </div>
              </div>
            </div>
            <div
              className={`pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ${
                darkMode ? "ring-white/10" : "ring-black/5"
              } lg:rounded-l-[2rem]`}></div>
          </div>

          {/* Feature 2: Performance */}
          <div className="relative max-lg:row-start-1">
            <div
              className={`absolute inset-px rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } max-lg:rounded-t-[2rem]`}></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p
                  className={`mt-2 text-lg font-medium tracking-tight ${
                    darkMode ? "text-gray-100" : "text-gray-950"
                  } max-lg:text-center`}>
                  High Performance
                </p>
                <p
                  className={`mt-2 max-w-lg text-sm/6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } max-lg:text-center`}>
                  Optimized for speed and efficiency, delivering a seamless user
                  experience.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                <img
                  className="w-full max-lg:max-w-xs"
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                  alt="High performance"
                />
              </div>
            </div>
            <div
              className={`pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ${
                darkMode ? "ring-white/10" : "ring-black/5"
              } max-lg:rounded-t-[2rem]`}></div>
          </div>

          {/* Feature 3: Security */}
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div
              className={`absolute inset-px rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p
                  className={`mt-2 text-lg font-medium tracking-tight ${
                    darkMode ? "text-gray-100" : "text-gray-950"
                  } max-lg:text-center`}>
                  Top-Notch Security
                </p>
                <p
                  className={`mt-2 max-w-lg text-sm/6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } max-lg:text-center`}>
                  We prioritize your data's safety with industry-leading
                  security measures.
                </p>
              </div>
              <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <img
                  className="h-[min(152px,40cqw)] object-cover"
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                  alt="Security"
                />
              </div>
            </div>
            <div
              className={`pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ${
                darkMode ? "ring-white/10" : "ring-black/5"
              }`}></div>
          </div>

          {/* Feature 4: Powerful APIs */}
          <div className="relative lg:row-span-2">
            <div
              className={`absolute inset-px rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]`}></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <p
                  className={`mt-2 text-lg font-medium tracking-tight ${
                    darkMode ? "text-gray-100" : "text-gray-950"
                  } max-lg:text-center`}>
                  Scalable Solutions
                </p>
                <p
                  className={`mt-2 max-w-lg text-sm/6 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } max-lg:text-center`}>
                  Our APIs and infrastructure are designed to grow with your
                  business.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow">
                <div
                  className={`absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl ${
                    darkMode ? "bg-gray-800" : "bg-gray-900"
                  } shadow-2xl`}>
                  <div
                    className={`flex ${
                      darkMode
                        ? "bg-gray-700/40 ring-1 ring-white/5"
                        : "bg-gray-800/40 ring-1 ring-white/5"
                    }`}>
                    <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                      <div
                        className={`border-r border-b ${
                          darkMode
                            ? "border-r-white/10 border-b-white/20 bg-white/5"
                            : "border-r-white/10 border-b-white/20 bg-white/5"
                        } px-4 py-2 text-white`}>
                        NotificationSetting.jsx
                      </div>
                      <div
                        className={`border-r ${
                          darkMode ? "border-gray-600/10" : "border-gray-600/10"
                        } px-4 py-2`}>
                        App.jsx
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-14">
                    {/* Your code example */}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ${
                darkMode ? "ring-white/10" : "ring-black/5"
              } max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
