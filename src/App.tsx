import { Shelf } from "@/pages/Shelf";
import { Route, Routes } from "react-router-dom";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Shelf />} />
      <Route path="/tea/:teaId" element={<Shelf />} />
      <Route path="*" element={<Shelf />} />
    </Routes>
  );
}
