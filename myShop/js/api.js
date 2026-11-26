// Единственное место, где живут адрес базы, ключ и все запросы.
const BASE_URL = "https://giiohrrglvtetatdevpq.supabase.co";
const API_KEY = "sb_publishable_GgkKCoz484V78El8HyTCyg_W1gsmJkf"; // публичный ключ, ему можно быть в браузере
const TOKEN_KEY = "shop_token";

export const isLoggedIn = () => Boolean(sessionStorage.getItem(TOKEN_KEY));
export const logout = () => sessionStorage.removeItem(TOKEN_KEY);

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Неверная почта или пароль");
  const { access_token } = await res.json();
  sessionStorage.setItem(TOKEN_KEY, access_token);
}

async function request(path, { method = "GET", body, returnRows = false } = {}) {
  const headers = { apikey: API_KEY, "content-type": "application/json" };
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  if (returnRows) headers.Prefer = "return=representation";

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body && JSON.stringify(body),
  });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    const info = await res.json().catch(() => ({}));
    err.details = info.message || "";
    console.error("Ответ базы:", info);
    throw err;
  }
  const data = res.status === 204 ? null : await res.json();

  // RLS не даёт ошибку на чужие PATCH/DELETE, а просто не трогает строки.
  // Пустой ответ значит «ничего не изменилось», и это нужно показать как ошибку.
  if (returnRows && method !== "POST" && data.length === 0) {
    const err = new Error("Нет прав или товар не найден");
    err.status = 403;
    throw err;
  }
  return data;
}

const FIELDS =
  "id,name,short_desc,price,discount,stock,width,height,category,in_stock,images";
const byId = (id) => `?id=eq.${encodeURIComponent(Number(id))}`;

export const getProducts = () =>
  request(`/rest/v1/products?select=${FIELDS}&order=id.desc`);

export const addProduct = async (product) =>
  (await request("/rest/v1/products", { method: "POST", body: product, returnRows: true }))[0];

export const updateProduct = (id, changes) =>
  request(`/rest/v1/products${byId(id)}`, { method: "PATCH", body: changes, returnRows: true });

export const deleteProduct = (id) =>
  request(`/rest/v1/products${byId(id)}`, { method: "DELETE", returnRows: true });
