import axios from 'axios';

export const fetchAssets = () => async dispatch => {
  try {
    const response = await axios.get('/api/assets');
    dispatch({ type: 'FETCH_ASSETS_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_ASSETS_FAILURE', error: error.message });
  }
};

export const requestAsset = (assetData) => async dispatch => {
  try {
    const response = await axios.post('/api/asset/request', assetData);
    dispatch({ type: 'REQUEST_ASSET_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'REQUEST_ASSET_FAILURE', error: error.message });
  }
};
