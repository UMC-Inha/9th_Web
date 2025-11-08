import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//import InfinitePostJsonPlaceholder from "./components/InfinitePostsJsonPlaceholder";
import InfinitePostsAutoJsonPlaceholder from "./components/InfinitePostsAutoJsonPlaceholder";

//1. QueryClient 인스턴스 생성 -> 모든 쿼리 상태 관리
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InfinitePostsAutoJsonPlaceholder />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;
