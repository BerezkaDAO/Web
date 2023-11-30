export const checkIsBlastDao = (dao) => {
  if (dao) {
    return dao.name === "berezkablastdao";
  }
};
