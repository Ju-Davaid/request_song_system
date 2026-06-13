import { createBrowserRouter } from "react-router-dom";
import MusicStation from "@/pages/music/index";
import LoginPage from "@/pages/music/LoginPage";
import RequestSongPage from "@/pages/RequestSongPage";
import StationPage from "@/pages/music/StationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequestSongPage />,
  },
  {
    path: "/music",
    element: <MusicStation />,
    children: [
      {
        index: true,
        element: <StationPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
export default router;
