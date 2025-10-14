import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1", // your backend base URL
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
