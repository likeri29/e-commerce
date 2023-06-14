import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((p) => p.price);
      maxPrice = Math.max(...maxPrice);
      return {
        ...state,
        allProducts: [...action.payload],
        filteredProducts: [...action.payload],
        filters: { ...state.filters, maxPrice: maxPrice, price: maxPrice },
      };

    case SET_GRIDVIEW:
      return { ...state, gridView: true };

    case SET_LISTVIEW:
      return { ...state, gridView: false };

    case UPDATE_SORT:
      return { ...state, sort: action.payload };

    case SORT_PRODUCTS:
      const { sort, filteredProducts } = state;
      let tempProducts = [...filteredProducts];

      if (sort === "price-lowest") {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price);
      }
      if (sort === "price-highest") {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price);
      }
      if (sort === "name-a") {
        tempProducts = tempProducts.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
      if (sort === "name-z") {
        tempProducts = tempProducts.sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }
      return { ...state, filteredProducts: tempProducts };

    case UPDATE_FILTERS:
      const { name, value } = action.payload;
      return { ...state, filters: { ...state.filters, [name]: value } };

    case FILTER_PRODUCTS:
      const { allProducts } = state;
      const { text, company, category, color, price, shipping } = state.filters;
      let tempAllProducts = [...allProducts];

      if (text) {
        tempAllProducts = tempAllProducts.filter((product) =>
          product.name.toLowerCase().includes(text)
        );
      }
      if (category !== "all") {
        tempAllProducts = tempAllProducts.filter(
          (product) => product.category === category
        );
      }
      if (company !== "all") {
        tempAllProducts = tempAllProducts.filter(
          (product) => product.company === company
        );
      }
      if (color !== "all") {
        tempAllProducts = tempAllProducts.filter((product) => {
          return product.colors.find((c) => c === color);
        });
      }
      tempAllProducts = tempAllProducts.filter(
        (product) => product.price <= price
      );
      if (shipping) {
        tempAllProducts = tempAllProducts.filter(
          (product) => product.shipping === true
        );
      }

      return { ...state, filteredProducts: tempAllProducts };

    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          company: "all",
          category: "all",
          color: "all",
          price: state.filters.maxPrice,
          shipping: false,
        },
      };

    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default filter_reducer;
