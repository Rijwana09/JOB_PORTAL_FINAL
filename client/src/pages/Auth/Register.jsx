import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../api/axios";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
    //   "http://localhost:5000/api/v1/auth/register",
  

    const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data;

        try {
            const response = await api.post(
            "http://localhost:5000/api/v1/auth/register",
            registerData
            );

            console.log(
            "Registration response:",
            response.data
            );

            toast.success(
            response.data?.message ||
                "Registration successful!"
            );
        } catch (error) {
            console.error(
            "Registration failed:",
            error.response?.data || error.message
            );

    const message =
      error.response?.data?.message ||
      "Registration failed. Please try again.";

    toast.error(message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border p-6 shadow-sm">
          <h1 className="text-2xl font-bold">
            Create Account
          </h1>

          <p className="mt-2 text-sm">
            Register for a new account
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message:
                      "Name must be between 2 and 50 characters",
                  },
                  maxLength: {
                    value: 50,
                    message:
                      "Name must be between 2 and 50 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message:
                      "Name can contain only letters and spaces",
                  },
                })}
                className="w-full rounded-lg border px-3 py-2 outline-none"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least 8 characters long",
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&#^()_\-+=]).{8,}$/,
                    message:
                      "Password must contain uppercase, lowercase, number and special character",
                  },
                })}
                className="w-full rounded-lg border px-3 py-2 outline-none"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password ||
                    "Passwords do not match",
                })}
                className="w-full rounded-lg border px-3 py-2 outline-none"
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg px-4 py-2 font-medium"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;