import { useEffect } from "react";
import { useEventStore } from "../store/eventStore";

const useCategories = () => {
  const { categories, isLoadingCategories, getCategories } = useEventStore();

  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
  }, [categories, getCategories]);

  return { categories, isLoadingCategories };
};

export default useCategories;
