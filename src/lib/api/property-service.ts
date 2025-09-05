import { axiosClient } from "./axios-instance";
import { PropertyFilterDto, PropertiesResponse } from "../types/property";

export const propertyService = {
  async getProperties(
    filterDto: PropertyFilterDto = {}
  ): Promise<PropertiesResponse> {
    try {
      const response = await axiosClient.get("/properties", {
        params: filterDto,
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
};
