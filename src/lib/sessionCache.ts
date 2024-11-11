// // lib/sessionCache.js
// const sessionCache = {};

// // Set token with expiration logic
// function setToken(ip, token, expiresIn = 3600) {
//   console.log("IP from session Cache" + ip);
//   const expirationTime = Date.now() + expiresIn * 1000;
//   sessionCache[ip] = { token, expirationTime };
// }

// // Get token and validate expiration
// function getToken(ip) {
//   const session = sessionCache[ip];
//   if (!session) return null;

//   if (Date.now() > session.expirationTime) {
//     delete sessionCache[ip]; // Remove expired token
//     return null;
//   }
//   return {
//     token: session.token,
//     expirationTime: session.expirationTime,
//   };
// }

// // Remove token from the cache
// function removeToken(ip) {
//   delete sessionCache[ip];
// }

// // function getTokenExpiration(ip) {
// //   return sessionCache[ip]?.expirationTime; // Retrieve expiration time
// // }

// export {
//   setToken,
//   getToken,
//   removeToken,
//   //  getTokenExpiration
// };

// Define the structure for session data
interface SessionData {
  token: string;
  expirationTime: number;
}

// Session cache object with IP as keys and session data as values
const sessionCache: Record<string, SessionData> = {};

/**
 * Set a token in the cache with an expiration time.
 * @param ip - The IP address of the user.
 * @param token - The token to store.
 * @param expiresIn - Time in seconds until the token expires (default is 3600).
 */
function setToken(ip: string, token: string, expiresIn: number = 3600): void {
  console.log("IP from session Cache: " + ip);
  const expirationTime = Date.now() + expiresIn * 1000;
  sessionCache[ip] = { token, expirationTime };
}

/**
 * Get a token from the cache and validate its expiration.
 * @param ip - The IP address of the user.
 * @returns The token and expiration time, or null if expired or not found.
 */
function getToken(
  ip: string
): { token: string; expirationTime: number } | null {
  const session = sessionCache[ip];
  if (!session) return null;

  if (Date.now() > session.expirationTime) {
    delete sessionCache[ip]; // Remove expired token
    return null;
  }

  return {
    token: session.token,
    expirationTime: session.expirationTime,
  };
}

/**
 * Remove a token from the cache.
 * @param ip - The IP address of the user.
 */
function removeToken(ip: string): void {
  delete sessionCache[ip];
}

export { setToken, getToken, removeToken };
