import styled from "styled-components";

const Divider = styled.hr`
	height: 2px;

	border-radius: 2px;
	background-color: ${({ theme }) => theme.palette.dark.contrast};
`;

export default Divider;
