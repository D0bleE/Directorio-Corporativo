import { api } from 'boot/axios'

export const getUsers = async (limit = 10, skip = 0) => {
  const { data } = await api.get(`/users?limit=${limit}&skip=${skip}`)

  return data
}

export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`)

  return data
}

export const getUserCarts = async (userId) => {
  const { data } = await api.get(`/users/${userId}/carts`)

  return data
}
