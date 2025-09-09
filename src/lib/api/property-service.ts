import { axiosClient } from "./axios-instance";
import { PropertiesResponse } from "../types/property";

export const propertyService = {
  async getProperties(
    params: { page?: number; limit?: number } = {}
  ): Promise<PropertiesResponse> {
    try {
      const response = await axiosClient.get("/properties", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },

  async getPropertyById(id: string) {
    try {
      const response = await axiosClient.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching property:", error);
      throw error;
    }
  },

  async deleteProperty(id: string) {
    try {
      const response = await axiosClient.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },
};
