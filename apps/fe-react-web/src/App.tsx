import { Toaster } from "@/components/ui/sonner";
import MainRoutes from "@/routes/routes";
import "./App.css";

const TITLE = "EXE Booking";

function App() {
  return (
    <div>
      <title>{TITLE}</title>
      <Toaster position="top-right" />
      <MainRoutes />
    </div>
  );
}

export default App;
