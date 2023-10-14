import styled from "styled-components";

const Button = styled.button`
  margin: 8px;
  border-style: solid;
  border-radius: 0;
  border-color: black;
  background-color: white;
  padding: 10px;
`;

export default function SearchButton({
  value,
  handleClick,
}: {
  value: string;
  handleClick: any;
}) {
  return <Button onClick={handleClick}>{value}</Button>;
}
