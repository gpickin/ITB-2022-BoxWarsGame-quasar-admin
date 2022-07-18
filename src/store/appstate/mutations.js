export const loginUser = (state, userData) => {
  state.jwtToken = userData.jwt;
  state.oUser = userData.email;
  state.isLoggedIn = true;
};
export const logoutUser = (state) => {
  state.oUser = "";
  state.jwtToken = "";
  state.isLoggedIn = false;
};
