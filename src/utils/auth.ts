export function getUserRoleFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(payload);
    return payload.role;
  } catch (error) {
    return null;
  }
}
