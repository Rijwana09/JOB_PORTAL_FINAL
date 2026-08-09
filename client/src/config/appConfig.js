const appConfig = {
  appName: "MERN Job Portal",

  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api/v1",

  paginationLimit: 10,

  defaultTheme: "light",
};

export default appConfig;