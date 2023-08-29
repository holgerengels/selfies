
export const endpoint = {
  get(): RequestInit {
    return {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: new Headers({
        "Content-Type": "application/json; charset=utf-8",
      })
    };
  },
  post(): RequestInit {
    return {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: new Headers({
        "Content-Type": "application/json; charset=utf-8",
      })
    };
  },
  postFormData(): RequestInit {
    return {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
    };
  },
};
export async function fetchjson(input: RequestInfo, init: RequestInit,
                             success: (Response) => void,
                             handleError: (Error) => void,
                             error: (string) => void)
{
  try {
    const resp = await fetch(input, init);
    if (resp.ok) {
      const json = await resp.json();
      success(json);
    }
    else {
      const message = await resp.text();
      handleError({code: resp.status, message: message});
      error(message);
    }
  }
  catch (e) {
    handleError({code: 500, message: (e as Error).message});
    error((e as Error).message);
  }
}
export async function fetchblob(input: RequestInfo, init: RequestInit,
                             success: (Response) => void,
                             handleError: (Error) => void,
                             error: (string) => void)
{
  try {
    const resp = await fetch(input, init);
    if (resp.ok) {
      const blob: Blob = await resp.blob();
      success(blob);
    }
    else {
      const message = await resp.text();
      handleError({code: resp.status, message: message});
      error(message);
    }
  }
  catch (e) {
    handleError({code: 500, message: (e as Error).message});
    error((e as Error).message);
  }
}
