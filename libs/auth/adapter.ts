import type {Adapter, AdapterAccount, AdapterSession, AdapterUser} from "next-auth/adapters";
import {del, get, patch, post} from "@/libs/fetch-wrapper/fetch";
import {NotFoundError} from "@/libs/fetch-wrapper/errors";

const getOrNull = async <T extends unknown = {}>(...args: Parameters<typeof get>): Promise<T | null> => {
  try {
    return await get(...args)
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return null;
    }
    throw e;
  }
}

export default function RestAPIAdapter(): Adapter {
  return {
    async createUser(user) {
      const {name: username, ...rest} = user
      const userPayload = {username, ...rest}
      return await post('http://localhost:8000/api/v1/users/', userPayload, {
        'Content-Type': 'application/json'
      })
    },
    async getUser(id) {
      return await getOrNull<AdapterUser>(`http://localhost:8000/api/v1/users/?id=${id}`)
    },
    async getUserByEmail(email) {
      return await getOrNull<AdapterUser>(`http://localhost:8000/api/v1/users/?email=${email}`)
    },
    async getUserByAccount({providerAccountId}) {
      return await getOrNull<AdapterUser>(`http://localhost:8000/api/v1/users/?provider_account_id=${providerAccountId}`)
    },
    async updateUser(user) {
      const {name: username, ...rest} = user
      const userPayload = {username, ...rest}
      return await patch('http://localhost:8000/api/v1/users/', userPayload)
    },
    async deleteUser(userId: string): Promise<void> {
      await del(`http://localhost:8000/api/v1/users/${userId}/`)
    },
    async linkAccount(account: AdapterAccount) {
      await post<AdapterAccount>(`http://localhost:8000/api/v1/users/link/`, account)
    },
    async unlinkAccount({providerAccountId, provider}) {
      await post(`http://localhost:8000/api/v1/users/unlink/${provider}/${providerAccountId}/`)
    },

    async createSession() {
      return {} as AdapterSession
    },
    async getSessionAndUser() {
      return null
    },
    async updateSession() {
      return null
    },
    async deleteSession() {
    }
  }
}
