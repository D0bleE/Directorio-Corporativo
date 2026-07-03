import { api } from 'boot/axios'

export const getUsers = async (limit = 10, skip = 0) => {
  const { data } = await api.get(`/users?limit=${limit}&skip=${skip}`)

  return data
}
