import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets } from '../actions/assetActions';
import { Table, Container } from 'react-bootstrap';

const AssetList = () => {
  const dispatch = useDispatch();
  const { assets } = useSelector((state) => state.assets);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  return (
    <Container>
      <h2 className="mt-4">Asset List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Status</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.status}</td>
              <td>{asset.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AssetList;
