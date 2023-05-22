import type {Adapter, AdapterAccount, AdapterUser} from "next-auth/adapters";
import {del, get, post} from "@/libs/fetch-wrapper/fetch";
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
      return await post('http://localhost:8000/api/v1/users', user, {
        'Content-Type': 'application/json'
      })
    },
    async getUser(id) {
      return await getOrNull<AdapterUser>(`http://localhost:8000/api/v1/users/?id=${id}`)
    },
    async getUserByEmail(email) {
      return await getOrNull<AdapterUser>(`http://localhost:8000/api/v1/users/?email=${email}`)
    },
    async getUserByAccount({providerAccountId, provider}) {
      return await getOrNull<AdapterUser>(`http://localhost:8000/api/v1/users/?provider_account_id=${providerAccountId}&provider=${provider}`)
    },
    async updateUser(user) {
      return await post('http://localhost:8000/api/v1/users', user)
    },
    async deleteUser(userId: string): Promise<void> {
      await del(`http://localhost:8000/api/v1/users/${userId}`)
    },
    async linkAccount(account: AdapterAccount) {
      await post<AdapterAccount>(`http://localhost:8000/api/v1/users/link/`, account)
    },
    async unlinkAccount({providerAccountId, provider}) {
      // TODO: implement account unlinking
      return
    },
  }
}
