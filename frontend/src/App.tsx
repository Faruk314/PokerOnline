import { Suspense, useEffect } from "react";
import Game from "./pages/Game";
import { Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JoinGame from "./pages/JoinGame";
import CreateGame from "./pages/CreateGame";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getLoginStatus } from "./store/slices/auth";
import ProtectedRoutes from "./protection/ProtectedRoutes";
import GameOver from "./modals/GameOver";
import "./App.css";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import { useSocketEvents } from "./hooks/useSocketEvents";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";
import Shop from "./pages/Shop";
import Payment from "./pages/Payment";

function App() {
  const { gameStatus } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  useSocketEvents();

  return (
    <Suspense fallback={<Loader />}>
      {gameStatus.isGameOver && <GameOver />}

      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/join" element={<JoinGame />} />
          <Route path="/create" element={<CreateGame />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/payment/:packageId" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-canceled" element={<PaymentCanceled />} />
          <Route path="/game/:id" element={<Game />} />
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
