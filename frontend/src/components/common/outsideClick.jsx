import { useEffect } from "react";

export default (ref, callback) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            callback();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
}