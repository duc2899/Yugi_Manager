import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import adminAPI from "api/adminAPI";

export const formatRecipient = (account) =>
  `${account._id} - ${account.username} (${account.displayName || ""})`;

export default function useRecipientSearch(query, skip = false) {
  const [debouncedQuery] = useDebounce(query, 300);
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q || skip) {
      setOptions([]);
      setSearching(false);
      return undefined;
    }

    let cancelled = false;
    setSearching(true);
    adminAPI
      .searchMailRecipients({ q, limit: 10 })
      .then((res) => {
        if (!cancelled) setOptions(res?.data || []);
      })
      .catch(() => {
        if (!cancelled) setOptions([]);
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, skip]);

  return { options, searching };
}
