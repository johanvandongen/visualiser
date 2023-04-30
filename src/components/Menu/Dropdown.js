import React from "react"

/**
 * 
 * @param {Object} options is an object whose key will be the value and option name
 * @param {string} current is the current option shown. This should be one of the keys in options
 * @param {} onChange function that is executed on change
 * @returns 
 */
export default function Dropdown({options, current, onChange}) {
    return (
        <select onChange={onChange} defaultValue={current}>
        {Object.keys(options).map(key => (
            <option key={key} value={key}> {key} </option>
            ))}
    </select>
    )
}