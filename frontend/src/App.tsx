import { AppProvider } from "@/providers/app";
import { AppRoutes } from "@/routes";
import { Toaster } from "sonner";
import { AuthLoader } from "@/lib/auth";
import { Spinner } from "@/components/Elements";

function App() {
  return (
    <AppProvider>
      <Toaster richColors={true} position="top-right" />
      <AuthLoader
        renderLoading={() => (
          <div className="w-screen h-screen flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        )}
      >
        <AppRoutes />
      </AuthLoader>
    </AppProvider>
  );
}

export default App;
