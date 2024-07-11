export const orderFacilitiesFilter = (arr: string[]): string[] => {
  const order = [
    "kindergarden",
    "school",
    "school_social_work",
    "youth_vocational_assistance",
  ];

  return arr.sort((a, b) => order.indexOf(a) - order.indexOf(b));
};
