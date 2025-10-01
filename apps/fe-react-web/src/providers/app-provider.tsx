import { Toaster as Sonner } from "../components/ui/sonner";
import AuthProvider from "./auth-provider";
import ReduxProvider from "./redux-provider";

type Props = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: Props) => {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
      <Sonner
        position="top-right"
        toastOptions={{
          classNames: {
            success: "!bg-green-0 !border !border-green-200 !text-green-600",
            error: "!bg-red-0 !border !border-red-200 !text-red-600",
            info: "!bg-blue-0 !border !border-blue-200 !text-blue-600",
            warning: "!bg-yellow-0 !border !border-yellow-200 !text-yellow-600",
          },
        }}
      />
    </ReduxProvider>
  );
};

export default AppProvider;
