export function authHeaders() {
  const raw = localStorage.getItem('nazareno_user')
  const user = raw ? JSON.parse(raw) : null
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {}
}