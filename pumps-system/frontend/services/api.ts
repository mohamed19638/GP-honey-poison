export async function getPumps() {
  const res = await fetch("http://localhost:5194/api/pumps");
  return res.json();
}

export async function getPump(id: number) {
  const res = await fetch(`http://localhost:5194/api/pumps/${id}`);
  return res.json();
}   


export async function register(data: any) {
  const res = await fetch("http://localhost:5194/api/Auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text(); 

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(text);
  }

  if (!res.ok) {
    throw new Error(result.message || "Register failed");
  }

  return result;
}
export async function login(data: any) {
  const res = await fetch("http://localhost:5194/api/Auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await res.text(); 

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(text);
  }

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
}

