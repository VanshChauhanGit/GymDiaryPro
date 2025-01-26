"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/Toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoader } from "@/utils/useLoader";
import { fetchWorkoutPlan } from "@/actions/userActions";
import Home from "@/components/Home";
import { FaDumbbell, FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import Link from "next/link";

const Dashboard = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [todayDay, setTodayDay] = useState(null);
  const [exercises, setExercises] = useState([]);

  const router = useRouter();
  const { data: session } = useSession();
  const showToast = useToast();
  const { showLoader, hideLoader } = useLoader();

  const getWorkoutPlan = async () => {
    showLoader();
    try {
      const res = await fetchWorkoutPlan(session.user.email);
      if (res.error) {
        hideLoader();
        showToast("error", res.message);
        return;
      } else {
        setWorkoutPlan(res.data.workoutPlan);
      }
      hideLoader();
    } catch (error) {
      console.error("Error fetching workout plan:", error);
      hideLoader();
      showToast("error", "An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    showLoader();
    if (session) {
      getWorkoutPlan();
      const currentDate = new Date();
      const dayOfWeek = currentDate.toLocaleString("en-us", {
        weekday: "long",
      });
      setTodayDay(dayOfWeek);
      hideLoader();
    }
    hideLoader();
  }, [session, router]);

  if (!session) {
    return <Home />;
  }

  return (
    <div className="min-h-screen bg-background contain text-text font-body">
      {/* <div className="min-h-screen bg-[#f2ffee] p-6">
        <header className="text-center text-3xl font-bold text-[#071e00] mb-8">
          Welcome to Your GymDiary
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <FaDumbbell className="text-4xl text-[#3efe18]" />
              <h3 className="text-2xl font-semibold text-[#071e00]">
                Exercise Records
              </h3>
            </div>
            <p className="text-lg text-[#071e00] mb-4">
              Keep track of your exercise routines, sets, reps, and weights.
            </p>
            <Link
              href="/exercise-records"
              className="text-[#71feca] hover:text-[#3afeef] text-lg font-semibold"
            >
              View Exercise Records
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <FaCalendarAlt className="text-4xl text-[#3efe18]" />
              <h3 className="text-2xl font-semibold text-[#071e00]">
                Weekly Workout Plan
              </h3>
            </div>
            <p className="text-lg text-[#071e00] mb-4">
              Plan and manage your weekly workout schedule.
            </p>
            <Link
              href="/workout-plan"
              className="text-[#71feca] hover:text-[#3afeef] text-lg font-semibold"
            >
              View Workout Plan
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <FaClipboardList className="text-4xl text-[#3efe18]" />
              <h3 className="text-2xl font-semibold text-[#071e00]">
                Exercise Logs
              </h3>
            </div>
            <p className="text-lg text-[#071e00] mb-4">
              Log your exercises, weights, reps, and sets after each workout.
            </p>
            <Link
              href="/exercise-logs"
              className="text-[#71feca] hover:text-[#3afeef] text-lg font-semibold"
            >
              View Exercise Logs
            </Link>
          </div>
        </div>
      </div> */}
      <section className="py-2">
        {workoutPlan ? (
          <div>
            <h2 className="mb-3 text-2xl font-bold text-center">
              Today's Workout
            </h2>
            {workoutPlan?.[todayDay]?.isRest === false ? (
              <div className="space-y-2">
                {workoutPlan[todayDay]?.selectedMuscles.map((muscle) => (
                  <div key={muscle.value} className="mt-6">
                    <h5 className="text-xl font-bold text-primary">
                      {muscle.value}
                    </h5>

                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full border-collapse table-auto">
                        <thead>
                          <tr>
                            <th className="p-2 border border-gray-300 rounded-lg">
                              Exercise
                            </th>
                            <th className="w-24 p-2 border border-gray-300">
                              Sets
                            </th>
                            <th className="w-24 p-2 border border-gray-300">
                              Reps Range
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {workoutPlan[todayDay]?.exercises
                            ?.filter(
                              (exercise) =>
                                exercise.targetedMuscle === muscle.value
                            )
                            .map((exercise, index) => (
                              <tr key={index} className="odd:bg-gray-200">
                                <td className="p-2 border border-gray-300">
                                  {exercise.name}
                                </td>
                                <td className="w-24 p-2 text-center border border-gray-300">
                                  {exercise.sets}
                                </td>
                                <td className="w-24 p-2 text-center border border-gray-300">
                                  {exercise.reps}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-10 text-2xl text-center text-black">
                Today is a Rest Day!
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 text-2xl text-center text-black">
            Workout Plan not found!
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
