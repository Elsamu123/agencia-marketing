export const initialState = {
  items: [],  // Los productos en el carrito
  loading: false,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true };

    case 'SET_LOADING_FINISHED':
      return { ...state, loading: false };  

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false };


    case 'ADD_ITEM':
        // Verificar si state.items es un arreglo antes de continuar
        if (!Array.isArray(state.items)) {
          console.error("`state.items` no es un arreglo. Inicializando `state.items` como un arreglo vacío.");
          return { ...state, items: [] }; // Inicializamos items como un arreglo vacío si no lo es
        }
  
        const existingItemIndex = state.items.findIndex(item => item.producto.id === action.payload.producto.id);
        if (existingItemIndex > -1) {

          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex], // Copiar las propiedades del item
            cantidad: updatedItems[existingItemIndex].cantidad + action.payload.cantidad, // Actualizar la cantidad
          };
          return { ...state, items: updatedItems };
        } else {
          return { ...state, items: [...state.items, action.payload] };
        }

    case 'REMOVE_ITEM':
      return { ...state, loading: false, items: state.items.filter(item => item.producto.id !== action.payload) };

    case 'CLEAR_CART':
        if (state.items.length === 0) {
          console.log('El carrito ya está vacío');
        } else {
          return { ...state, items: [] };
        }
        return state;

    default:
      return state;
  }
};