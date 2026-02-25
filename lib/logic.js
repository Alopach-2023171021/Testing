const calculateValue = (price, stock) => {
  if (price < 0 || stock < 0) return 0;
  //Calcula el valor total de inventario
  return price * stock;
};

module.exports = { calculateValue };