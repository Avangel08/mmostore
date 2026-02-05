import { usePage } from "@inertiajs/react";
import { useMemo } from "react";

// get param from url
export function useQueryParams(): Record<string, string | undefined> {
  const { url } = usePage();

  return useMemo(() => {
    const search = url.split("?")[1] || "";
    const params = new URLSearchParams(search);
    const obj: Record<string, string | undefined> = {};

    params.forEach((value, key) => {
      obj[key] = value;
    });

    return obj;
  }, [url]);
}
