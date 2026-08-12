import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    login,
    loading,
  } = useAuth();

  const onSubmit = async (data) => {
  try {
    const response = await login(data);

    toast.success(
      response?.message || "Login successful!"
    );

    // navigate("/dashboard");
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Login failed. Please try again.";

    toast.error(message);
  }
};

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="rounded-2xl border p-6 shadow-sm">

          <h1 className="text-2xl font-bold">
            Login
          </h1>

          <p className="mt-2 text-sm">
            Login to your account
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"

                {...register("email", {
                  required:
                    "Email is required",

                  pattern: {
                    value:
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                    message:
                      "Please enter a valid email address",
                  },
                })}

                className="w-full rounded-lg border px-3 py-2 outline-none"
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}

            </div>


            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"

                {...register("password", {
                  required:
                    "Password is required",
                })}

                className="w-full rounded-lg border px-3 py-2 outline-none"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

            </div>


            {/* Remember Me */}
            <div className="flex items-center gap-2">

              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
              />

              <label
                htmlFor="rememberMe"
                className="text-sm"
              >
                Remember me
              </label>

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;






// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import api from "../../api/axios";

// const Login = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

// //       "http://localhost:5000/api/v1/auth/login",

//     const onSubmit = async (data) => {
//         try {
//             const response = await api.post(
//             "http://localhost:5000/api/v1/auth/login",
//             data
//             );

//             console.log("Login response:", response.data);

//             toast.success("Login successful!");
//         } catch (error) {
//             console.error(
//             "Login failed:",
//             error.response?.data || error.message
//             );

//     const message =
//         error.response?.data?.message ||
//         "Login failed. Please try again.";

//         toast.error(message);
//     }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         <div className="rounded-2xl border p-6 shadow-sm">
//           <h1 className="text-2xl font-bold">
//             Login
//           </h1>

//           <p className="mt-2 text-sm">
//             Login to your account
//           </p>

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="mt-6 space-y-4"
//           >
//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="mb-1 block text-sm font-medium"
//               >
//                 Email
//               </label>

//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                     message:
//                       "Please enter a valid email address",
//                   },
//                 })}
//                 className="w-full rounded-lg border px-3 py-2 outline-none"
//               />

//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="mb-1 block text-sm font-medium"
//               >
//                 Password
//               </label>

//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 {...register("password", {
//                   required: "Password is required",
//                 })}
//                 className="w-full rounded-lg border px-3 py-2 outline-none"
//               />

//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-500">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Remember Me */}
//             <div className="flex items-center gap-2">
//               <input
//                 id="rememberMe"
//                 type="checkbox"
//                 {...register("rememberMe")}
//               />

//               <label
//                 htmlFor="rememberMe"
//                 className="text-sm"
//               >
//                 Remember me
//               </label>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full rounded-lg px-4 py-2 font-medium"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;