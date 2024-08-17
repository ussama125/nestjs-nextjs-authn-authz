export interface ErrorResponse {
  message: string[] | string;
  errorCode?: string;
}

export type DirtyFields = Record<string, boolean>;

export type SidebarLinks = Array<{
  label: string;
  path: string;
}>;

export interface SelectInterface {
  value: string | number;
  label: string;
}

export interface ValuesMap {
  [key: string | number]: string;
}

export type SelectOptions = SelectInterface[];

export type Sort = "asc" | "desc" | null;
