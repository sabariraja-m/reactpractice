import { useRouteError } from "react-router-dom";
export default function ErrorElement() {
    let error = useRouteError();
    console.error(error);
    // Uncaught ReferenceError: path is not defined
    return <div>Dang!</div>;
  }