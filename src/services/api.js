import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// USERS API
export async function getUsers() {
  const res = await api.get("users");
  return res.data;
}

export async function createUser(data) {
  return await api.post("users", data);
}

export async function updateUser(data) {
  return await api.put(`users/${data.id_nguoi_dung}`, data);
}

export async function deleteUser(data) {
  return await api.delete(`users/${data.id_nguoi_dung}`);
}

// ROLES API
export async function getRoles() {
  const res = await api.get("roles");
  return res.data;
}

// AUTH API
export async function login(data) {
  const res = await api.post("auth/login", data);
  return res;
}

export async function getMe(data) {
  const res = await api.get("/me", data);
  return res.data;
}

// MANAGER EVENTS API
export async function getManagerEvents() {
  const res = await api.get("manager/events");
  return res.data;
}

export async function createEvent(data) {
  const res = await api.post("manager/events", data);
  return res;
}

export async function getEvent(data) {
  const res = await api.get(`manager/events/${data.id}`);
  return res.data;
}

export async function deleteEvent(data) {
  return await api.delete(`events/${data.id}`);
}

// CLIENT EVENTS API
export async function getClientEvents() {
  const res = await api.get("events");
  return res.data;
}

export async function getClientEvent(data) {
  const res = await api.get(`events/${data.slug}`);
  return res.data;
}

// EVENT APPROVAL
export async function publishEvent(data) {
  return await api.post("event-approvals", data);
}

export async function getEventApprovals() {
  const res = await api.get("event-approvals");
  console.log(res.data);
  return res.data;
}

export async function updateEventApproval(data) {
  return await api.put(`event-approvals/${data.id}`, data);
}

// EVENT TYPES
export async function getEventTypes() {
  const res = await api.get("event-types");
  return res.data;
}

export async function createEventType(data) {
  return await api.post("event-types", data);
}

export async function updateEventType(data) {
  return await api.put("event-types", data);
}

export async function deleteEventType(data) {
  return await api.delete(`event-types/${data.id}`);
}

// SESSION - TICKETS API
export async function createUpdateSessionTickets(data) {
  return await api.put(`manager/events/${data.id}/sessions`, data);
}

// UPLOAD R2
export async function signUrl(data) {
  const res = await api.post("sign-url", data);
  return res.data;
}

export default api;
