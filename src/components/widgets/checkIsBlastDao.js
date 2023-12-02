export const checkIsBlastDao = (daoIdOrDaoAdress) => {
  if (daoIdOrDaoAdress) {
    return (
      daoIdOrDaoAdress === "9f9601eb-2f7c-689c-24f0-77ef37c60853" ||
      daoIdOrDaoAdress === "0x50987cf58b7351867952912cf87c75ab2a8a60a4"
    );
  }
};
