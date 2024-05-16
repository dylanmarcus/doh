export function calculateTotalQuantity(ingredientQuantities) {
    return ingredientQuantities.reduce((total, quantity) => total + quantity, 0);
  }
  
  // Convert percentage to grams
  export function percentageToGrams(bakerPercentage, baseIngredient) {
    return (bakerPercentage / 100) * baseIngredient;
  }