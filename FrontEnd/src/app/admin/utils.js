export function isAuthenticated(router){
  const token = sessionStorage.getItem("token")
  if(!token) router.push("/admin/login");
}
