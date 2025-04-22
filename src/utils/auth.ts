export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};
