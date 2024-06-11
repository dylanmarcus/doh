export function calculateTotalQuantity(ingredientQuantities) {
    return ingredientQuantities.reduce((total, quantity) => total + quantity, 0);
  }
  
  export function percentageToGrams(bakerPercentage, baseIngredient) {
    return (bakerPercentage / 100) * baseIngredient;
  }