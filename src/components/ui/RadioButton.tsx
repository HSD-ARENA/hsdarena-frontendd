import React from "react";
import Input from "./Input";

interface RadioButtonProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    checked: boolean;
    onSelect: () => void;
    placeholder: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
    name,
    value,
    onChange,
    checked,
    onSelect,
    placeholder,
}) => {
    return (
        <div className="flex items-center w-full gap-2">
            <Input type="radio" name={name} checked={checked} onChange={onSelect} className="accent-rose-500 w-5 h-5 shrink-0" />
            <Input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full" />
        </div>
    );
};

export default RadioButton;

