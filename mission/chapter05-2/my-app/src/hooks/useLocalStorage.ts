export const useLocalStorage = () => {
  const get = (key: string) => localStorage.getItem(key);
  const set = (key: string, value: string) => localStorage.setItem(key, value);
  const remove = (key: string) => localStorage.removeItem(key);
  return { get, set, remove };
};
