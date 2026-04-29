import axios from "axios";

export async function apiRequest<T>(
  promise: Promise<{ data: T }>
): Promise<T> {
  try {
    const { data } = await promise;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response;

      const message =
        response?.data?.message ||
        response?.data?.error ||
        response?.data?.msg ||
        "Error en la petición";

      throw new Error(message);
    }

    throw new Error("Error inesperado");
  }
}
