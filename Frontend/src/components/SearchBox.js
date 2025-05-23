import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";  
const CustomInput = styled(Form.Control)`
  &::placeholder {
    color: gray;  // Set the placeholder text color to white
  }
`;

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <CustomInput
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
      />
      <Button type="submit" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
