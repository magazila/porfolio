export async function getAllPost() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
  //"userId","id","title","body"
}
export async function getAllTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  return response.json();
  //"userId","id","title","completed"
}
export async function getAllComments() {
  const response = await fetch("https://jsonplaceholder.typicode.com/comments");
  return response.json();
  //"postId","id","name","email", "email"
}
export async function getAllPhoto() {
  const response = await fetch("https://jsonplaceholder.typicode.com/photos");
  return response.json();
  //"albumId"","id","title","url", "thumbnailUrl"
}
export async function getAllUser() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return response.json();
  //"name","username","id"
}
