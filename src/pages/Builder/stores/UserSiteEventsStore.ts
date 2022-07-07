import { writable } from "svelte/store";
import type { UserSiteEvent } from "../../../global";

export const UserSiteEventsStore = writable({} as UserSiteEvent);
