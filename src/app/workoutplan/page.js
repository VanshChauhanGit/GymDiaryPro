"use client";
import { fetchWorkoutPlan } from "@/actions/userActions";
import { daysOfWeek } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import { useLoader } from "@/utils/useLoader";
import { useToast } from "@/components/Toast";
import { useSession } from "next-auth/react";

function WorkoutPlan() {
  const [activeDay, setActiveDay] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState(null);

  const router = useRouter();
  const { data: session } = useSession();
  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();

  const toggleDaySection = (day) => {
    setActiveDay((prevDay) => (prevDay === day ? "" : day));
  };

  const getWorkoutPlan = async () => {
    console.log("test2");
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
    console.log("test1");
    showLoader();
    if (session) {
      getWorkoutPlan();
      hideLoader();
    } else {
      hideLoader();
      router.push("/");
    }
  }, [session, router]);

  return (
    <>
      <section>
        {workoutPlan ? (
          <>
            <div className="w-full rounded-lg bg-background">
              <h2 className="mb-4 text-2xl font-bold text-center text-black">
                Weekly Workout Plan
              </h2>

              {daysOfWeek.map((day) => (
                <div key={day} className="mb-4">
                  {/* Day Header */}
                  <div
                    className="flex items-center justify-between p-3 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer"
                    onClick={() => toggleDaySection(day)}
                  >
                    <h3 className="text-xl font-semibold text-text">{day}</h3>
                    {activeDay === day ? (
                      <IoIosArrowDropup className="size-8" />
                    ) : (
                      <IoIosArrowDropdown className="size-8" />
                    )}
                  </div>

                  {/* Day Content */}
                  {activeDay === day && !workoutPlan[day]?.isRest && (
                    <div className="p-4 mt-4 border rounded-lg">
                      <div className="mt-2">
                        <h4 className="text-2xl font-bold text-center text-text">
                          Muscles to Train
                        </h4>
                        <div className="mt-2">
                          {workoutPlan[day]?.selectedMuscles.map((muscle) => (
                            <div key={muscle.value} className="mt-8">
                              {/* Muscle Name */}
                              <h5 className="text-xl font-bold text-black">
                                {muscle.value}
                              </h5>

                              {/* Exercises Table */}
                              <div className="mt-2 overflow-x-auto">
                                <table className="w-full border-collapse table-auto">
                                  <thead>
                                    <tr>
                                      <th className="p-2 border border-gray-300 rounded-lg">
                                        Exercise
                                      </th>
                                      <th className="p-2 border border-gray-300">
                                        Sets
                                      </th>
                                      <th className="p-2 border border-gray-300">
                                        Reps Range
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {workoutPlan[day]?.exercises
                                      ?.filter(
                                        (exercise) =>
                                          exercise.targetedMuscle ===
                                          muscle.value
                                      )
                                      .map((exercise, index) => (
                                        <tr
                                          key={index}
                                          className="odd:bg-gray-200"
                                        >
                                          <td className="p-2 border border-gray-300">
                                            {exercise.name}
                                          </td>
                                          <td className="p-2 text-center border border-gray-300">
                                            {exercise.sets}
                                          </td>
                                          <td className="p-2 text-center border border-gray-300">
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
                      </div>
                    </div>
                  )}

                  {activeDay === day && workoutPlan[day]?.isRest && (
                    <p className="px-2 mt-4 text-xl text-primary">
                      The day is marked as rest.
                    </p>
                  )}
                </div>
              ))}
              <div className="text-center">
                <button
                  onClick={() => router.push("/workoutplan/edit")}
                  className="px-4 py-2 mt-4 font-semibold rounded-lg bg-black text-white bg-opacity-80 hover:bg-opacity-100"
                >
                  Edit WorkoutPlan
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen p-4 bg-background">
            <h2 className="mb-4 text-2xl font-bold text-center text-black md:text-3xl lg:text-4xl">
              There is not any workout plan yet!
            </h2>
            <button
              className="px-6 py-2 font-bold transition rounded bg-black text-white bg-opacity-90 hover:bg-opacity-100 md:py-3 md:px-8 md:text-lg"
              onClick={() => router.push("/workoutplan/edit")}
            >
              Add WorkoutPlan
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default WorkoutPlan;
