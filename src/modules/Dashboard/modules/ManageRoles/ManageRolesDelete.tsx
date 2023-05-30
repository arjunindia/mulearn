import { useEffect, useState } from "react";
import { deleteManageRoles, getManageRolesDetails } from "./apis";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../../../components/MuComponents/Form/Form";
import { useToast } from "@chakra-ui/react";

type Props = {};

const ManageRolesDelete = (props: Props) => {
    const [input, setInput] = useState("");
	const { id } = useParams();
    const toast = useToast();
	useEffect(() => {
        getManageRolesDetails(id, setInput);
    }, []);
	const navigate = useNavigate();
    const handleSubmit = () => {
        deleteManageRoles(id, toast);
		navigate("/manage-roles");
		
    };
    return (
        <div>
            <Form
                title={`Are you sure you want to delete ${input} ?`}
                handleSubmitClick={handleSubmit}
                cancelPath={"/manage-roles"}
            />
        </div>
    );
};

export default ManageRolesDelete;
