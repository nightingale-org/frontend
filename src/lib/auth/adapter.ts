import type { Adapter, AdapterAccount, AdapterSession, AdapterUser } from 'next-auth/adapters';
import { del, FetchInputMethod, get, patch, post } from '@/lib/api/fetch';
import { NotFoundError } from '@/lib/api/fetch/errors';
import { UserSchema } from '@/lib/api/schemas';

const getOrNull = async <T>(input: FetchInputMethod<T>): Promise<T | null> => {
  try {
    return await get<T>(input);
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return null;
    }
    throw e;
  }
};

export default function RestAPIAdapter(): Adapter {
  return {
    async createUser(user) {
      const { name: username, ...rest } = user;
      const userPayload = { username, ...rest };
      return await post({
        url: '/users',
        data: userPayload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    async getUser(id) {
      return await getOrNull<AdapterUser>({
        url: `/users/?id=${id}`,
        validationModel: UserSchema
      });
    },
    async getUserByEmail(email) {
      return await getOrNull<AdapterUser>({
        url: `/users/?email=${email}`,
        validationModel: UserSchema
      });
    },
    async getUserByAccount({ providerAccountId }) {
      return await getOrNull<AdapterUser>({
        url: `/users/?provider_account_id=${providerAccountId}`,
        validationModel: UserSchema
      });
    },
    async updateUser(user) {
      const userUpdatePayload = { username: user.name, image: user.image };
      return await patch({
        url: '/users',
        data: userUpdatePayload,
        validationModel: UserSchema
      });
    },
    async deleteUser(userId: string): Promise<void> {
      await del({ url: `/users/${userId}` });
    },
    async linkAccount(account: AdapterAccount) {
      await post({ url: `/users/account/link`, data: account });
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await post({
        url: `/users/account/unlink/${provider}/${providerAccountId}`
      });
    },

    async createSession() {
      return {} as AdapterSession;
    },
    async getSessionAndUser() {
      return null;
    },
    async updateSession() {
      return null;
    },
    async deleteSession() {}
  };
}
