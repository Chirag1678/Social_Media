import React, { useId } from "react"

const TextArea = React.forwardRef(({
    label,
    className="",
    ...props
},ref) => {
    const id=useId();
  return (
    <div className="w-full">
        {label && <label className="inline-block mb-1 pl-1" htmlFor={id}>{label}</label>}
        <textarea className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`} id={id} ref={ref} {...props}/> 
    </div>
  )
})
export default TextArea;
