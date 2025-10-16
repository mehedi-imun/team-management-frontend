import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL, // your backend base URL
    prepareHeaders: (headers) => {
      // Add custom headers if needed
      headers.set("Content-Type", "application/json");
      // headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Team"],
  endpoints: () => ({}),
});
