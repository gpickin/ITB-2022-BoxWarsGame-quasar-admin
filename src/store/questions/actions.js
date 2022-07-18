import { axiosInstance } from "boot/axios";

export const deleteQuestion = (state, payload) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete("questions/" + payload.questionID)
      .then((response) => {
        if (!response.data.error) {
          //   state.commit("deleteQuestion", payload.questionID);
          resolve();
        } else {
          reject();
        }
      })
      .catch((error) => {
        console.log(error);
        reject();
      });
  });
};
