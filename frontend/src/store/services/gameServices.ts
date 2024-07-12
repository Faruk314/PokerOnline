import apiClient from "../../utils/apiClient";

const API_URL = "/api/game/";

const fetchRooms = async () => {
  const response = await apiClient.get(API_URL + "fetchRooms");

  return response.data;
};

const getGameState = async (roomId: string) => {
  const response = await apiClient.post(API_URL + "getGameState", { roomId });

  return response.data;
};

const gameService = {
  fetchRooms,
  getGameState,
};

export default gameService;
