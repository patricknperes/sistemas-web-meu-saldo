import {
    createContext,
    useContext,
} from "react";

const FormFieldContext = createContext(null);

export function useFormFieldContext() {
    return useContext(FormFieldContext);
}

export default FormFieldContext;
