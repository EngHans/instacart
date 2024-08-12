import format from "pg-format";

export enum DBTables {
  CARTS_TABLE = "carts",
  PRODUCTS_TABLE = "products",
}

export const buildCondition = (searchKeys: string[], searchValues: string[][]): string => {
  return searchKeys
    .map((columnName, i) => {
      return `${format("%s", columnName)} IN (${format("%L", searchValues[i])})`;
    })
    .join(" AND ");
};
