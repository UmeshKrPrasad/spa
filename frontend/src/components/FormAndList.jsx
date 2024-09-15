// src/components/FormAndList.js
import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Alert, Container, Row, Col, Table, Image } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";

function FormAndList() {
  const { users, addUser, editUser, deleteUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(""); // For displaying existing image
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setPhone(selectedUser.phone);
      setExistingImage(selectedUser.image ? `http://localhost:5000/${selectedUser.image}` : "");
      setImage(null); // Reset new image
    } else {
      // Reset form when switching to create mode
      setName("");
      setEmail("");
      setPhone("");
      setImage(null);
      setExistingImage("");
    }
  }, [selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Invalid phone number");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (selectedUser) {
        await editUser(selectedUser._id, formData);
      } else {
        await addUser(formData);
      }
      setSelectedUser(null); // Reset selected user
      setError("");
    } catch (error) {
      setError("Error submitting the form");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col md={12} lg={6}>
          <h2 className="text-center mb-4">{selectedUser ? "Edit User" : "Create User"}</h2>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              {existingImage && !image && (
                <div className="mb-2">
                  <Image src={existingImage} alt="Existing" style={{ width: "100px", height: "auto" }} rounded />
                </div>
              )}
              <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              {selectedUser ? "Save Changes" : "Submit"}
            </Button>
            {selectedUser && (
              <Button variant="secondary" onClick={() => setSelectedUser(null)} className="w-100 mt-2">
                Cancel
              </Button>
            )}
          </Form>
        </Col>
        <Col md={12} lg={6}>
          <h2 className="text-center mb-4">User List</h2>
          <Table striped bordered hover responsive className="shadow bg-light">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.image ? <Image src={`http://localhost:5000/${user.image}`} alt={user.name} style={{ width: "100px", height: "auto" }} rounded /> : "No Image"}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(user)} className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => deleteUser(user._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default FormAndList;
