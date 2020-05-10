import { navigate } from "gatsby";

const NotFoundPage = () => {
  if (typeof window !== "undefined") {
    navigate("/", { replace: true });
  }

  return null;
};

export default NotFoundPage;
