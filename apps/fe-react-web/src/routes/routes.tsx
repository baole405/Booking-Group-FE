import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "@/pages/home/home-page";

export default function MainRoutes() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<Navigate replace to="/" />} path="/home" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
