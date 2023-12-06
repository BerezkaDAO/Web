export const checkIsBlastDao = (daoIdOrDaoAdress) => {
  if (daoIdOrDaoAdress) {
    const decapitalizedAdress = daoIdOrDaoAdress.toLowerCase();
    return (
      decapitalizedAdress === "9f9601eb-2f7c-689c-24f0-77ef37c60853" ||
      decapitalizedAdress === "0x50987cf58b7351867952912cf87c75ab2a8a60a4" ||
      decapitalizedAdress === "61371f22-3854-e8b7-de97-6fe362301019"
    );
  }
};
