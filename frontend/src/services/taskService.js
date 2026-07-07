import api from "./api.js";
import { toBackendDate } from "../utils/dateHelpers.js";

export const taskService = {
  async getTasks() {
    const { data } = await api.get("/tasks");
    console.log(data);
    return data.data;
  },

  async getTask(id) {
    const { data } = await api.get(`/tasks/${id}`);
    return data.data;
  },

  async createTask(input) {
    const payload = {
      ...input,
      dueDate: toBackendDate(input.dueDate),
    };

    const { data } = await api.post("/tasks", payload);
    return data.data;
  },

  async updateTask(id, input) {
    const payload = {
      ...input,
      ...(input.dueDate !== undefined && {
        dueDate: toBackendDate(input.dueDate),
      }),
    };

    const { data } = await api.put(`/tasks/${id}`, payload);
    return data;
  },

  async deleteTask(id) {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },
};