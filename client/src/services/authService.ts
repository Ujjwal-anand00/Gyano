import api from "./api"

export const loginUser = (data:any) => {
 return api.post("/api/auth/login", data)
}

export const registerUser = (data:any) => {
 return api.post("/api/auth/register", data)
}