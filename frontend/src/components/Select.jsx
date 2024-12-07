import React, { useId } from "react";

const Select = React.forwardRef(({ 
    label, 
    className = "", 
    children, 
    ...props 
}, ref) => {
    const id = useId();
    return (
        <div className="w-full flex mt-4 items-center gap-2">
            {label && (
                <label className="inline-block mb-1 pl-1" htmlFor={id}>
                    {label}
                </label>
            )}
            <select
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 ${className}`}
                id={id}
                ref={ref}
                {...props}
            >
                {children}
            </select>
        </div>
    );
});

export default Select;