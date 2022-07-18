/*
export const someGetter = (state) => {
}
*/

export const isLoggedIn = (state) => {
  return state.isLoggedIn;
};

export const getUser = (state) => {
  return state.oUser;
};

export const getJWT = (state) => {
  return state.jwtToken;
};
