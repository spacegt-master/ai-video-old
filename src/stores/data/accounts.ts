import { defineStore } from "pinia";
import { ref } from "vue";

export interface Users {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface Authorities {
  authority: string;
  key: string;
  name: string | null;
}

const account = ref<Users>();

const authorities = ref<Authorities[]>([]);

export const useAccountsStore = defineStore(
  "data-accounts",
  () => {
    return { account, authorities };
  },
  {
    persist: true,
  }
);

export function matchAuthorities(
  authorities: Authorities[],
  hasAuthority: string[] | undefined
) {
  if (!hasAuthority) return true;

  if (hasAuthority) {
    return (
      authorities.findIndex((item) => hasAuthority.includes(item.key)) > -1
    );
  }
}

export function hasAuthority(authority: string) {
  return authorities.value.findIndex((item) => item.key == authority) > -1;
}
