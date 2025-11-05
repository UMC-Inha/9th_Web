import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfinintePostsJsonPlaceholder from "./components/InfinitePostsJsonPlaceholder";
import InfinitePostsAutoJsonPlaceholder from "./components/InfinitePostsAutoJsonPlaceholder";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InfinitePostsAutoJsonPlaceholder />
    </QueryClientProvider>
  );
}

export default App;
