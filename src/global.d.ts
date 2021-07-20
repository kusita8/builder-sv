/// <reference types="svelte" />

import type { ENUMS } from "./enums";

export interface Item {
  parentId: string | null;
  id: string;
  tag: string;
  label: string;
  depth: number;
  node: HTMLElement | null;
  hasChildren: boolean;
  showingChildren: boolean;
}

export interface UserSiteEvent {
  event: keyof typeof ENUMS.USER_SITE_EVENTS;
  data: any;
}

export interface StyleStoreItem {
  [id: string]: {
    [target]: string
  }
}
