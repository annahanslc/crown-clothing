import "./button.styles.scss";

// default button

// inverted button

// google sign in button

const BUTTON_TYPES_CLASSES = {
  google: "google-sign-in",
  inverted: "inverted",
};

const Button = ({ children, buttonType, ...otherProps }) => {
  return (
    <button className={`button-container ${BUTTON_TYPES_CLASSES[buttonType]}`}>
      {children}
    </button>
  );
};

export default Button;
