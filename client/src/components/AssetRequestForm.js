import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { requestAsset } from '../actions/assetActions';
import { Form, Button, Container } from 'react-bootstrap';

const AssetRequestForm = () => {
  const [assetName, setAssetName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const assetData = {
      assetName,
      quantity,
      urgency,
    };
    dispatch(requestAsset(assetData));
  };

  return (
    <Container>
      <h2 className="mt-4">Request Asset</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formAssetName">
          <Form.Label>Asset Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter asset name"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formQuantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formUrgency">
          <Form.Label>Urgency</Form.Label>
          <Form.Control as="select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">Submit Request</Button>
      </Form>
    </Container>
  );
};

export default AssetRequestForm;
