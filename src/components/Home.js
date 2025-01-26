import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background w-full text-text font-body">
      <section className="text-gray-600 body-font border-b border-gray-200">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Welcome to GymDiary - Your Fitness Companion
            </h1>
            <p className="mb-8 leading-relaxed">
              Keep track of your fitness journey, log exercises, and manage your
              workout plans all in one place. Fit helps you stay consistent and
              achieve your fitness goals with ease.
            </p>
            <div className="flex justify-center">
              <Link href={"/login"}>
                <button className="inline-flex text-white bg-black border-0 py-2 px-6 focus:outline-none bg-opacity-90 hover:bg-opacity-100 rounded text-lg">
                  Get Started
                </button>
              </Link>
              <Link href={"#learn-more"}>
                <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="Fitness"
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>
        </div>
      </section>

      <section
        id="learn-more"
        className="text-gray-600 body-font bg-background min-h-screen flex flex-col justify-center items-center"
      >
        <div className="container mx-auto px-5 bg-gray-200 py-16">
          <h2 className="text-3xl font-medium title-font text-gray-900 mb-12 text-center">
            Learn More About GymDiary !
          </h2>
          <div className="flex flex-wrap -m-4">
            <div className="p-4 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full bg-white p-8 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Track Your Progress
                </h3>
                <p className="leading-relaxed text-base">
                  Log every exercise, track your sets and reps, and monitor your
                  progress over time to stay motivated and on track.
                </p>
              </div>
            </div>
            <div className="p-4 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full bg-white p-8 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Custom Workout Plans
                </h3>
                <p className="leading-relaxed text-base">
                  Create personalized workout plans tailored to your goals and
                  adapt them as you grow stronger.
                </p>
              </div>
            </div>
            <div className="p-4 lg:w-1/3 md:w-1/2 w-full">
              <div className="h-full bg-white p-8 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Stay Consistent
                </h3>
                <p className="leading-relaxed text-base">
                  Use reminders and progress tracking to build habits and stay
                  consistent with your fitness journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
