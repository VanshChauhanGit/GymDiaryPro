"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { daysOfWeek, exercisesData } from "@/utils/helper";
import { useRouter } from "next/navigation";
import {
  fetchWorkoutPlan,
  createWorkoutPlan,
  updateWorkoutPlan,
} from "@/actions/userActions";
import { useLoader } from "@/utils/useLoader";
import { useToast } from "@/components/Toast";
import { useSession } from "next-auth/react";

const WorkoutPlanForm = () => {
  const [activeDay, setActiveDay] = useState(""); // Tracks which day's section is expanded
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [isEditMode, setIsEditMode] = useState(false); // Tracks if the user is editing an existing plan
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    targetedMuscle: "",
  });

  const router = useRouter();
  const { data: session } = useSession();
  const showToast = useToast();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (session) {
      loadWorkoutPlan();
    } else {
      router.push("/");
    }
  }, [session, router]);

  const loadWorkoutPlan = async () => {
    showLoader();
    try {
      const response = await fetchWorkoutPlan(session.user.email);

      if (response.status === 200) {
        setWorkoutPlan(response.data.workoutPlan);
        setIsEditMode(true);
      } else if (response.status === 404) {
        setWorkoutPlan(
          daysOfWeek.reduce((plan, day) => {
            plan[day] = { isRest: false, exercises: [], selectedMuscles: [] };
            return plan;
          }, {})
        );
        setIsEditMode(false);
      }
      hideLoader();
    } catch (error) {
      console.error("Error loading workout plan:", error);
      hideLoader();
      showToast("error", "An error occurred. Please try again.");
    }
  };

  const handleSaveWorkout = async () => {
    const allDaysValid = daysOfWeek.every((day) => {
      const dayData = workoutPlan[day];
      return (
        dayData.isRest ||
        (dayData.exercises.length > 0 && dayData.selectedMuscles.length > 0)
      );
    });

    if (!allDaysValid) {
      showToast(
        "info",
        "Please complete all days' workouts or mark them as rest."
      );
      return;
    }

    showLoader();
    try {
      const response = isEditMode
        ? await updateWorkoutPlan(session.user.email, workoutPlan)
        : await createWorkoutPlan(session.user.email, workoutPlan);

      if (response.status === 200) {
        showToast("success", "Workout Plan saved successfully!");
        router.push("/workoutplan");
      } else {
        showToast("error", response.error || "Failed to save workout plan.");
      }
    } catch (error) {
      console.error("Error saving workout plan:", error);
      showToast("error", "An error occurred. Please try again.");
    }
    hideLoader();
  };

  const toggleDaySection = (day) => {
    setActiveDay((prevDay) => (prevDay === day ? "" : day));
  };

  const handleRestToggle = (day) => {
    setWorkoutPlan((prevWorkoutPlan) => ({
      ...prevWorkoutPlan,
      [day]: {
        ...prevWorkoutPlan[day],
        isRest: !prevWorkoutPlan[day]?.isRest,
        exercises: [],
        selectedMuscles: [],
      },
    }));
  };

  const handleMuscleChange = (day, selectedOptions) => {
    setWorkoutPlan((prevWorkoutPlan) => ({
      ...prevWorkoutPlan,
      [day]: {
        ...prevWorkoutPlan[day],
        selectedMuscles: selectedOptions,
      },
    }));
  };

  const handleAddExercise = (day) => {
    if (
      !newExercise.name ||
      !newExercise.sets ||
      !newExercise.reps ||
      !newExercise.targetedMuscle
    ) {
      showToast("info", "Please complete all exercise details.");
      return;
    }

    const existingExercises = workoutPlan[day]?.exercises || [];
    if (
      existingExercises.some((exercise) => exercise.name === newExercise.name)
    ) {
      showToast("warning", "This exercise is already added.");
      return;
    }

    setWorkoutPlan((prevWorkouts) => ({
      ...prevWorkouts,
      [day]: {
        ...prevWorkouts[day],
        exercises: [...existingExercises, newExercise],
      },
    }));
    setNewExercise({ name: "", sets: "", reps: "", targetedMuscle: "" });
  };

  const handleDeleteExercise = (day, index) => {
    setWorkoutPlan((prevWorkoutPlan) => {
      const updatedExercises = prevWorkoutPlan[day].exercises.filter(
        (_, i) => i !== index
      );
      return {
        ...prevWorkoutPlan,
        [day]: {
          ...prevWorkoutPlan[day],
          exercises: updatedExercises,
        },
      };
    });
  };

  return (
    <div className="w-full bg-background rounded-lg">
      <h2 className="m-4 text-2xl font-bold text-center">
        {isEditMode ? "Edit Workout Plan" : "Create Workout Plan"}
      </h2>

      {daysOfWeek.map((day) => (
        <div key={day} className="mb-4">
          <div
            className="flex items-center justify-between p-3 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer"
            onClick={() => toggleDaySection(day)}
          >
            <h3 className="text-xl font-semibold">{day}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestToggle(day);
              }}
              className={`py-1 px-3 rounded ${
                workoutPlan[day]?.isRest
                  ? "bg-red-500 text-white opacity-80 hover:opacity-100"
                  : "bg-green-500 text-white opacity-80 hover:opacity-100"
              }`}
            >
              {workoutPlan[day]?.isRest ? "Cancel Rest" : "Set as Rest"}
            </button>
          </div>

          {activeDay === day && !workoutPlan[day]?.isRest && (
            <div className="p-4 mt-4 border rounded-lg">
              <h4 className="text-lg font-semibold">Muscles to Train</h4>
              <Select
                isMulti
                options={Object.keys(exercisesData).map((muscle) => ({
                  value: muscle,
                  label: muscle,
                }))}
                value={workoutPlan[day]?.selectedMuscles}
                onChange={(selectedOptions) =>
                  handleMuscleChange(day, selectedOptions)
                }
              />
              <h4 className="mt-4 text-lg font-semibold">Add Exercises</h4>
              <div className="mb-4">
                <label className="block mb-2">Targeted Muscle</label>
                <select
                  value={newExercise.targetedMuscle}
                  onChange={(e) =>
                    setNewExercise({
                      ...newExercise,
                      targetedMuscle: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select a muscle</option>
                  {workoutPlan[day]?.selectedMuscles?.map((muscle) => (
                    <option key={muscle.value} value={muscle.value}>
                      {muscle.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Exercise</label>
                <select
                  value={newExercise.name}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select an exercise</option>
                  {newExercise.targetedMuscle &&
                    exercisesData[newExercise.targetedMuscle]?.map(
                      (exercise) => {
                        const isSelected = workoutPlan[day]?.exercises?.some(
                          (addedExercise) => addedExercise.name === exercise
                        );
                        return (
                          <option
                            key={exercise}
                            value={exercise}
                            disabled={isSelected}
                            style={isSelected ? { color: "#d1d5db" } : {}}
                          >
                            {exercise}
                          </option>
                        );
                      }
                    )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Sets</label>
                <select
                  value={newExercise.sets}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, sets: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select Sets</option>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((set) => (
                    <option key={set} value={set}>
                      {set}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Reps</label>
                <select
                  value={newExercise.reps}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, reps: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select Rep Range</option>
                  <option value="1-4">1 - 4</option>
                  <option value="4-8">4 - 8</option>
                  <option value="8-12">8 - 12</option>
                  <option value="12-16">12 - 16</option>
                  <option value="16-20">16 - 20</option>
                  <option value="20-25">20 - 25</option>
                  <option value="25-30">25 - 30</option>
                </select>
              </div>

              <button
                onClick={() => handleAddExercise(day)}
                className="px-4 py-2 mb-4 text-white rounded-lg bg-primary hover:bg-secondary hover:text-text"
              >
                + Add Exercise
              </button>

              {workoutPlan[day]?.exercises?.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {workoutPlan[day].exercises.map((exercise, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md bg-secondary"
                    >
                      <span>
                        {exercise.name} - {exercise.sets} sets of{" "}
                        {exercise.reps} reps ( Targeted Muscle:{" "}
                        {exercise.targetedMuscle})
                      </span>
                      <button
                        onClick={() => handleDeleteExercise(day, index)}
                        className="p-1 text-red-500 border-2 border-red-500 rounded-md hover:bg-primary"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={handleSaveWorkout}
          className="px-4 py-2 w-full mt-4 font-semibold rounded-lg text-white bg-black bg-opacity-90 hover:bg-opacity-100"
        >
          Save Workout Plan
        </button>
      </div>
    </div>
  );
};

export default WorkoutPlanForm;

// "use client";
// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import { daysOfWeek, exercisesData } from "@/utils/helper";
// import { useRouter } from "next/navigation";
// import {
//   fetchWorkoutPlan,
//   createWorkoutPlan,
//   updateWorkoutPlan,
// } from "@/actions/userActions";
// import { useLoader } from "@/utils/useLoader";
// import { useToast } from "@/components/Toast";
// import { useSession } from "next-auth/react";

// const WorkoutPlanForm = () => {
//   const [activeDay, setActiveDay] = useState(""); // Tracks which day's section is expanded
//   const [workoutPlan, setWorkoutPlan] = useState({});
//   const [newExercise, setNewExercise] = useState({
//     name: "",
//     sets: "",
//     reps: "",
//     targetedMuscle: "",
//   });

//   const router = useRouter();
//   const { data: session } = useSession();
//   const showToast = useToast();
//   const { showLoader, hideLoader } = useLoader();

//   useEffect(() => {
//     showLoader();
//     if (session) {
//       getWorkoutPlan();
//       hideLoader();
//     } else {
//       hideLoader();
//       router.push("/");
//     }
//     hideLoader();
//   }, [session, router]);

//   const getWorkoutPlan = async () => {
//     showLoader();
//     try {
//       const data = await fetchWorkoutPlan(session.user.email);
//       setWorkoutPlan(data);
//       console.log(data);
//       hideLoader();
//     } catch (error) {
//       console.error("Error fetching workout plan:", error);
//       hideLoader();
//       showToast("error", "An error occurred. Please try again.");
//     }
//   };

//   const toggleDaySection = (day) => {
//     setActiveDay((prevDay) => (prevDay === day ? "" : day));
//   };

//   const handleRestToggle = (day) => {
//     setWorkoutPlan((prevWorkoutPlan) => ({
//       ...prevWorkoutPlan,
//       [day]: {
//         ...prevWorkoutPlan[day],
//         isRest: !prevWorkoutPlan[day]?.isRest,
//         exercises: !prevWorkoutPlan[day]?.isRest
//           ? []
//           : prevWorkoutPlan[day]?.exercises,
//         selectedMuscles: [],
//       },
//     }));
//   };

//   const handleMuscleChange = (day, selectedOptions) => {
//     setWorkoutPlan((prevWorkoutPlan) => ({
//       ...prevWorkoutPlan,
//       [day]: {
//         ...prevWorkoutPlan[day],
//         selectedMuscles: selectedOptions,
//       },
//     }));
//   };

//   const handleAddExercise = (day) => {
//     if (
//       !newExercise.name ||
//       !newExercise.sets ||
//       !newExercise.reps ||
//       !newExercise.targetedMuscle
//     ) {
//       showToast("info", "Please complete all exercise details.");
//       return;
//     }

//     // Prevent duplicate exercises
//     const existingExercises = workoutPlan[day]?.exercises || [];
//     if (
//       existingExercises.some((exercise) => exercise.name === newExercise.name)
//     ) {
//       showToast(
//         "warning",
//         "This exercise is already added for the selected day."
//       );
//       return;
//     }

//     setWorkoutPlan((prevWorkouts) => ({
//       ...prevWorkouts,
//       [day]: {
//         ...prevWorkouts[day],
//         exercises: [...existingExercises, newExercise],
//       },
//     }));
//     setNewExercise({ name: "", sets: "", reps: "", targetedMuscle: "" }); // Reset form
//   };

//   const handleDeleteExercise = (day, index) => {
//     setWorkoutPlan((prevWorkoutPlan) => {
//       const updatedExercises = prevWorkoutPlan[day].exercises.filter(
//         (_, i) => i !== index
//       );
//       return {
//         ...prevWorkoutPlan,
//         [day]: {
//           ...prevWorkoutPlan[day],
//           exercises: updatedExercises,
//         },
//       };
//     });
//   };

//   const handleSaveWorkout = () => {
//     const allFilled = daysOfWeek.every((day) => {
//       const dayData = workoutPlan[day];
//       return (
//         dayData?.isRest ||
//         (dayData?.exercises?.length > 0 && dayData?.selectedMuscles?.length > 0)
//       );
//     });

//     if (!allFilled) {
//       showToast(
//         "info",
//         "Please complete all days workout or mark them as rest."
//       );
//       return;
//     }

//     const res = createWorkoutPlan(session.user.email, workoutPlan);
//     console.log("res : ", res);
//     if (res.error) {
//       showToast("error", res.message);
//       return;
//     }

//     // if (!res.ok) {
//     //   showToast("error", res.message);
//     //   return;
//     // }

//     showToast("success", "Workout Plan Saved Successfully!");

//     router.push("/workoutplan");
//   };

//   return (
//     <div className="w-full bg-background rounded-lg">
//       <h2 className="m-4 text-2xl font-bold text-center">
//         Weekly Workout Plan
//       </h2>

//       {daysOfWeek.map((day) => (
//         <div key={day} className="mb-4">
//           {/* Day Header */}
//           <div
//             className="flex items-center justify-between p-3 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer"
//             onClick={() => toggleDaySection(day)}
//           >
//             <h3 className="text-xl font-semibold">{day}</h3>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleRestToggle(day);
//               }}
//               className={`py-1 px-3 rounded ${
//                 workoutPlan[day]?.isRest
//                   ? "bg-red-500 text-white opacity-80 hover:opacity-100"
//                   : "bg-green-500 text-white opacity-80 hover:opacity-100"
//               }`}
//             >
//               {workoutPlan[day]?.isRest ? "Cancel Rest" : "Set as Rest"}
//             </button>
//           </div>

//           {/* Day Content */}
//           {activeDay === day && !workoutPlan[day]?.isRest && (
//             <div className="p-4 mt-4 border rounded-lg">
//               <h4 className="text-lg font-semibold">Muscles to Train</h4>
//               <Select
//                 isMulti
//                 options={[
//                   ...Object.keys(exercisesData).map((muscle) => ({
//                     value: muscle,
//                     label: muscle,
//                   })),
//                 ]}
//                 value={workoutPlan[day]?.selectedMuscles}
//                 onChange={(selectedOptions) =>
//                   handleMuscleChange(day, selectedOptions)
//                 }
//               />

//               <h4 className="mt-4 text-lg font-semibold">Add Exercises</h4>
//               <div className="mb-4">
//                 <label className="block mb-2">Targeted Muscle</label>
//                 <select
//                   value={newExercise.targetedMuscle}
//                   onChange={(e) =>
//                     setNewExercise({
//                       ...newExercise,
//                       targetedMuscle: e.target.value,
//                     })
//                   }
//                   className="w-full px-4 py-2 border rounded-md"
//                 >
//                   <option value="">Select a muscle</option>
//                   {workoutPlan[day]?.selectedMuscles?.map((muscle) => (
//                     <option key={muscle.value} value={muscle.value}>
//                       {muscle.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2">Exercise</label>
//                 <select
//                   value={newExercise.name}
//                   onChange={(e) =>
//                     setNewExercise({ ...newExercise, name: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border rounded-md"
//                 >
//                   <option value="">Select an exercise</option>
//                   {newExercise.targetedMuscle &&
//                     exercisesData[newExercise.targetedMuscle]?.map(
//                       (exercise) => {
//                         const isSelected = workoutPlan[day]?.exercises?.some(
//                           (addedExercise) => addedExercise.name === exercise
//                         );
//                         return (
//                           <option
//                             key={exercise}
//                             value={exercise}
//                             disabled={isSelected}
//                             style={isSelected ? { color: "#d1d5db" } : {}}
//                           >
//                             {exercise}
//                           </option>
//                         );
//                       }
//                     )}
//                 </select>
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2">Sets</label>
//                 <select
//                   value={newExercise.sets}
//                   onChange={(e) =>
//                     setNewExercise({ ...newExercise, sets: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border rounded-md"
//                 >
//                   <option value="">Select Sets</option>
//                   {Array.from({ length: 8 }, (_, i) => i + 1).map((set) => (
//                     <option key={set} value={set}>
//                       {set}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2">Reps</label>
//                 <select
//                   value={newExercise.reps}
//                   onChange={(e) =>
//                     setNewExercise({ ...newExercise, reps: e.target.value })
//                   }
//                   className="w-full px-4 py-2 border rounded-md"
//                 >
//                   <option value="">Select Rep Range</option>
//                   <option value="1-4">1 - 4</option>
//                   <option value="4-8">4 - 8</option>
//                   <option value="8-12">8 - 12</option>
//                   <option value="12-16">12 - 16</option>
//                   <option value="16-20">16 - 20</option>
//                   <option value="20-25">20 - 25</option>
//                   <option value="25-30">25 - 30</option>
//                 </select>
//               </div>

//               <button
//                 onClick={() => handleAddExercise(day)}
//                 className="px-4 py-2 mb-4 text-white rounded-lg bg-primary hover:bg-secondary hover:text-text"
//               >
//                 + Add Exercise
//               </button>

//               {workoutPlan[day]?.exercises?.length > 0 && (
//                 <ul className="flex flex-col gap-2">
//                   {workoutPlan[day].exercises.map((exercise, index) => (
//                     <li
//                       key={index}
//                       className="flex items-center justify-between p-2 rounded-md bg-secondary"
//                     >
//                       <span>
//                         {exercise.name} - {exercise.sets} sets of{" "}
//                         {exercise.reps} reps ( Targeted Muscle:{" "}
//                         {exercise.targetedMuscle})
//                       </span>
//                       <button
//                         onClick={() => handleDeleteExercise(day, index)}
//                         className="p-1 text-red-500 border-2 border-red-500 rounded-md hover:bg-primary"
//                       >
//                         Delete
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )}

//           {activeDay === day && workoutPlan[day]?.isRest && (
//             <p className="mt-4 text-gray-500">This day is marked as rest.</p>
//           )}
//         </div>
//       ))}

//       <div className="text-center">
//         <button
//           onClick={handleSaveWorkout}
//           className="px-4 py-2  w-full mt-4 font-semibold rounded-lg text-white bg-black bg-opacity-90 hover:bg-opacity-100"
//         >
//           Save WorkoutPlan
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WorkoutPlanForm;
