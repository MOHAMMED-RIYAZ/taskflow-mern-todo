import { Plus, CheckCircle2, Circle } from "lucide-react";

function Welcome({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between px-6 py-12 text-center">
      <div className="w-full max-w-md flex justify-end">
        <span className="text-[#4964eb] font-bold text-xl">TaskFlow</span>
      </div>

      <div className="w-full max-w-md">
        <div className="relative bg-[#eef1ff] rounded-[40px] h-72 flex items-center justify-center overflow-hidden">
          <div className="absolute w-52 h-52 rounded-full bg-[#dce3ff]" />

          <div className="relative bg-white rounded-3xl shadow-xl p-6 w-64">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400">MY TASKS</p>
                <h3 className="text-lg font-bold text-[#20243a]">
                  Stay Organized
                </h3>
              </div>
              <CheckCircle2 className="text-[#4964eb]" size={30} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#4964eb]" />
                <span className="text-sm text-gray-500 line-through">
                  Plan your day
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Circle className="text-[#4964eb]" />
                <span className="text-sm font-medium text-gray-700">
                  Complete your tasks
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Circle className="text-gray-300" />
                <span className="text-sm text-gray-500">
                  Track your progress
                </span>
              </div>
            </div>

            <div className="mt-6 h-2 rounded-full bg-[#e5e8fa]">
              <div className="h-2 w-2/3 rounded-full bg-[#4964eb]" />
            </div>
          </div>

          <div className="absolute bottom-5 right-7 bg-[#4964eb] text-white rounded-full p-3 shadow-lg">
            <Plus size={25} />
          </div>
        </div>
      </div>

      <div className="max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#20243a] mb-4">
          Manage What To Do
        </h1>

        <p className="text-gray-500 text-base leading-7 mb-9">
          Organize your daily tasks, manage your schedule, and track your
          progress all in one place.
        </p>

        <button
          onClick={onGetStarted}
          className="w-full bg-[#4964eb] hover:bg-[#354fce] text-white font-semibold py-4 rounded-2xl shadow-lg transition active:scale-95"
        >
          Get Started
        </button>

        <p className="text-xs text-gray-400 mt-5">
          Make every day productive with TaskFlow.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
