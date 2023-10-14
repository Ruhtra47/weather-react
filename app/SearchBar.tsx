"use client";
import styled from "styled-components";

// TODO: definir o estilo e handle state do componente de pesquisa de cidade

const StyledInput = styled.input`
  padding: 8px;
  font-size: 12pt;

  margin: 8px;
`;

export default function SearchBar({
  value,
  setValue,
}: {
  value: string;
  setValue: any;
}) {
  return (
    <StyledInput
      type="text"
      value={value}
      onChange={(txt) => {
        setValue(txt.target.value);
      }}
      placeholder="Search..."
    />
  );
}
