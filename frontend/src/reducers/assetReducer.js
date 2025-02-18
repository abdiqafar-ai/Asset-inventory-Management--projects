const initialState = {
    assets: [],
    requests: [],
    error: null,
  };
  
  const assetReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_ASSETS_SUCCESS':
        return {
          ...state,
          assets: action.payload,
        };
      case 'REQUEST_ASSET_SUCCESS':
        return {
          ...state,
          requests: [...state.requests, action.payload],
        };
      default:
        return state;
    }
  };
  
  export default assetReducer;
  