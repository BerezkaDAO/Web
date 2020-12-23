const colors = ["#008CB9", "#009ACC", "#00AEE5", "#23BFF1", "#47D2FF"];

export const colorByIndex = (index) => {
  return colors[index % colors.length];
};
